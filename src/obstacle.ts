import { Matrix, Texture, type Polygon } from "pixi.js";
import type { Player } from "./player";
import { getDuration } from "./Animation";
import { A_HeartExplosion, S_EnemyDiePuff, S_EnemyDieVoice } from "./assets";
import { seesaw, smoothTriangle } from "./utils";
import { playerData, playerPoints, type ColliderData } from "./obstaclesData";
import type { PatternData } from "./levelData";

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

export const firstTexture = (data: ColliderData): Texture => {
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
	colliderData: ColliderData;
	patternData: PatternData;

	isDestroyed = false;
	destroyTimeout = Infinity;

	constructor(
		x: number,
		y: number,
		flipped: boolean,
		colliderData: ColliderData,
		patternData: PatternData,
	) {
		this.id = Math.random().toString(36).substring(2, 15);
		this.originalX = x;
		this.originalY = y;
		this.x = x;
		this.y = y;
		this.scaleX = flipped ? -1 : 1;
		this.scaleY = 1;
		this.colliderData = colliderData;
		this.patternData = patternData;
		if (["wall", "spike"].includes(this.patternData.type)) {
			this.anchorX = 0;
		}
	}

	tick(delta: number) {
		this.lt += delta;
		this.destroyTimeout -= delta;
		if (this.isDestroyed) {
			return;
		}
		switch (this.patternData.type) {
			case "enemy-horizontal":
				if (
					this.patternData.frequency === undefined ||
					!this.patternData.range
				) {
					return;
				}
				this.x =
					smoothTriangle(this.lt / this.patternData.frequency) *
						(this.patternData.range[1] -
							this.patternData.range[0]) +
					this.patternData.range[0];
				this.scaleX =
					Math.floor(this.lt / this.patternData.frequency) % 2 === 0 ?
						1
					:	-1;
				break;
			case "enemy-vertical":
				if (
					this.patternData.frequency === undefined ||
					!this.patternData.range
				) {
					return;
				}
				this.y =
					this.originalY +
					smoothTriangle(this.lt / this.patternData.frequency) *
						(this.patternData.range[1] -
							this.patternData.range[0]) +
					this.patternData.range[0];
				break;
			case "enemy-still":
				if (
					this.patternData.frequency === undefined ||
					!this.patternData.radius
				) {
					return;
				}
				this.x =
					this.originalX +
					Math.cos(this.lt / this.patternData.frequency) *
						this.patternData.radius;
				this.y =
					this.originalY +
					Math.sin(this.lt / this.patternData.frequency) *
						this.patternData.radius;
				break;
			case "fireball":
				if (
					this.patternData.frequency === undefined ||
					!this.patternData.range ||
					this.patternData.dy == undefined
				) {
					return;
				}
				this.x =
					seesaw(this.lt / this.patternData.frequency) *
						(this.patternData.range[1] -
							this.patternData.range[0]) +
					this.patternData.range[0];
				this.y =
					this.originalY +
					seesaw(this.lt / this.patternData.frequency) *
						this.patternData.dy;
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
		void S_EnemyDiePuff.play({ volume: 0.2 });
		void S_EnemyDieVoice.play({ volume: 0.2 });
	}

	polygon() {
		return this.colliderData.polygon;
	}

	get z() {
		if (this.patternData.type == "wall") {
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
			this.anchorX * firstTexture(this.colliderData).width,
			this.anchorY * firstTexture(this.colliderData).height,
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

// class EnemyHorizontalMovement<T = unknown> {
// 	lt = 0;
// 	gameObject: T;
// 	frequency: number;
// 	range: [number, number];

// 	constructor(gameObject: T, frequency: number, range: [number, number]) {
// 		this.gameObject = gameObject;
// 		this.frequency = frequency;
// 		this.range = range;
// 	}

// 	tick(
// 		this: EnemyHorizontalMovement<{ transform: Transform }>,
// 		delta: number,
// 	) {
// 		this.lt += delta;
// 		this.gameObject.transform.x =
// 			smoothTriangle(this.lt / this.frequency) *
// 				(this.range[1] - this.range[0]) +
// 			this.range[0];
// 		this.gameObject.transform.scaleX =
// 			Math.floor(this.lt / this.frequency) % 2 === 0 ? 1 : -1;
// 	}
// }

// class Transform<T = unknown> {
// 	constructor(
// 		public gameObject: T,
// 		public x: number,
// 		public y: number,
// 		public pivotX: number,
// 		public pivotY: number,
// 		public scaleX: number,
// 		public scaleY: number,
// 		public rotation: number,
// 	) {}
// }

// class Destroyable<T = unknown> {
// 	isDestroyed = false;
// 	destroyTimeout = Infinity;
// 	constructor(public gameObject: T) {}
// 	destroy(destroyTimeout: number) {
// 		this.isDestroyed = true;
// 		this.destroyTimeout = destroyTimeout;
// 	}
// 	tick(delta: number) {
// 		this.destroyTimeout -= delta;
// 	}
// }

// class PolygonCollider<T = unknown> {
// 	constructor(public gameObject: T, public polygon: Polygon) {}

// 	points() {
// 		return Array.from(
// 			{ length: this.polygon.points.length / 2 },
// 			(_, i) => ({
// 				x: this.polygon.points[2 * i],
// 				y: this.polygon.points[2 * i + 1],
// 			}),
// 		);
// 	}

// 	checkCollision(
// 		this: PolygonCollider<{ transform: Transform; destroyable: Destroyable }>,
// 		other: PolygonCollider,
// 	) {
// 		if (this.gameObject.destroyable.isDestroyed) {
// 			return false;
// 		}
// 		const polygon = this.polygon;
// 		const transform = Matrix.shared;
// 		transform.setTransform(
// 			this.gameObject.transform.x,
// 			this.gameObject.transform.y,
// 			this.gameObject.transform.pivotX,
// 			this.gameObject.transform.pivotY,
// 			this.gameObject.transform.scaleX,
// 			this.gameObject.transform.scaleY,
// 			0,
// 			0,
// 			0,
// 		);
// 		for (const pos /* { x, y } */ of other.points() /* playerPoints */) {
// 			// const newX =
// 			// 	other.lookingLeft ?
// 			// 		0.5 * firstTexture(playerData).width - x
// 			// 	:	x - 0.5 * firstTexture(playerData).width;
// 			// const pos = transform.applyInverse({
// 			// 	x: player.posX + newX,
// 			// 	y: player.posY + y - 0.5 * firstTexture(playerData).height,
// 			// });
// 			if (polygon.contains(pos.x, pos.y)) {
// 				return true;
// 			}
// 		}
// 		return false;
// 	}
// }

// class Obstacle2 {
// 	transform = new Transform(this, 0, 0, 0, 0, 1, 1, 0);
// 	destroyable = new Destroyable(this);
// 	collider: PolygonCollider;
// 	constructor (
// 		public polygon: Polygon,
// 	) {
// 		this.collider = new PolygonCollider(this, polygon);
// 	}
// }
