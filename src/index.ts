import * as dotenv from 'dotenv';
dotenv.config();
import createDiscordClient from "./services/createClient";
import Fastify from 'fastify'
import { dmUserBasic, dmUserEmbed } from './services/dmUser';
import { UserAlert } from './types/UserAlert';
import { ButtonBuilder, ButtonStyle, Events as DiscordEvents, TextChannel } from 'discord.js';
import { Button } from './types/Button';
import generateButtonRow from './utils/generateButtonRow';
import { SubOneTeamRegex, UnsubOneTeamRegex } from './constants';
import { subToTeam, unsubFromTeam } from './services/dbClient';

if (!process.env.FASTIFY_PORT) {
  throw new Error("Port can't be found")
}

const fastify = Fastify({
  logger: true
})
fastify.addHook('preHandler', (request, reply, next) => {
  const validationHeader = request.headers["revere-api-key"] || request.headers["Revere-Api-Key"];
  if (process.env.FASTIFY_ACCESS_KEY === validationHeader) {
    next()
  }
  else {
    reply
      .code(400)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ errorMsg: "Cannot interact with API endpoint without a valid key. foh!" })

    fastify.log.warn({ event: request }, "Tried to access API without valid key")
  }

})
const client = await createDiscordClient()

client.on(DiscordEvents.MessageCreate, async (message) => {
  //ignore messages that are from other bots or are posted in channels. Only responding to DMs for now
  if (message.author.bot || message.guildId != null) return;

  //look up user to determine if we have them in user db already. this will determine what type of reply to send
  // const actionRows = [];
  // for (let i = 0; i < buttons.length; i = i +5){
  //     if (!buttons[i]) break;
  //     actionRows.push(generateButtonRow(buttons.slice(i, i+4)))
  // }
  // const actionRow = generateButtonRow(buttons)
  message.author.send({ content: "Reply" /*, components: actionRows*/ })
})

client.on(DiscordEvents.InteractionCreate, async interaction => {

  if (!interaction.isButton()) return;
  const userId = interaction.user.id
  const teamId = interaction.customId?.split("_")[2]
  if (interaction.customId == `unsub_${userId}_all`) {
    //user requesting to unsub from all teams. ask if they're sure
  }
  if (UnsubOneTeamRegex.test(interaction.customId)) {
    //user wants to unsub from 1 team. do this, then send success message with option to resub.
    const deleteSuccessful = await unsubFromTeam(userId, teamId);
    if (deleteSuccessful) interaction.reply({ content: "Unsubscribed from {team}", components: [generateButtonRow([{ label: "Resubscribe to team", id: `sub_${userId}_${teamId}`, style: ButtonStyle.Primary }])], ephemeral: true})
    else interaction.reply({ content: "Unsubscribe attempt seems to have failed. You're likely already unsubscribed from this team.", ephemeral: true })
  }
  if (SubOneTeamRegex.test(interaction.customId)) {
    const subSuccessful = await subToTeam(userId, teamId)
    if (subSuccessful) interaction.reply({ content: `Successfully subscribed to ${subSuccessful}`, ephemeral: true })
  }


});

fastify.get('/test', async (request, reply) => {
  reply.send({ hello: 'world' })
})

fastify.post('/alert', async (request, reply) => {
  if (!request?.body?.data) return;
  const firstUser: UserAlert = request.body.data[0]

  // await dmUserBasic(client, firstUser.userId, `Match at ${firstUser.matches[0].link} provided by ${firstUser.matches[0].provider} starts in ${firstUser.matches[0].timeToStart}` )
  await dmUserEmbed(client, firstUser)
  reply.code(200).send();
})

const start = async () => {
  try {
    // @ts-ignore
    await fastify.listen({ port: parseInt(process.env.FASTIFY_PORT) })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()