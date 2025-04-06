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

	width = 50;

	posX = 1080 / 2;
	posY = 300;

	tapPos: Point | null = null;
	targetX: number | null = null;

	tapActionY: "up" | "down" | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	tick(delta: number) {
		if (this.movingLeft) {
			this.posX -= this.sideSpeed * delta;
		}
		if (this.movingRight) {
			this.posX += this.sideSpeed * delta;
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
		}
		this.posX = Math.max(minX, Math.min(this.posX, maxX));
		this.posY += this.game.cameraSpeed * delta;
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
		this.targetX = pos.x - this.tapPos.x;

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
