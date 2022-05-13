import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    // rename consigo mover um arquivo
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    );
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file);
    try {
      // verifico se o arquivo existe caso nao exista ele ira cair no catch
      await fs.promises.stat(filePath);
    } catch (error) {
      return;
    }
    // deleto o arquivo
    await fs.promises.unlink(filePath);
  }
}
