import { Matrix, type Polygon, type Texture } from "pixi.js";
import type { Game } from "./game";
import type { Player } from "./player";

export type ObstacleData = {
	type: "wall" | "spike" | "rock";
	texture: Texture;
	polygon: Polygon;
};

export class Obstacle {
	game: Game;
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
	pivotX = 0;
	pivotY = 0;
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
		if (this.data.type == "rock") {
			this.pivotX = this.data.texture.width / 2;
		}
	}

	isOutOfBounds() {
		return this.y < this.game.depth - 1920;
	}

	polygon() {
		return this.data.polygon;
	}

	get z() {
		if (this.data.type == "wall") {
			return 0;
		} else {
			return 1;
		}
	}

	checkCollision(player: Player) {
		const polygon = this.polygon();
		const transform = Matrix.shared;
		transform.setTransform(
			this.x,
			this.y,
			this.pivotX,
			this.pivotY,
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
