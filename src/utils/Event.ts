interface EventOptions {
    name: string;
    once?: boolean;
}

export class Event {
    public constructor(
        public readonly options: EventOptions,
        public readonly execute: Function
    ) {}
}
