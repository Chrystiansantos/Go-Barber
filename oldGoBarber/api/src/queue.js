import 'dotenv/config';

import Queue from './lib/Queue';

Queue.processQueue();

console.log('Servidor de envio de emails');
