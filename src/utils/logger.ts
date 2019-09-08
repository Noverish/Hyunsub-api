import * as morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment-timezone';
const rfs = require('rotating-file-stream');

morgan.token('remote-addr', (req, res) => {
  const ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;
  if(ip && typeof ip === 'string' && ip.split(':').length === 4) {
    return ip.split(':')[3];
  } else {
    return ip;
  }
});

morgan.token('date', (req, res) => {
  return moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
});

morgan.token('user_id', (req, res) => {
  return (req.user_id) ? req.user_id : undefined;
})

function fileName(time: Date | null, index: number): string {
  if (time) {
    return `${moment(time).format('YYYY-MM-DD')}.log`;
  } else {
    return `${moment().format('YYYY-MM-DD')}.log`;
  }
}

const consoleFormat = '[:date] <:remote-addr> :user_id - :method :status :response-time ms ":url"';
export const consoleLogger = morgan(consoleFormat);

const logDirectory = path.join(__dirname, '../../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs(fileName, {
  interval: '1h',
  path: logDirectory,
  immutable: true,
});

const fileFormat = '[:date] <:remote-addr> :user_id - :method :status :response-time ms ":url" ":user-agent"';
export const fileLogger = morgan(fileFormat, {
  stream: accessLogStream,
  skip: function (req, res) {
    if (req.user_id) {
      return req.user_id === 1 || req.user_id === 4;
    }
    return false
  }
});
