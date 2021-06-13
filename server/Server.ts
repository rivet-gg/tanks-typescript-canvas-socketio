import * as RIVET from "@rivet-gg/api-game";
import fetch from "node-fetch";
import {Connection} from "./Connection";
import {Game} from "../shared/Game";
import {Server as SocketServer, Socket} from "socket.io";

export class Server {
    public static shared: Server;

    public game: Game;

    public rivet: RIVET.ServerApi;

    public constructor(public socketServer: SocketServer) {
        this.game = new Game();

        this.socketServer.on("connection", this._onConnection.bind(this));

        this.rivet = new RIVET.ServerApi(new RIVET.Configuration({
            fetchApi: fetch,
            accessToken: process.env.RIVET_LOBBY_TOKEN,
        }));
        this.rivet.lobbyReady({}).then(() => console.log("Lobby ready"));

        setInterval(this._update.bind(this), 50)
    }

    private async _onConnection(socket: Socket) {
        let connection = new Connection(this, socket);
    }

    private _update() {
        // Update the game
        this.game.update();

        // Broadcast the state
        this.socketServer.emit("update", this.game.createState());
    }
}