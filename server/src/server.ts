import * as express from 'express'
import * as http from 'http'
import * as https from 'https'
import * as path from "path";
import * as cors from "cors";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import StoryPoker from './planningPoker';
import Logger from './logger';
import { Server } from "socket.io";
import { RegisterUserData } from './user/user';
import { buildResponse, emitToSelf } from './response';

const connected: Map<string, number> = new Map();
const env = dotenv.config();
const port = 443;
const planningPoker = new StoryPoker();
const app = express()
      app.use(cors());
      app.use(express.static('../client/build'));
      app.use("/public/images", express.static('../client/build/images'));
      app.use("/public/style", express.static('../client/build/style'));
      app.get("/*", (req: any, res: any) => {
        res.sendFile(path.resolve("../client/build/index.html"));
      });


const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }, allowEIO3: true, pingInterval: 50, transports: ["websocket"]});

io.on("connect_error", (err) => Logger.ERROR(err));
io.on('connection', (socket) => {
  socket.on("create-user", (userData: RegisterUserData) => {
    const connectedCount = connected.get(socket.handshake.address) ?? 0;
    if (connectedCount < (Number(process.env.LIMIT ?? 5))) {
      connected.set(socket.handshake.address, connectedCount + 1 );
      planningPoker.userHandler.createUser(socket, socket.id, userData);
    } else {
      Logger.ERROR("Maximum amount of users reached for given address");
      const resp = buildResponse(null, true, "Maximum amount of users reached");
      emitToSelf(socket, "registration-processed", resp);
    }
  })
  socket.on("validate-room", (roomId: string) => planningPoker.validateRoom(socket, roomId))
  socket.on("create-room", _ => planningPoker.createRoom(socket, socket.id, "lol"));
  socket.on("join-room", (roomId: string) => planningPoker.joinRoom(socket, socket.id, roomId));
  socket.on("get-room-state", (roomId: string) => planningPoker.getRoomState(socket, socket.id, roomId));
  socket.on("vote", (number: string) => planningPoker.vote(socket, socket.id, number));
  socket.on("disconnect", _ => {
    const connectedCount = connected.get(socket.handshake.address) ?? -1;
    if (connectedCount != -1 && connectedCount > 1) {
      connected.set(socket.handshake.address, connectedCount - 1 );
    } else if (connectedCount != -1) {
      connected.delete(socket.handshake.address);
    }

    planningPoker.removeUser(socket, socket.id);
  });
  socket.on("reveal-votes", _ => planningPoker.revealVotes(socket, socket.id));
  socket.on("reset-votes", _ => planningPoker.resetVotes(socket, socket.id));
});

server.listen(port, () => Logger.LOG("STARTING", `Running on port ${port}`));
