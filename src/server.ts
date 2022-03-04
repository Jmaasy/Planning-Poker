import * as express from 'express'
import * as http from 'http'
import * as socketio from 'socket.io'
import * as path from "path";
import * as cors from "cors";
import PlanningPoker from './planningPoker';
// const cors = require('cors');

const port = 5000
const app = express()
const server = http.createServer(app)
const io = new socketio.Server()

const planningPoker = new PlanningPoker();

app.use(cors());
app.use(express.static('public'));
app.get("/*", (req: any, res: any) => {
  res.sendFile(path.resolve("./client/index.html"));
});

io.attach(server, { cors: { origin: '*' }, allowEIO3: true });
io.on('connection', (socket) => {
  socket.on("create-user", (name: string) => planningPoker.userHandler.createUser(socket, socket.id, name))
  socket.on("create-room", _ => planningPoker.createRoom(socket, socket.id, "lol"));
  socket.on("join-room", (roomId: string) => planningPoker.joinRoom(socket, socket.id, roomId));
  socket.on("vote", (number: string) => planningPoker.vote(socket, socket.id, number));

  socket.on("disconnect", _ => planningPoker.removeUser(socket, socket.id));
  socket.on("reveal-votes", _ => planningPoker.revealVotes(socket, socket.id));
  socket.on("reset-votes", _ => planningPoker.resetVotes(socket, socket.id));
});

server.listen(port, () => console.log(`Running on port ${port}`));