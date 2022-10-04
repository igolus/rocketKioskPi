const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, printf } = format;
const env=require('dotenv').config()
const conf=require('../../../conf/config.json');

require('winston-daily-rotate-file');

const kioskFormat = printf( ({ level, message, timestamp , ...metadata}) => {
    let msg = `${timestamp} [${level}] : ${message} `
    if(metadata) {
    }
    return msg
});

var transportWs = new transports.DailyRotateFile({
    filename: `../../logs/ws.log-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '1m',
    maxFiles: '14d'
});

var transportCommandChrome = new transports.DailyRotateFile({
    filename: `../../logs/command.log-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '1m',
    maxFiles: '14d'
});

var transportCommandReboot = new transports.DailyRotateFile({
    filename: `../../logs/commandReboot.log-%DATE%.log`,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '1m',
    maxFiles: '14d'
});

transportWs.on('rotate', function(oldFilename, newFilename) {
});

const {LoggingWinston} = require('@google-cloud/logging-winston');

const loggingWinstonWs = new LoggingWinston({
    logName: conf.deviceId + "_ws.log"
});

const loggingWinstonCommand = new LoggingWinston({
    logName: conf.deviceId + "_command.log"
});

const loggingWinstonCommandReboot = new LoggingWinston({
    logName: conf.deviceId + "commandreboot.log"
});

const loggerWs = createLogger({
    level: 'info',
    format: combine(
        format.colorize(),
        splat(),
        timestamp(),
        kioskFormat
    ),
    transports: [
        transportWs,
        new transports.Console(),
        loggingWinstonWs
    ],
    projectId: 'testDevice',
    //keyFilename: '../../../conf/totemsystem-5889b-firebase-adminsdk-p2mja-f9bb68a5da.json',
});

const loggerCommand = createLogger({
    level: 'info',
    format: combine(
        format.colorize(),
        splat(),
        timestamp(),
        kioskFormat
    ),
    transports: [
        transportCommandChrome,
        new transports.Console(),
        loggingWinstonCommand
    ]
});

const loggerCommandReboot = createLogger({
    level: 'info',
    format: combine(
        format.colorize(),
        splat(),
        timestamp(),
        kioskFormat
    ),
    transports: [
        transportCommandReboot,
        new transports.Console(),
    ]
});


module.exports = {
    loggerWs: loggerWs,
    loggerCommand: loggerCommand,
    loggerCommandReboot: loggerCommandReboot,
    kioskFormat: kioskFormat
}