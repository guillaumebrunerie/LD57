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
	}

	onPointerUp() {
		this.tapPos = null;
	}
}
