import { Matrix, type Polygon, type Texture } from "pixi.js";
import type { Game } from "./game";
import type { Player } from "./player";

export type ObstacleData = {
	type: "wall" | "spike" | "rock" | "enemy-horizontal" | "enemy-vertical";
	texture: Texture;
	polygon: Polygon;
};

const smoothTriangle = (t: number) => {
	const x = ((t % 2) + 2) % 2; // wrap to [0, 2)
	const raw = x < 1 ? x : 2 - x; // triangle shape in [0, 1]
	// Apply smoothstep-style easing
	return raw * raw * (3 - 2 * raw);
};

export class Obstacle {
	game: Game;
	lt = 0;
	originalY: number;
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
	pivotX = 0;
	pivotY = 0;
	id: string;
	data: ObstacleData;
	frequency?: number;
	range?: [number, number];

	constructor(
		game: Game,
		x: number,
		y: number,
		flipped: boolean,
		data: ObstacleData,
		frequency?: number,
		range?: [number, number],
	) {
		this.game = game;
		this.id = Math.random().toString(36).substring(2, 15);
		this.originalY = y;
		this.x = x;
		this.y = y;
		this.scaleX = flipped ? -1 : 1;
		this.scaleY = 1;
		this.data = data;
		this.frequency = frequency;
		this.range = range;
		if (
			["rock", "enemy-vertical", "enemy-horizontal"].includes(
				this.data.type,
			)
		) {
			this.pivotX = this.data.texture.width / 2;
		}
	}

	tick(delta: number) {
		this.lt += delta;
		if (this.frequency === undefined || !this.range) {
			return;
		}
		if (this.data.type == "enemy-horizontal") {
			this.x =
				smoothTriangle(this.lt / this.frequency) *
					(this.range[1] - this.range[0]) +
				this.range[0];
			this.scaleX =
				Math.floor(this.lt / this.frequency) % 2 === 0 ? 1 : -1;
		}
		if (this.data.type == "enemy-vertical") {
			this.y =
				this.originalY +
				smoothTriangle(this.lt / this.frequency) *
					(this.range[1] - this.range[0]) +
				this.range[0];
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
