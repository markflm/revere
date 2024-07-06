import { ButtonStyle, Client, EmbedBuilder, EmbedData } from "discord.js";
import { createEmbedMessage, exampleEmbed } from "../utils/generateEmbedMessage";
import { UserAlert } from "../types/UserAlert";
import { Button } from "../types/Button";
import generateButtonRow from "../utils/generateButtonRow";

export async function dmUserBasic(client: Client, userId: string, message: string){
const user = await client.users.fetch(userId)
user.send(message).catch((err) => {
    console.error("Failed to send message to user", err)
})
}

export async function dmUserEmbed(client: Client, userAlert: UserAlert){
const user = await client.users.fetch(userAlert.userId)
// do we want to send multiple embeds at once?
const match = userAlert.matches[0]
console.log("MATCH")
console.log(match) 
const embedData: EmbedData = {};
embedData.title = `${match.subbedTeam}'s match is about to begin!`
embedData.description = `A match featuring ${match.subbedTeam} is scheduled to start in ${match.timeToStart} according to ${match.provider}.`
embedData.url = match.link
//todo - replace the content here. a footer makes the message look better.
embedData.footer = { text: 'Upgrade to Revere Pro for a better experience', iconURL: 'https://i.imgur.com/AfFp7pu.png' };
const msg = createEmbedMessage(embedData, match.game)
const buttons: Button[] = [{id: `unsub_${userAlert.userId}_${match.teamId}`, label: `Unsubscribe from ${match.subbedTeam}`, style: ButtonStyle.Danger }]

user.send({embeds: [msg], components: [generateButtonRow(buttons)]}).catch((err) => {
    console.error("Failed to send message to user", err)
})
}