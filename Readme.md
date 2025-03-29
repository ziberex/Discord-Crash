# Discord Crash Bot
## Stack

- Bun [download](https://bun.sh/)
- Discord.js

## Basic usage

1. Clone the repository
2. Install dependencies `bun install`
3. Fill src/config.ts with your data
4. Run the bot `bun init:bot`
5. Send !start-crash in any channel

## Need to know

1. Bot will automatically set **channelsToCreate** and **messagesPerChannel** to their maximum allowable limits if values **less than 0 or greater than 50/15** are provided.
2. Bot requires the **MANAGE_CHANNELS permission** to function properly on the server. Without this permission, it will not work.
3. The **author is not responsible** for any server crashes or disruptions caused by the use of this application.
