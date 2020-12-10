import * as crypto from 'crypto';
import * as fs from 'fs';
import { isArray, isPlainObject as _isPlainObject } from 'lodash';

import { logger } from './logger';

const priPem = fs.readFileSync('./cert/private-key.pem');
const secret = priPem.toString('ascii');

const pubPem = fs.readFileSync('./cert/public-key.pem');
const pubKey = pubPem.toString('ascii');

const data = {
  a: true,
  e: [{ v: 1, z: 1, f: { t:1, p:1, s:1 } }, { h: ['o', 'j', 'i'] }],
  b: { c: 1 },
  x: 1,
};

const dataString = JSON.stringify(sortObjectKeysRecursively(data));
logger.info(dataString);

const signature = crypto.createSign('sha256').update(dataString).sign(secret, 'base64');
logger.info(signature);

const result = crypto.createVerify('sha256').update(JSON.stringify(sortObjectKeysRecursively(data))).verify(pubKey, signature, 'base64');
logger.info(result);

function sortObjectKeysRecursively(obj: unknown, sortFn?: (a:string, b:string) => number): unknown {
  if (isPlainObject(obj)) {
    const newObject: Record<string, unknown> = {};
    for(const key of Object.keys(obj).sort()){
      newObject[key] = sortObjectKeysRecursively(obj[key], sortFn);
    }
    return newObject;
  } else if(isArray(obj)){
    return obj.map((item) => sortObjectKeysRecursively(item), sortFn);
  } else {
    return obj;
  }
}

function isPlainObject(maybeObj: any): maybeObj is Record<string, any> {
  return _isPlainObject(maybeObj);
}
