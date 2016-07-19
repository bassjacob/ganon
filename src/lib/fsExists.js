import fs from 'fs';

export default function fsExists(path) {
  return new Promise((res, rej) => {
    fs.stat(path, err => {
      if (!err) return res(true);
      else if(err.code === 'ENOENT') return res(false);
      else return rej(err);
    });
  });
}

