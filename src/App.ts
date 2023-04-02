import fastify, { FastifyServerOptions, FastifyRequest, FastifyReply } from 'fastify';
import 'dotenv/config';
import UserModel from './schemas/User';
import mongoose from 'mongoose';
import fetch from 'node-fetch';


const serverOptions: FastifyServerOptions = {
    logger: true,
    ignoreTrailingSlash: true,
};
async function build() {
    const server = fastify(serverOptions);
    await mongoose.connect((process.env.MONGO_URI as string));

    server.register(import('@fastify/cookie'), {
        secret: process.env.COOKIE_SECRET,
    })

    server.get('/', (request: FastifyRequest, reply: FastifyReply) => {
        reply.send('GitHub social login implementation');
    });
    server.get('/login', (request: FastifyRequest, reply: FastifyReply) => {
        //check if user is logged in
        //if not, redirect to github login
        //if yes, redirect to home
        const isAuthorized = false; //TODO
        if (isAuthorized) {
            reply.redirect('/');
        } else {
            reply.redirect('/auth/github');
        }
    });
    server.get('/auth/github', (request: FastifyRequest, reply: FastifyReply) => {
        //redirect to github login
        // create url with params
        const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=${encodeURI('user:user public_repo')}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&state=${new Date().getTime()}`;
        reply.redirect(url);
    });
    server.get('/callback', async (request: FastifyRequest, reply: FastifyReply) => {
        //get code from github
        //exchange code for token
        //get user data
        //save user data
        //redirect to home
        const { code } = request.query as { code: string, state: string; };
        console.log(code)
        const accestokenreq = await fetch('https://github.com/login/oauth/access_token',{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: `{"code":"${code}","client_id":"${process.env.GITHUB_CLIENT_ID}","client_secret":"${process.env.GITHUB_CLIENT_SECRET}"}`
          });
        console.log(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET, code)
        const accessToken = ((await accestokenreq.json()) as {access_token:string}).access_token;

        if(!accessToken) return reply.code(401).send('Invalid code');
        const userreq = await fetch('https://api.github.com/user', {
            headers: {
                Accept: 'application/json',
                authorization: `Bearer ${accessToken}`,
            }
        });
        const userdata = await userreq.json() as { login:string, id: number, name: string};
        console.log(userdata);

        //if user already exists, update token
        const userExists = await UserModel.exists({ id: userdata.id });
        if (userExists) {
            await UserModel.updateOne({ id: userdata.id }, { token: accessToken });
            reply.setCookie('token', accessToken, {
                path: '/',
                secure: 'auto',
            });
            reply.redirect('/me');
            return;
        }
        const user = new UserModel({
            name: userdata.name,
            id: userdata.id,
            username: userdata.login,
            token: accessToken,
        });
        await user.save();
        reply.setCookie('token', accessToken, {
            path: '/',
            secure: 'auto',
        });
        reply.redirect('/me');
    });
    server.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
        //get user token from cookie

        const userToken = request.cookies.token;
        //not logged in
        if(!userToken) return reply.code(401).send('Not logged in');
        //display user data
        const user = await UserModel.findOne({ token: userToken });
        reply.send(user);
    });
    server.get('/users' , async (request: FastifyRequest, reply: FastifyReply) => {
        const users = await UserModel.find({});
        //send only the user name and id, not the tokens
        reply.send(users.map(user => ({ name: user.name, id: user.id })));
    });
    server.get('/star', async (request: FastifyRequest, reply: FastifyReply) => {
        //get user token from cookie
        const userToken = request.cookies.token;
        //not logged in
        if(!userToken) return reply.code(401).send('Not logged in');
        //get target repo from query
        const { repo } = request.query as { repo: string };
        if(!repo) return reply.code(400).send('No repo specified');

        // star repo
        const star = await fetch(`https://api.github.com/user/starred/${repo}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${userToken}`,
            },
        });
        console.log(star);
        if (star.status !== 204) return reply.code(500).send('Failed to star repo');
        reply.send('Succesfully starred ' + repo);
    });
    return server;
}
export default build;
