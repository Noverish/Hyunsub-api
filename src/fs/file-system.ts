import * as prettyBytes from 'pretty-bytes';
import * as fs from 'fs';
import { join, parse } from 'path';
import { File } from 'src/models';
const fsPromises = fs.promises;

export async function readdir(path: string): Promise<File[]> {
  try {
    await fsPromises.access(path, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    throw { msg: 'Cannot Access' };
  }

  const stat = await fsPromises.stat(path);
  if (stat.isFile()) {
    throw { msg: 'Cannot readdir file' };
  }

  const files = await fsPromises.readdir(path, { withFileTypes: true });
  const results: File[] = [];

  for (const f of files) {
    const isdir = f.isDirectory();
    const filePath = join(path, f.name);

    if (isdir) {
      const file: File = {
        isdir,
        path: filePath,
        name: f.name,
        size: null,
      };

      results.push(file);
    } else {
      const stat = fs.statSync(filePath);

      results.push({
        isdir,
        path: filePath,
        name: f.name,
        size: prettyBytes(stat.size),
      });
    }
  }

  return results;
}