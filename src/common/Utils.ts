import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const byteSize = require('byte-size');

export interface Progress {
  progress: vscode.Progress<{ message?: string; increment?: number }>;
  progressResolve: (value?: unknown) => void;
  progressReject: (value?: unknown) => void;
}

export function getProgress(title = 'Uploading object'): Progress {
  let progressResolve, progressReject, progress;
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title,
    },
    (p) => {
      return new Promise((resolve, reject) => {
        progressResolve = resolve;
        progressReject = reject;
        progress = p;
      });
    },
  );
  if (!progress || !progressResolve || !progressReject) {
    throw new Error('Failed to init vscode progress');
  }
  return {
    progress,
    progressResolve,
    progressReject,
  };
}

export function readFileList(dir: string, filesList: string[]) {
  const files = fs.readdirSync(dir);
  files.forEach((item: any) => {
    const fullPath: any = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList); //递归读取文件
    } else if (!fullPath.endsWith('.DS_Store')) {
      filesList.push(fullPath);
    }
  });
  return filesList;
}

export function getSizeString(size: number) {
  return byteSize(size, {
    toStringFn() {
      return `${Math.round(this.value)} ${this.unit}`;
    },
  }).toString();
}

export function isSupportTinyPng(file: string, size: number) {
  const ext = file.substr(file.lastIndexOf('.')).toLowerCase();
  return size <= 5200000 && /\.(png|jpg)$/.test(ext);
}

export function writeActiveText(str: string, isClipBoard: boolean) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    editor.edit((builder) => builder.replace(editor.selection, str));
  } else if (isClipBoard) {
    vscode.env.clipboard.writeText(str);
    vscode.window.showInformationMessage('已经成功复制到剪切板！');
  }
}
