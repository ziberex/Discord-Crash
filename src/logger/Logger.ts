import { LogLevel } from 'src/logger/enums/LogLevel';

export class Logger {
    public listen() {
        process
            .on('uncaughtException', (err: any) => {
                this.log(LogLevel.ERROR, err.stack || err);
            })
            .on('unhandledRejection', (err: any) => {
                this.log(LogLevel.ERROR, err.stack || err);
            });

        this.log(LogLevel.INFO, `Логер успешно запущен`);
    }

    public log(level: LogLevel, message: string) {
        console.log(this.formatLog(level, message) + '\n');
    }

    private formatLog(level: LogLevel, message: string) {
        const timestamp =
            new Date().toLocaleDateString() +
            ' | ' +
            new Date().toLocaleTimeString();
        return `[\x1b[97m${timestamp}\x1b[0m] [${level}]\n${message}`;
    }
}
