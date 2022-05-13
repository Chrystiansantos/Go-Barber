import uploadConfig from '@config/upload';
import path from 'path';
import aws, { S3 } from 'aws-sdk';
import fs from 'fs';
import mime from 'mime';
import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
  private cliente: S3;

  constructor() {
    this.cliente = new aws.S3({
      region: 'us-east-2',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);
    const ContentType = mime.getType(originalPath);
    if (!ContentType) {
      throw new Error('File not found');
    }
    const fileContent = await fs.promises.readFile(originalPath);

    await this.cliente
      .putObject({
        // nome do bucker la na aws
        Bucket: uploadConfig.config.aws.bucket,
        // nome do meu arquivo
        Key: file,
        // quais permissoes irei dar a esse arquivo, irei informar que ele sera legivel publicamente
        ACL: 'public-read',
        // conteudo que sera enviado para a aws
        Body: fileContent,
        // tipo do arquivo
        ContentType,
      })
      .promise();
    await fs.promises.unlink(originalPath);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.cliente
      .deleteObject({ Bucket: uploadConfig.config.aws.bucket, Key: file })
      .promise();
  }
}
