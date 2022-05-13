import multer from 'multer';
import crypto from 'crypto';
// extname ire retornar o formato do arquivo, jpg,git etc
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    // destino dos nossos arquivos
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // irei retornar o nome do arquivo
    filename: (req, file, cb) => {
      // cripto gera caracters aleatorios
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // res, é a resposta do randoBytes(caracters gerados)
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
