import OSS = require('ali-oss');
import * as vscode from 'vscode';

export class AliOssConfiguration {
  /**
   * 获取configuration配置
   */
  public static geConfig(): any {
    const config = vscode.workspace.getConfiguration();
    return {
      accessKeyId: config.get('vscode-aliyun-oss.accessKeyId') || '',
      accessKeySecret: config.get('vscode-aliyun-oss.accessKeySecret') || '',
      bucket: config.get('vscode-aliyun-oss.bucket') || '',
      region: config.get('vscode-aliyun-oss.region') || '',
      // endpoint: config.get('vscode-aliyun-oss.endpoint') || '',
    };
  }

  public static isUserSetConfig(): boolean {
    const config: any = this.geConfig();
    return config.accessKeyId && config.accessKeySecret && config.bucket && config.region;
  }

  /**
   * 更新configuration配置
   */
  public static async updateConfig(option: any): Promise<void[]> {
    const config = vscode.workspace.getConfiguration();
    return Promise.all([
      config.update('vscode-aliyun-oss.accessKeyId', option.accessKeyId?.trim(), true),
      config.update('vscode-aliyun-oss.accessKeySecret', option.accessKeySecret?.trim(), true),
      config.update('vscode-aliyun-oss.bucket', option.bucket?.trim(), true),
      config.update('vscode-aliyun-oss.region', option.region?.trim(), true),
      // config.update('vscode-aliyun-oss.endpoint', option.endpoint?.trim(), true),
    ]);
  }
}
