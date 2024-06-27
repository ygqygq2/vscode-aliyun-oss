import * as vscode from 'vscode';

import { AliOssConfiguration } from '../common/AliOssConfiguration';
import { WebCommand } from '../common/WebCommand';
import { BaseWebView } from './BaseWebView';

export class SettingWebview extends BaseWebView {
  public show(data: {
    ossPath: string;
    localPath: string;
    upFiles: string[];
    cb: (data: any, valid?: boolean) => void; // 更新 cb 函数的类型定义
  }) {
    this.createWebview(
      './web/webview-setting.html',
      'vscode-aliyun-oss:设置',
      vscode.ViewColumn.Active,
      true,
    );
    this.onDidReceiveMessage((e) => {
      if (e.type === WebCommand.INIT_OSS_CONFIG) {
        this.postMessage(WebCommand.GET_OSS_CONFIG, {
          config: AliOssConfiguration.geConfig(),
        });
      } else if (e.type === WebCommand.UPDATE_OSS_CONFIG) {
        data.cb(e.data, (valid: boolean) => {
          if (valid) {
            AliOssConfiguration.updateConfig(e.data);
            this.postMessage(WebCommand.UPDATE_OSS_CONFIG_SUCCESS, e.data);
          } else {
            this.postMessage(WebCommand.UPDATE_OSS_CONFIG_FAIL, e.data);
          }
        });
      }
    });
  }
}
