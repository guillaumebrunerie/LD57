import {
	// S_CompleteLevel,
	// LoseGame,
	S_Music,
	S_MusicIntensity1,
	S_MusicIntensity2,
	S_MusicIntensity3,
	// S_StartLevel,
} from "./assets";
import { ObstacleManager as ObstaclesManager } from "./obstaclesManager";
import { Player } from "./player";
import { type Point } from "./utils";
import { PolygonEditor } from "./polygonEditor";
import { fadeVolume } from "./sound";
import type { Obstacle } from "./obstacle";

export class Game {
	lt = 0;
	startLt = 0;
	score = 0;

	isPaused = true;
	state: "startScreen" | "game" | "polygonEditor" = "startScreen";
	polygonEditor = new PolygonEditor();

	depth = 0;
	baseSpeed = 600;
	speedIncrease = 40;
	cameraSpeed = this.baseSpeed;

	yBgOffset = Math.random();

	player = new Player(this);
	obstaclesManager = new ObstaclesManager(this);

	level = 0;
	levelDepth = 15000;

	constructor() {}

	restart() {
		this.lt = 0;
		this.score = 0;
		this.state = "game";
		this.depth = 0;
		this.level = 0;
		this.player = new Player(this);
		this.obstaclesManager = new ObstaclesManager(this);
	}

	levels = 9;

	tick(delta: number) {
		if (this.isPaused) {
			return;
		}

		this.lt += delta;
		this.startLt += delta;
		if (this.state == "game" && this.player.lives > 0) {
			this.score += delta;
		}

		if (this.state == "startScreen" && this.lt >= 1.8) {
			this.start();
		}

		if (this.state !== "game") {
			return;
		}

		if (this.player.lives > 0) {
			if (this.level <= this.levels) {
				this.depth += this.cameraSpeed * delta;
				if (this.depth > this.levelDepth * this.level) {
					this.nextLevel();
				}
			} else {
				this.depth = this.levelDepth * this.levels;
			}
		}

		this.player.tick(delta);
		this.obstaclesManager.tick(delta);

		if (this.player.arrow) {
			const targetId = this.player.arrow.targetId;
			const target = this.obstaclesManager.obstacles.find(
				(obstacle) => obstacle.id == targetId,
			);
			if (!target || this.player.arrow.timeout < 0) {
				this.obstaclesManager.destroy(targetId);
				this.player.arrow = null;
			} else {
				this.player.arrow.angle = Math.atan2(
					target.y - this.player.arrow.y,
					target.x - this.player.arrow.x,
				);
			}
		}

		if (
			this.level < this.levels &&
			this.obstaclesManager.checkCollision(this.player) &&
			this.player.invincibleTimeout == 0
		) {
			this.player.hit();
		}
	}

	shoot() {
		const targets = this.obstaclesManager.obstacles.filter(
			(o) =>
				o.data.type.startsWith("enemy") &&
				!o.isDestroyed &&
				o.y > this.player.posY &&
				o.y < this.depth + 1920,
		);
		if (targets.length == 0) {
			return;
		}
		const distance = (a: Obstacle) =>
			Math.sqrt(
				Math.pow(a.x - this.player.posX, 2) +
					Math.pow(a.y - this.player.posY, 2),
			);
		targets.sort((a, b) => distance(a) - distance(b));
		const target = targets[0];
		const dx = target.x - this.player.posX;
		const dy = target.y - this.player.posY;
		this.player.shoot(
			Math.atan2(dy, dx),
			Math.sqrt(dx * dx + dy * dy),
			target.id,
		);
	}

	cheat() {
		if (import.meta.env.DEV) {
			this.player.lives = 3;
			this.player.arrows = 3;
		}
	}

	nextLevel() {
		this.level++;
		if (this.player.lives < 3) {
			this.player.lives++;
		}
		if (this.player.arrows < 3) {
			this.player.arrows++;
		}
		this.obstaclesManager.nextLevel();
		this.cameraSpeed = this.baseSpeed + this.level * this.speedIncrease;
		S_MusicIntensity1.singleInstance = true;
		S_MusicIntensity2.singleInstance = true;
		S_MusicIntensity3.singleInstance = true;

		const musicVolumes = [
			[2, 0, 0],
			[1.3, 0.7, 0],
			[0.7, 1.3, 0],
			[0, 2, 0],
			[0, 1.6, 0.4],
			[0, 1.2, 0.8],
			[0, 0.8, 1.2],
			[0, 0.4, 1.6],
			[0, 0, 2],
			[0, 0, 2],
		];

		const minVolume = 0.1;

		fadeVolume(
			S_MusicIntensity1,
			musicVolumes[this.level - 1][0] + minVolume,
			1000,
		);
		fadeVolume(
			S_MusicIntensity2,
			musicVolumes[this.level - 1][1] + minVolume,
			1000,
		);
		fadeVolume(
			S_MusicIntensity3,
			musicVolumes[this.level - 1][2] + minVolume,
			1000,
		);
	}

	clickStart() {
		this.isPaused = false;
	}

	start() {
		this.state = "game";
		this.lt = 0;
		S_MusicIntensity1.singleInstance = true;
		S_MusicIntensity2.singleInstance = true;
		S_MusicIntensity3.singleInstance = true;
		void S_MusicIntensity1.play({ loop: true, volume: 0.1 });
		void S_MusicIntensity2.play({ loop: true, volume: 0.1 });
		void S_MusicIntensity3.play({ loop: true, volume: 0.1 });
		S_MusicIntensity1.volume = 0.1;
		S_MusicIntensity2.volume = 0.1;
		S_MusicIntensity3.volume = 0.1;
	}

	reset() {
		this.isPaused = false;
		void S_Music.stop();
	}

	backToMainMenu() {
		this.reset();
		this.state = "startScreen";
		void S_Music.resume();
	}

	pause() {
		void S_Music.pause();
		void S_Music.pause();
		this.isPaused = true;
	}

	resume() {
		void S_Music.resume();

		this.isPaused = false;
	}

	autoPause() {
		if (this.state == "game") {
			this.pause();
		}
	}

	autoResume() {
		if (this.state == "game") {
			this.resume();
		}
	}

	// win() {
	// 	void S_Music.pause();
	// 	void S_CompleteLevel.play({ volume: 0.5 });
	// 	this.state = "win";
	// 	this.startLt = 0;
	// }

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
