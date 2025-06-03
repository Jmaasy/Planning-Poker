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
    Logger.LOG("SOCKET", `[create-user] Processing event for user with name ${userData.name} and spectator mode ${userData.spectator}`)

    const connectedCount = connected.get(socket.handshake.address) ?? 0;
    Logger.WARN(`Maximum amount of users reached for address ${socket.handshake.address} and username ${userData.name}`);
    
    connected.set(socket.handshake.address, connectedCount + 1 );
    planningPoker.userHandler.createUser(socket, socket.id, userData);
  })
  socket.on("validate-room", (roomId: string) => {
    Logger.LOG("SOCKET", `[validate-room] Processing event for room with ID ${roomId}`)
    planningPoker.validateRoom(socket, roomId)
  })
  socket.on("create-room", _ => {
    Logger.LOG("SOCKET", `[create-room] Processing event for user with id ${socket.id}`)
    planningPoker.createRoom(socket, socket.id, "lol")
  });
  socket.on("join-room", (roomId: string) => {
    Logger.LOG("SOCKET", `[join-room] Processing event for user with id ${socket.id} and room with id ${roomId}`)
    planningPoker.joinRoom(socket, socket.id, roomId)
  });
  socket.on("get-room-state", (roomId: string) => {
    Logger.LOG("SOCKET", `[get-room-state] Processing event for user with id ${socket.id} and room with id ${roomId}`)
    planningPoker.getRoomState(socket, socket.id, roomId)
  });
  socket.on("vote", (number: string) => {
    Logger.LOG("SOCKET", `[vote] Processing event for user with id ${socket.id} vote number ${number}`)
    planningPoker.vote(socket, socket.id, number)
  });
  socket.on("disconnect", _ => {
    Logger.LOG("SOCKET", `[disconnect] Processing disconnect for user with id ${socket.id}`)

    const connectedCount = connected.get(socket.handshake.address) ?? -1;
    if (connectedCount != -1 && connectedCount > 1) {
      connected.set(socket.handshake.address, connectedCount - 1 );
    } else if (connectedCount != -1) {
      connected.delete(socket.handshake.address);
    }

    planningPoker.removeUser(socket, socket.id);
  });
  socket.on("reveal-votes", _ => {
    Logger.LOG("SOCKET", `[reveal-votes] Processing event for user with id ${socket.id}`)
    planningPoker.revealVotes(socket, socket.id)
  });
  socket.on("reset-votes", _ => {
    Logger.LOG("SOCKET", `[reset-votes] Processing event for user with id ${socket.id}`)
    planningPoker.resetVotes(socket, socket.id)
  });
});

server.listen(port, () => Logger.LOG("STARTING", `Running on port ${port}`));
