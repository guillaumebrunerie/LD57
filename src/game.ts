import { S_StartButton, S_Win } from "./assets";
import { ObstacleManager as ObstaclesManager } from "./obstaclesManager";
import { Player } from "./player";
import { type Point } from "./utils";
import { PolygonEditor } from "./polygonEditor";
import type { Obstacle } from "./obstacle";
import { setMusic, startMusic } from "./musicManager";

export class Game {
	lt = 0;
	lastHit: { lt: number; x: number; y: number } | null = null;
	score = 0;
	cloudLt = 0;

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

	isWinning = false;

	constructor() {}

	restart() {
		this.lt = 0;
		this.lastHit = null;
		this.score = 0;
		this.state = "game";
		this.depth = 0;
		this.level = 0;
		this.player = new Player(this);
		this.obstaclesManager = new ObstaclesManager(this);
	}

	levels = 9;

	tick(delta: number) {
		this.cloudLt += delta;
		if (this.isPaused) {
			return;
		}

		this.lt += delta;
		if (this.state == "game" && this.player.lives > 0 && !this.isWinning) {
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

		if (this.player.arrow && this.player.arrow.targetId != "") {
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

		if (this.player.arrow?.targetId === "" && this.lt > 0.15) {
			this.player.arrow = null;
		}

		if (
			this.level <= this.levels &&
			this.obstaclesManager.checkCollision(this.player) &&
			this.player.invincibleTimeout == 0
		) {
			this.player.hit();
			this.lastHit = {
				lt: this.lt,
				x: this.player.posX,
				y: this.player.posY,
			};
		}
	}

	win() {
		if (!this.isWinning) {
			this.lt = 0;
			this.lastHit = null;
			this.isWinning = true;
			void S_Win.play({ volume: 0.5 });
			setMusic(10);
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
			dx,
		);
	}

	cheat() {
		if (import.meta.env.DEV) {
			this.player.lives = 4;
			this.player.arrows = 3;
		}
	}

	nextLevel() {
		this.level++;
		if (this.player.lives < 4) {
			this.player.lives++;
		}
		if (this.player.arrows < 3) {
			this.player.arrows++;
		}
		this.obstaclesManager.nextLevel();
		this.cameraSpeed = this.baseSpeed + this.level * this.speedIncrease;
		setMusic(this.level);
	}

	clickStart() {
		void S_StartButton.play({ volume: 0.5 });
		this.isPaused = false;
	}

	start() {
		this.state = "game";
		this.lt = 0;
		this.lastHit = null;
		startMusic();
		setMusic(1);
	}

	reset() {
		this.isPaused = false;
	}

	backToMainMenu() {
		this.reset();
		this.state = "startScreen";
	}

	pause() {
		this.isPaused = true;
	}

	resume() {
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
