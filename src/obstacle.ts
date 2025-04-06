import type { Polygon, Texture } from "pixi.js";
import type { Game } from "./game";

export type ObstacleData = {
	type: "wall" | "center";
	texture: Texture;
	polygon: Polygon;
};

export class Obstacle {
	game: Game;
	x: number;
	y: number;
	id: string;
	data: ObstacleData;
	flipped: boolean;

	constructor(
		game: Game,
		x: number,
		y: number,
		flipped: boolean,
		data: ObstacleData,
	) {
		this.game = game;
		this.id = Math.random().toString(36).substring(2, 15);
		this.x = x;
		this.y = y;
		this.flipped = flipped;
		this.data = data;
	}

	isOutOfBounds() {
		return this.y < this.game.depth - 200;
	}
}
