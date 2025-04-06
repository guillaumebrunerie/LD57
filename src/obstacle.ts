import { Matrix, type Polygon, type Texture } from "pixi.js";
import type { Game } from "./game";
import type { Player } from "./player";

export type ObstacleData = {
	type: "wall" | "center";
	texture: Texture;
	polygon: Polygon;
};

export class Obstacle {
	game: Game;
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
	id: string;
	data: ObstacleData;

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
		this.scaleX = flipped ? -1 : 1;
		this.scaleY = 1;
		this.data = data;
	}

	isOutOfBounds() {
		return this.y < this.game.depth - 1920 / 2;
	}

	polygon() {
		return this.data.polygon;
	}

	checkCollision(player: Player) {
		const polygon = this.polygon();
		const transform = Matrix.shared;
		transform.setTransform(
			this.x,
			this.y,
			0,
			0,
			this.scaleX,
			this.scaleY,
			0,
			0,
			0,
		);
		const pos = transform.applyInverse({ x: player.posX, y: player.posY });
		return polygon.contains(pos.x, pos.y);
	}
}
