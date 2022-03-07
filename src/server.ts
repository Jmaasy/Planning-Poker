import * as express from 'express'
import * as http from 'http'
import * as https from 'https'
import * as socketio from 'socket.io'
import * as path from "path";
import * as cors from "cors";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import PlanningPoker from './planningPoker';
import Logger from './logger';

const env = dotenv.config();
const port = 443;
const planningPoker = new PlanningPoker();
const app = express()
// const server = https.createServer({
//   cert: fs.readFileSync(process.env.CRT),
//   key: fs.readFileSync(process.env.KEY)
// }, app);
const server = http.createServer(app);
const io = new socketio.Server();

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

server.listen(port, () => Logger.LOG("STARTING", `Running on port ${port}`));