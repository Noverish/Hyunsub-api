export * from './subtitle';

export const forbiddenError = createError(403, 'Forbidden');

export function createError(statusCode: number, message: string) {
  return {
    status: statusCode,
    msg: message,
  };
}

export const jwt = require('./jwt');
