import Hapi from 'hapi';
import Nes from 'nes';

const server = new Hapi.Server({
  host: 'localhost',
  port: 8000
});

start(server);

await register(server);
addRoutes(server);

try {
  await server.start();
} catch (err) {
  console.error(err);
  process.exit(1);
}
console.log('Server running at:', server.info.uri);

async function register(server) {
  await server.register(Nes);
}

function addRoutes(server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
      reply('Yo');
    }
  });

  server.route({
    method: 'GET',
    path: '/{name}',
    handler: function(request, reply) {
      reply(`Yo, ${request.params.name}`);
    }
  });
}

