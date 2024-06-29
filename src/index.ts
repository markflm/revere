import * as dotenv from 'dotenv';
dotenv.config();
import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from "discord.js";

console.log(process.env.DISCORD_TOKEN)
console.log(process.env.REVERE_SERVER_ID)

if (!process.env.DISCORD_TOKEN || !process.env.REVERE_SERVER_ID){
    throw new Error("Env vars missing. Brick")
}
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages
    ]
})

await client.login(process.env.DISCORD_TOKEN)
