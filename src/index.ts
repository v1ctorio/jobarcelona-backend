import build from './App';

const main = async () => {
    const server = await build();

server.listen({port:3000}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
};
main()