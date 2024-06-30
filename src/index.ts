import * as dotenv from 'dotenv';
dotenv.config();
import createDiscordClient from "./services/createClient";
import Fastify from 'fastify'
import { dmUserBasic } from './services/dmUser';
import { UserAlert } from './types/UserAlert';

if (!process.env.FASTIFY_PORT) {
    throw new Error("Port can't be found")
} 

const fastify = Fastify({
  logger: true
})
 const client = await createDiscordClient()

fastify.get('/test', async (request, reply) => {
    reply.send({ hello: 'world' })
  })

fastify.post('/alert', async (request, reply) => {
    fastify.log.info(request.body)
    if (!request?.body?.data) return;
    const firstUser: UserAlert = request.body.data[0]
 
    await dmUserBasic(client, firstUser.userId, `Match at ${firstUser.matches[0].link} provided by ${firstUser.matches[0].provider} starts in ${firstUser.matches[0].timeToStart}` )
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