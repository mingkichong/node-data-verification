import * as crypto from 'crypto';
import * as fs from 'fs';
import sortObject from 'sort-object-keys';

import { logger } from './logger';

const priPem = fs.readFileSync('./cert/private-key.pem');
const secret = priPem.toString('ascii');

const pubPem = fs.readFileSync('./cert/public-key.pem');
const pubKey = pubPem.toString('ascii');

const data = {
  a: true,
  e: [{ v: 'w', z: 'y', f: 'g' }, { h: ['j', 'i'] }],
  b: { c: 'd' },
  x: 'x',
};

const dataString = JSON.stringify(sortObject(data));
logger.info(dataString);

const signature = crypto.createSign('sha256').update(dataString).sign(secret, 'base64');
logger.info(signature);

const result = crypto.createVerify('sha256').update(JSON.stringify(sortObject(data))).verify(pubKey, signature, 'base64');
logger.info(result);
