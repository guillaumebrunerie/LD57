import {
	CompleteLevel,
	LoseGame,
	Music,
	MusicMenu,
	StartLevel,
} from "./assets";
import { Enemy } from "./enemy";
import { ObstacleManager } from "./obstaclesManager";
import { Player } from "./player";
import { type Point } from "./utils";

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

	yBgOffset = Math.random();

	obstacleManager = new ObstacleManager(this);
	enemyManager = new EnemyManager(this);
	player = new Player(this);

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

		this.enemyManager.tick(delta);
		this.obstacleManager.tick(delta);
		if (this.depth > this.levelDepth * this.level) {
			this.level++;
			this.obstacleManager.nextLevel();
			this.enemyManager.nextLevel();
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

class EnemyManager {
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
			const x = (Math.random() * 2 - 1) * this.game.boundX;
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
