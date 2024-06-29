import { Client, EmbedBuilder } from "discord.js";

export async function dmUserBasic(client: Client, userId: string, message: string){
const user = await client.users.fetch(userId)
user.send(message).catch((err) => {
    console.error("Failed to send message to user", err)
})
}

export async function dmUserEmbed(client: Client, userId: string, message: EmbedBuilder){
throw new Error("Not Implemented")
    
}