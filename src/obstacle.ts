import { Matrix, Texture, type Polygon } from "pixi.js";
import type { Player } from "./player";
import { getDuration } from "./Animation";
import { A_HeartExplosion, S_EnemyDiePuff, S_EnemyDieVoice } from "./assets";
import { seesaw, smoothTriangle } from "./utils";
import { playerData, playerPoints } from "./obstaclesData";

export type ObstacleData = {
	type:
		| "wall"
		| "spike"
		| "rock"
		| "enemy-horizontal"
		| "enemy-vertical"
		| "enemy-still"
		| "fireball"
		| "player";
	texture:
		| { type: "texture-by-level"; textures: Texture[] }
		| {
				type: "animation";
				textures: Texture[];
				fps: number;
				blendMode: "normal" | "add";
		  };
	polygon: Polygon;
};

export const firstTexture = (data: ObstacleData): Texture => {
	if (data.texture.type == "texture-by-level") {
		return data.texture.textures[0];
	} else {
		return data.texture.textures[0];
	}
};

export class Obstacle {
	lt = Math.random() * 1000;
	originalX: number;
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
	radius?: number;

	isDestroyed = false;
	destroyTimeout = Infinity;

	constructor(
		x: number,
		y: number,
		flipped: boolean,
		data: ObstacleData,
		frequency?: number,
		range?: [number, number],
		radius?: number,
	) {
		this.id = Math.random().toString(36).substring(2, 15);
		this.originalX = x;
		this.originalY = y;
		this.x = x;
		this.y = y;
		this.scaleX = flipped ? -1 : 1;
		this.scaleY = 1;
		this.data = data;
		this.frequency = frequency;
		this.range = range;
		this.radius = radius;
		if (["wall", "spike"].includes(this.data.type)) {
			this.anchorX = 0;
		}
	}

	tick(delta: number) {
		this.lt += delta;
		this.destroyTimeout -= delta;
		if (this.isDestroyed) {
			return;
		}
		switch (this.data.type) {
			case "enemy-horizontal":
				if (this.frequency === undefined || !this.range) {
					return;
				}
				this.x =
					smoothTriangle(this.lt / this.frequency) *
						(this.range[1] - this.range[0]) +
					this.range[0];
				this.scaleX =
					Math.floor(this.lt / this.frequency) % 2 === 0 ? 1 : -1;
				break;
			case "enemy-vertical":
				if (this.frequency === undefined || !this.range) {
					return;
				}
				this.y =
					this.originalY +
					smoothTriangle(this.lt / this.frequency) *
						(this.range[1] - this.range[0]) +
					this.range[0];
				break;
			case "enemy-still":
				if (this.frequency === undefined || !this.radius) {
					return;
				}
				this.x =
					this.originalX +
					Math.cos(this.lt / this.frequency) * this.radius;
				this.y =
					this.originalY +
					Math.sin(this.lt / this.frequency) * this.radius;
				break;
			case "fireball":
				if (this.frequency === undefined || !this.range) {
					return;
				}
				this.x =
					seesaw(this.lt / this.frequency) *
						(this.range[1] - this.range[0]) +
					this.range[0];
				if (this.scaleX == 1) {
					this.x = 1080 / 2 - this.x;
				}

				break;
		}
	}

	isOutOfBounds(depth: number) {
		return (
			this.y < depth - 1920 ||
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
			this.anchorX * firstTexture(this.data).width,
			this.anchorY * firstTexture(this.data).height,
			this.scaleX,
			this.scaleY,
			0,
			0,
			0,
		);
		for (const { x, y } of playerPoints) {
			const newX =
				player.lookingLeft ?
					0.5 * firstTexture(playerData).width - x
				:	x - 0.5 * firstTexture(playerData).width;
			const pos = transform.applyInverse({
				x: player.posX + newX,
				y: player.posY + y - 0.5 * firstTexture(playerData).height,
			});
			if (polygon.contains(pos.x, pos.y)) {
				return true;
			}
		}
		return false;
	}
}
