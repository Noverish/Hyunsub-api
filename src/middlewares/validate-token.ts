import { Request, Response, NextFunction } from 'express';
import * as request from 'request';

import { AUTH_URL } from '@src/config';

export function auth(headers): Promise<request.Response> {
  return new Promise((resolve, reject) => {
    const options = {
      url: AUTH_URL,
      method: 'GET',
      headers: {
        'authorization': headers['authorization'],
        'cookie': headers['cookie'],
      },
    };
    
    request(options, (err: any, res: request.Response, body: any) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(res);
    })
  })
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  (async function() {
    const authRes: request.Response = await auth(req.headers);
    
    if(authRes.statusCode === 204) {
      req['userId'] = authRes.headers['x-hyunsub-userid'];
      next();
    } else if (authRes.statusCode === 401) {
      res.status(401);
      res.json({ msg: '로그인이 필요합니다' });
    } else {
      res.status(500);
      res.json(authRes.body);
    }
  })().catch(err => next(err));
};