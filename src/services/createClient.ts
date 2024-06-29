import * as dotenv from 'dotenv';
dotenv.config();
import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from "discord.js";

export default async function createDiscordClient(): Promise<Client>{
if (!process.env.DISCORD_TOKEN || !process.env.REVERE_SERVER_ID){
    throw new Error("Env vars missing. Brick")
}
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
    ]
})

await client.login(process.env.DISCORD_TOKEN);
return client;
}