import 'dotenv/config';
import buildApp from './app';

const port = Number(process.env.PORT) || 3000;

async function main() {
  const app = await buildApp();
  try {
    await app.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
