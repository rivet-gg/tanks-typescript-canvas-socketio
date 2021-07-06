import { Client } from "../client/Client";
import { BarrelState, createBarrel } from "./barrel";
import { BulletState, updateBullet } from "./Bullet";
import { EntityState } from "./Entity";
import { PlayerState, updatePlayer } from "./Player";
import { Utilities } from "./Utilities";

export interface Game {
    isServer: boolean;
    lastUpdateTimestamp: number;
    idCounter: number;

    arenaSize: number;
    viewportHeight: number;

    state: GameState;
}

export interface GameState {
    players: { [id: number]: PlayerState };
    bullets: { [id: number]: BulletState };
    barrels: { [id: number]: BarrelState };
}

export function createGame(isServer: boolean): Game {
    let game = {
        isServer: isServer,
        lastUpdateTimestamp: Date.now(),
        idCounter: 1,

        arenaSize: 2000,
        viewportHeight: 900,

        state: {
            players: {},
            bullets: {},
            barrels: {},
        },
    };

    // Procedurally create barrels
    if(isServer){
        for (let i = 0; i < 16; i++) {
            let positionX = Utilities.lerp(-1000, 1000, Math.random());
            let positionY = Utilities.lerp(-1000, 1000, Math.random());
            createBarrel(game, positionX, positionY);
        }
    
    }
    return game;
}

export function generateId(game: Game): number {
    return game.idCounter++;
}

export function updateGame(game: Game) {
    // Determine the time since the last frame
    let now = Date.now();
    let dt = (now - game.lastUpdateTimestamp) / 1000; // Convert from milliseconds to seconds
    game.lastUpdateTimestamp = now;

    // Update all entities
    for (let playerId in game.state.players) {
        updatePlayer(game, game.state.players[playerId], dt);
    }
    for (let bulletId in game.state.bullets) {
        updateBullet(game, game.state.bullets[bulletId], dt);
    }
}
