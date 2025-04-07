import type { Game } from "./game";
import type { Point } from "./utils";

const marginX = 10;
const minX = marginX;
const maxX = 1080 - marginX;

export class Player {
	game: Game;

	sideSpeed = 800;

	movingLeft = false;
	movingRight = false;

	lookingLeft = false;

	width = 50;

	posX = 1080 / 2;
	posY = 300;

	tapPos: Point | null = null;
	targetX: number | null = null;

	tapActionY: "up" | "down" | null = null;

	lives = 3;
	invincibleTimeout = 0;

	arrows = 3;
	arrow: Arrow | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	tick(delta: number) {
		this.arrow?.tick(delta);

		if (this.lives == 0) {
			return;
		}

		if (this.game.level > this.game.levels) {
			this.targetX = 250;
			this.movingLeft = false;
			this.movingRight = false;
		}
		if (this.movingLeft) {
			this.posX -= this.sideSpeed * delta;
			this.lookingLeft = true;
		}
		if (this.movingRight) {
			this.posX += this.sideSpeed * delta;
			this.lookingLeft = false;
		}
		if (!this.movingLeft && !this.movingRight && this.targetX !== null) {
			const speedFraction = Math.max(
				-1,
				Math.min(
					1,
					(this.targetX - this.posX) / this.sideSpeed / delta,
				),
			);
			this.posX += this.sideSpeed * speedFraction * delta;
			if (Math.abs(speedFraction) > 0.5) {
				this.lookingLeft = speedFraction < 0;
			}
		}
		this.posX = Math.max(minX, Math.min(this.posX, maxX));
		this.posY += this.game.cameraSpeed * delta;
		this.posY = Math.min(
			this.posY,
			this.game.levelDepth * this.game.levels + 1920 - 1200,
		);

		this.invincibleTimeout -= delta;
		if (this.invincibleTimeout < 0) {
			this.invincibleTimeout = 0;
		}
	}

	hit() {
		this.lives--;
		this.invincibleTimeout = 1.2;
	}

	shoot(angle: number, distance: number, targetId: string) {
		if (this.arrow || this.arrows <= 0) {
			return;
		}
		this.arrows--;
		this.arrow = new Arrow(this.posX, this.posY, angle, distance, targetId);
	}

	moveLeft(activate: boolean) {
		this.movingLeft = activate;
	}

	moveRight(activate: boolean) {
		this.movingRight = activate;
	}

	onPointerDown(pos: Point) {
		this.tapPos = pos;
		this.targetX = 0;
	}

	onPointerMove(pos: Point) {
		if (!this.tapPos) {
			return;
		}
		this.targetX = pos.x - this.tapPos.x + 1080 / 2;

		// const yThreshold = 100;
		// const yThresholdRevert = 50;
		// const dy = pos.y - this.tapPos.y;

		// if (dy < -yThreshold) {
		// 	this.tapActionY = "up";
		// } else if (dy > yThreshold) {
		// 	this.tapActionY = "down";
		// } else if (Math.abs(dy) < yThresholdRevert) {
		// 	this.tapActionY = null;
		// }
	}

	onPointerUp() {
		this.tapPos = null;
		this.tapActionY = null;
		this.targetX = null;
	}
}

export class Arrow {
	timeout: number;
	x: number;
	y: number;
	angle: number;
	targetId: string;
	speed = 5000;

	constructor(
		x: number,
		y: number,
		angle: number,
		distance: number,
		targetId: string,
	) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.targetId = targetId;
		this.timeout = distance / this.speed;
	}

	tick(delta: number) {
		this.x += Math.cos(this.angle) * this.speed * delta;
		this.y += Math.sin(this.angle) * this.speed * delta;
		this.timeout -= delta;
	}
}
