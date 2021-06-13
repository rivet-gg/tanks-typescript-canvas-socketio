import { io, Socket } from "socket.io-client";
import * as RIVET from "@rivet-gg/api-game";
import {Client} from "./Client";
import {GameState} from "../shared/Game";

export class Connection {
    public socket: Socket;

    public constructor(private _client: Client, public lobby: RIVET.MatchmakerLobby) {
        this.socket = io(`${lobby.ports[0].hostname}:${lobby.ports[0].source}`);
        this.socket.on("connect", this._onConnect.bind(this, lobby.player.token));
        this.socket.on("disconnect", this._onDisconnect.bind(this));
        this.socket.on("update", this._onUpdate.bind(this));
    }

    private _onConnect() {
        console.log("Initiating...");
        this.socket.emit("init", this.lobby.player.token, this._onInit.bind(this));
    }

    private _onInit() {
        console.log("Initiated.");
    }

    private _onUpdate(state: GameState) {
        this._client.game.applyState(state);
    }

    private _onDisconnect() {
    }
}