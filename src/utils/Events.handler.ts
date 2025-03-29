import { globSync } from 'glob';
import { Event } from '@src/utils/Event';
import { CrashClient } from '@src/client';

export class EventsHandler {
    public constructor(private readonly client: CrashClient) {}

    load() {
        const eventPath = globSync(`src/app/events/*`);

        eventPath.map((path) => {
            const event = require(path).default as Event;

            if (event) {
                if (!event.options.once) {
                    this.client.on(
                        event.options.name,
                        event.execute.bind(null, this.client)
                    );
                } else {
                    this.client.once(
                        event.options.name,
                        event.execute.bind(null, this.client)
                    );
                }
            }
        });

        return true;
    }
}
