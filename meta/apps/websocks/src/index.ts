import { WebSocketServer } from 'ws';
import { User } from './User';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  let user = new User(ws);
  console.log('clent connected to WS server')
  // console.log(user);
  console.log()
  ws.on('error', console.error);

  ws.on('close', () => {
    user?.destroy();
  });
});