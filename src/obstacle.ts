import { Matrix } from "pixi.js";
import type { Player } from "./player";
import { getDuration } from "./Animation";
import { A_HeartExplosion, S_EnemyDiePuff, S_EnemyDieVoice } from "./assets";
import { seesaw, smoothTriangle } from "./utils";
import {
	firstTexture,
	playerData,
	playerPoints,
	type ColliderData,
} from "./colliderData";
import type { PatternData } from "./levelData";

export class Obstacle {
	lt = Math.random() * 1000;
	originalX: number;
	originalY: number;
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
	pivotX: number;
	pivotY: number;
	rotation: number;
	id: string;
	colliderData: ColliderData;
	patternData: PatternData;

	isDestroyed = false;
	destroyTimeout = Infinity;

	constructor(
		{ x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0 },
		colliderData: ColliderData,
		patternData: PatternData,
	) {
		this.id = Math.random().toString(36).substring(2, 15);
		this.originalX = x;
		this.originalY = y;
		this.x = x;
		this.y = y;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.pivotX = colliderData.pivot.x;
		this.pivotY = colliderData.pivot.y;
		this.rotation = rotation;
		this.colliderData = colliderData;
		this.patternData = patternData;
	}

	tick(delta: number) {
		this.lt += delta;
		this.destroyTimeout -= delta;
		if (this.isDestroyed) {
			return;
		}
		switch (this.patternData.type) {
			case "enemy-horizontal": {
				const { range, speed } = this.patternData;
				const dRange = range[1] - range[0];
				this.x =
					smoothTriangle((this.lt * speed) / dRange) * dRange +
					range[0];
				this.scaleX =
					Math.floor((this.lt * speed) / dRange) % 2 === 0 ? 1 : -1;
				break;
			}
			case "enemy-vertical": {
				const { range, speed } = this.patternData;
				const dRange = range[1] - range[0];
				this.y =
					this.originalY +
					smoothTriangle((this.lt * speed) / dRange) * dRange +
					range[0];
				break;
			}
			case "enemy-still": {
				const { speed, radius } = this.patternData;
				this.x = this.originalX + Math.cos(this.lt * speed) * radius;
				this.y = this.originalY + Math.sin(this.lt * speed) * radius;
				break;
			}
			case "fireball": {
				const { range, speed } = this.patternData;
				const dRange = range[1] - range[0];
				const dy = dRange * Math.sin(this.rotation);
				this.x =
					seesaw((this.lt * speed) / Math.abs(dRange)) * dRange +
					range[0];
				this.y =
					this.originalY + seesaw((this.lt * speed) / dRange) * dy;
				break;
			}
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
			this.pivotX * firstTexture(this.colliderData).width,
			this.pivotY * firstTexture(this.colliderData).height,
			this.scaleX,
			this.scaleY,
			this.rotation,
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
