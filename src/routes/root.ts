import {FastifyRequest, FastifyReply} from 'fastify'

export default async function (request: FastifyRequest, reply: FastifyReply) {
    reply.send('GitHub social login implementation')
}