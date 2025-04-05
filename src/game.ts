import {
	CompleteLevel,
	LoseGame,
	Music,
	MusicMenu,
	StartLevel,
} from "./assets";
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
	cameraSpeed = 500;
	sideSpeed = 500;

	movingLeft = false;
	movingRight = false;

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
	}

	moveLeft(activate: boolean) {
		this.movingLeft = activate;
	}

	moveRight(activate: boolean) {
		this.movingRight = activate;
	}

	skipLogo() {
		this.state = "levelSelect";
		MusicMenu.singleInstance = true;
		void MusicMenu.play({ loop: true, volume: 0.5 });
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
