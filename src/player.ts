import type { Game } from "./game";
import type { Point } from "./utils";

export class Player {
	game: Game;

	sideSpeed = 800;

	movingLeft = false;
	movingRight = false;

	width = 50;

	posX = 0;
	posY = 150;

	tapPos: Point | null = null;
	tapActionX: "left" | "right" | null = null;
	tapActionY: "up" | "down" | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	tick(delta: number) {
		if (this.movingLeft || this.tapActionX === "left") {
			this.posX -= this.sideSpeed * delta;
		}
		if (this.movingRight || this.tapActionX === "right") {
			this.posX += this.sideSpeed * delta;
		}
		this.posX = Math.max(
			-this.game.boundX,
			Math.min(this.posX, this.game.boundX),
		);
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
	}

	onPointerMove(pos: Point) {
		if (!this.tapPos) {
			return;
		}

		const xThreshold = 50;
		const xThresholdRevert = 20;
		const dx = pos.x - this.tapPos.x;

		if (dx < -xThreshold) {
			this.tapActionX = "left";
		} else if (dx > xThreshold) {
			this.tapActionX = "right";
		} else if (Math.abs(dx) < xThresholdRevert) {
			this.tapActionX = null;
		}

		const yThreshold = 100;
		const yThresholdRevert = 50;
		const dy = pos.y - this.tapPos.y;

		if (dy < -yThreshold) {
			this.tapActionY = "up";
		} else if (dy > yThreshold) {
			this.tapActionY = "down";
		} else if (Math.abs(dy) < yThresholdRevert) {
			this.tapActionY = null;
		}
	}

	onPointerUp() {
		this.tapPos = null;
		this.tapActionX = null;
		this.tapActionY = null;
	}
}
