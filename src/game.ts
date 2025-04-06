import {
	CompleteLevel,
	LoseGame,
	Music,
	MusicMenu,
	StartLevel,
} from "./assets";
import { Obstacle } from "./obstacle";
import { type Point } from "./utils";

export type PowerUp = "shockwave" | "push" | "bomb" | "hologram" | "freeze";

export class Game {
	lt = 0;
	startLt = 0;

	isPaused = false;
	state:
		| "logo"
		| "levelSelect"
		| "gameStarting"
		| "game"
		| "gameover"
		| "win" = "logo";

	posX = 0;
	posY = 150;
	depth = 0;
	cameraSpeed = 700;
	sideSpeed = 800;

	movingLeft = false;
	movingRight = false;

	boundX = 450;

	obstacles: Obstacle[] = [];

	constructor() {}

	tick(delta: number) {
		if (this.isPaused) {
			return;
		}
		this.lt += delta;
		this.startLt += delta;

		if (this.state == "gameover") {
			return;
		}

		this.depth += this.cameraSpeed * delta;
		this.posY += this.cameraSpeed * delta;

		if (this.movingLeft) {
			this.posX -= this.sideSpeed * delta;
		}
		if (this.movingRight) {
			this.posX += this.sideSpeed * delta;
		}
		this.posX = Math.max(-this.boundX, Math.min(this.posX, this.boundX));
	}

	moveLeft(activate: boolean) {
		this.movingLeft = activate;
	}

	moveRight(activate: boolean) {
		this.movingRight = activate;
	}

	initLevel() {
		const boundsX = 450;
		const minSpacingY = 400;
		const maxSpacingY = 600;
		const minWidth = 50;
		const maxWidth = 500;
		let y = 1000;
		for (let i = 0; i < 40; i++) {
			y += Math.random() * (maxSpacingY - minSpacingY) + minSpacingY;
			const width = Math.random() * (maxWidth - minWidth) + minWidth;
			this.obstacles.push(
				new Obstacle(-boundsX + width / 2, y, width, 0xff0000),
			);
		}

		y = 1000;
		for (let i = 0; i < 40; i++) {
			y += Math.random() * (maxSpacingY - minSpacingY) + minSpacingY;
			const width = Math.random() * (maxWidth - minWidth) + minWidth;
			this.obstacles.push(
				new Obstacle(boundsX - width / 2, y, width, 0x0000ff),
			);
		}
	}

	skipLogo() {
		this.state = "levelSelect";
		MusicMenu.singleInstance = true;
		void MusicMenu.play({ loop: true, volume: 0.5 });
		this.initLevel();
	}

	reset() {
		this.isPaused = false;
		void Music.stop();
	}

	backToMainMenu() {
		this.reset();
		this.state = "levelSelect";
		void MusicMenu.resume();
	}

	startLevel() {
		void MusicMenu.pause();
		void StartLevel.play({ volume: 0.5 });
		this.state = "gameStarting";
		this.startLt = 0;

		setTimeout(() => {
			Music.singleInstance = true;
			void Music.play({ loop: true, volume: 0.3 });
		}, 700);

		this.initLevel();
	}

	pause() {
		void Music.pause();
		void MusicMenu.pause();
		this.isPaused = true;
	}

	resume() {
		if (this.state == "levelSelect") {
			void MusicMenu.resume();
		} else {
			void Music.resume();
		}
		this.isPaused = false;
	}

	autoPause() {
		if (
			this.state == "levelSelect" ||
			this.state == "game" ||
			this.state == "gameStarting"
		) {
			this.pause();
		}
	}

	autoResume() {
		if (this.state == "levelSelect") {
			this.resume();
		}
	}

	gameOver() {
		if (this.state == "gameover") {
			return;
		}
		void LoseGame.play({ volume: 0.5 });
		this.state = "gameover";
	}

	win() {
		void Music.pause();
		void CompleteLevel.play({ volume: 0.5 });
		this.state = "win";
		this.startLt = 0;
	}

	tap(_pos: Point) {}
}
