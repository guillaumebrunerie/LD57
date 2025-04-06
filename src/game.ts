import {
	CompleteLevel,
	LoseGame,
	Music,
	MusicMenu,
	StartLevel,
} from "./assets";
import { Obstacle } from "./obstacle";
import { Player } from "./player";
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

	depth = 0;
	cameraSpeed = 700;

	boundX = 450;

	obstacleGenerator = new ObstacleGenerator(this);
	player = new Player(this);
	obstacles: Obstacle[] = [];

	level = 0;
	levelDepth = 10000;

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
		this.player.tick(delta);

		if (this.obstacles.some((o) => o.isOutOfBounds())) {
			this.obstacles = this.obstacles.filter((o) => !o.isOutOfBounds());
		}

		this.obstacleGenerator.tick(delta);
		if (this.depth > this.levelDepth * this.level) {
			this.level++;
			this.obstacleGenerator.nextLevel();
		}
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

class ObstacleGenerator {
	constructor(public game: Game) {}

	lastYLeft = 1000;
	lastYRight = 1000;

	minSpacingY = 800;
	maxSpacingY = 1200;
	minWidth = 50;
	maxWidth = 500;

	tick(_delta: number) {
		while (this.lastYLeft <= this.game.depth + 1920) {
			this.lastYLeft +=
				Math.random() * (this.maxSpacingY - this.minSpacingY) +
				this.minSpacingY;
			const width =
				Math.random() * (this.maxWidth - this.minWidth) + this.minWidth;
			this.game.obstacles.push(
				new Obstacle(
					this.game,
					-this.game.boundX + width / 2,
					this.lastYLeft,
					width,
					0xff0000,
				),
			);
		}

		while (this.lastYRight <= this.game.depth + 1920) {
			this.lastYRight +=
				Math.random() * (this.maxSpacingY - this.minSpacingY) +
				this.minSpacingY;
			const width =
				Math.random() * (this.maxWidth - this.minWidth) + this.minWidth;
			this.game.obstacles.push(
				new Obstacle(
					this.game,
					this.game.boundX - width / 2,
					this.lastYRight,
					width,
					0x0000ff,
				),
			);
		}
	}

	nextLevel() {
		this.minSpacingY *= 0.6;
		this.maxSpacingY *= 0.6;
	}
}
