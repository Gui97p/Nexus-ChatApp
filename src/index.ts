import "dotenv/config";
import Fastify from "fastify";

const app = Fastify({
    logger: true,
});
const port = Number(process.env.PORT) || 3000;

app.get("/ping", async () => ({ message: "pong!" }));

async function main() {
    try {
        await app.listen({ port, host: "0.0.0.0"});
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

main();
