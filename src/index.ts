import * as dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";

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

client.login(process.env.DISCORD_TOKEN)
const revereServer = await client.guilds.fetch(process.env.REVERE_SERVER_ID)
console.log(revereServer)
console.log("v.s.")
// console.log(await revereServer.members.fetch())
console.log(revereServer.members.cache)
// console.log(await client.channels.fetch("1256574383162527786"))