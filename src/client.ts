import { Client, GatewayIntentBits } from 'discord.js';
import Config from 'src/config';
import { Logger } from '@src/logger/Logger';
import { LogLevel } from '@src/logger/enums/LogLevel';
import { EventsHandler } from '@src/utils/Events.handler';

export class CrashClient extends Client<true> {
    public readonly config = Config;
    public readonly logger: Logger;

    private readonly eventsHandler: EventsHandler;

    public constructor() {
        super({
            intents: Object.values(GatewayIntentBits) as GatewayIntentBits[]
        });

        this.logger = new Logger();
        this.eventsHandler = new EventsHandler(this);
    }

    public init() {
        this.logger.listen();
        if (Object.values(Config).some((value) => !value.toString())) {
            this.logger.log(LogLevel.ERROR, `Заполни конфиг броу <3`);
            process.exit(1);
        }

        this.login(this.config.token)
            .then(() => {
                this.eventsHandler.load();
                this.logger.log(
                    LogLevel.INFO,
                    `Клиент ${this.user.username} успешно загружен`
                );
            })
            .catch((error) => {
                this.logger.log(
                    LogLevel.ERROR,
                    `Ошибка загрузки клиента\n${error.stack ?? error}`
                );
                process.exit(1);
            });
    }
}
