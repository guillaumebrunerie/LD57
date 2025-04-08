import { Matrix, type Polygon, type Texture } from "pixi.js";
import type { Game } from "./game";
import type { Player } from "./player";
import { getDuration } from "./Animation";
import { A_HeartExplosion, S_EnemyDiePuff, S_EnemyDieVoice } from "./assets";
import { smoothTriangle } from "./utils";

export type ObstacleData = {
	type: "wall" | "spike" | "rock" | "enemy-horizontal" | "enemy-vertical";
	texture: Texture;
	polygon: Polygon;
};

export class Obstacle {
	game: Game;
	lt = Math.random() * 1000;
	originalY: number;
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
	anchorX = 0.5;
	anchorY = 0.5;
	id: string;
	data: ObstacleData;
	frequency?: number;
	range?: [number, number];

	isDestroyed = false;
	destroyTimeout = Infinity;

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
		if (["wall", "spike"].includes(this.data.type)) {
			this.anchorX = 0;
		}
	}

	tick(delta: number) {
		this.lt += delta;
		this.destroyTimeout -= delta;
		if (this.frequency === undefined || !this.range || this.isDestroyed) {
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
		return (
			this.y < this.game.depth - 1920 ||
			(this.isDestroyed && this.destroyTimeout < 0)
		);
	}

	destroy() {
		this.isDestroyed = true;
		this.destroyTimeout = getDuration(A_HeartExplosion, 15);
		this.lt = 0;
		void S_EnemyDiePuff.play({ volume: 0.3 });
		void S_EnemyDieVoice.play({ volume: 0.3 });
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
		if (this.isDestroyed) {
			return false;
		}
		const polygon = this.polygon();
		const transform = Matrix.shared;
		transform.setTransform(
			this.x,
			this.y,
			this.anchorX * this.data.texture.width,
			this.anchorY * this.data.texture.height,
			this.scaleX,
			this.scaleY,
			0,
			0,
			0,
		);
		for (const { dx, dy } of [
			{ dx: -40, dy: -40 },
			{ dx: -40, dy: 40 },
			{ dx: 40, dy: -40 },
			{ dx: 40, dy: 40 },
		]) {
			const pos = transform.applyInverse({
				x: player.posX + dx,
				y: player.posY + dy,
			});
			if (polygon.contains(pos.x, pos.y)) {
				return true;
			}
		}
		return false;
	}
}
