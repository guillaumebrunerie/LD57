import {
	CompleteLevel,
	// LoseGame,
	Music,
	MusicMenu,
	StartLevel,
} from "./assets";
import { Enemy } from "./enemy";
import { ObstacleManager as ObstaclesManager } from "./obstaclesManager";
import { Player } from "./player";
import { type Point } from "./utils";
import { PolygonEditor } from "./polygonEditor";

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
		| "win"
		| "polygonEditor" = "logo";
	polygonEditor = new PolygonEditor();

	depth = 0;
	baseSpeed = 600;
	speedIncrease = 40;
	cameraSpeed = this.baseSpeed;

	yBgOffset = Math.random();

	player = new Player(this);
	obstaclesManager = new ObstaclesManager(this);
	enemiesManager = new EnemiesManager(this);

	level = 0;
	levelDepth = 5000;

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

		this.enemiesManager.tick(delta);
		this.obstaclesManager.tick(delta);
		if (this.depth > this.levelDepth * this.level) {
			this.level++;
			this.obstaclesManager.nextLevel();
			this.enemiesManager.nextLevel();
			this.cameraSpeed = this.baseSpeed + this.level * this.speedIncrease;
		}

		if (this.obstaclesManager.checkCollision(this.player)) {
			this.gameOver();
		}
	}

	skipLogo() {
		this.state = "levelSelect";
		MusicMenu.singleInstance = true;
		void MusicMenu.play({ loop: true, volume: 0.5 });
		this.lt = 0;
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
		console.log("GAME OVER");
		// if (this.state == "gameover") {
		// 	return;
		// }
		// void LoseGame.play({ volume: 0.5 });
		// this.state = "gameover";
	}

	win() {
		void Music.pause();
		void CompleteLevel.play({ volume: 0.5 });
		this.state = "win";
		this.startLt = 0;
	}

	onEvent(type: "pointerdown" | "pointermove" | "pointerup", pos: Point) {
		switch (type) {
			case "pointerdown":
				this.player.onPointerDown(pos);
				break;
			case "pointermove":
				this.player.onPointerMove(pos);
				break;
			case "pointerup":
				this.player.onPointerUp();
				break;
		}
	}
}

class EnemiesManager {
	constructor(public game: Game) {}

	enemies: Enemy[] = [];

	lastY = 2000;

	minSpacingY = 2000;
	maxSpacingY = 3000;

	tick(delta: number) {
		if (this.enemies.some((e) => e.isOutOfBounds())) {
			this.enemies = this.enemies.filter((e) => !e.isOutOfBounds());
		}

		while (this.lastY <= this.game.depth + 1920) {
			this.lastY +=
				Math.random() * (this.maxSpacingY - this.minSpacingY) +
				this.minSpacingY;
			const x = (Math.random() * 2 - 1) * 450;
			this.enemies.push(new Enemy(this.game, x, this.lastY));
		}

		this.enemies.forEach((e) => {
			e.tick(delta);
		});
	}

	nextLevel() {
		this.minSpacingY *= 0.7;
		this.maxSpacingY *= 0.7;

		this.minSpacingY = Math.max(this.minSpacingY, 100);
		this.maxSpacingY = Math.max(this.maxSpacingY, 200);
	}
}
