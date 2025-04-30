import { S_AddHeartAndArrow, S_StartButton, S_Win } from "./assets";
import { ObstacleManager as ObstaclesManager } from "./obstaclesManager";
import { Player } from "./player";
import { type Point } from "./utils";
import type { Obstacle } from "./obstacle";
import { setMusic, startMusic } from "./musicManager";
import { createContext, use } from "react";
import { levelData, totalDuration } from "./levelData";

export const GameContext = createContext<Game | null>(null);
export const useGame = () => {
	const game = use(GameContext);
	if (!game) {
		throw new Error("useGame must be used within a GameProvider");
	}
	return game;
};

export class Game {
	lt = 0;
	lastHit: { lt: number; x: number; y: number } | null = null;
	score = 0;
	cloudLt = 0;

	isPaused = true;
	state: "startScreen" | "game" = "startScreen";

	depth = 0;
	cameraSpeed = 100;

	yBgOffset = Math.random();

	player = new Player(this);
	obstaclesManager = new ObstaclesManager();

	level = 0;
	nextLevelDepth = 0;

	isWinning = false;

	constructor(data?: Game) {
		// if (data) {
		// 	Object.assign(this, data);
		// }
	}

	restart() {
		this.lt = 0;
		this.lastHit = null;
		this.score = 0;
		this.state = "game";
		this.depth = 0;
		this.level = 0;
		this.player = new Player(this);
		this.obstaclesManager = new ObstaclesManager();
	}

	levels = 9;

	tick(delta: number) {
		this.cloudLt += delta;
		if (this.isPaused) {
			return;
		}

		this.lt += delta;
		if (
			this.state == "game" &&
			!this.player.isGameOver &&
			!this.isWinning
		) {
			this.score += delta;
		}

		if (this.state == "startScreen" && this.lt >= 1.8) {
			this.start();
		}

		if (this.state !== "game") {
			return;
		}

		if (!this.player.isGameOver) {
			if (this.level <= this.levels) {
				this.depth += this.cameraSpeed * delta;
				if (this.depth > this.nextLevelDepth) {
					this.nextLevel();
				}
			} else {
				this.depth = totalDuration;
			}
		}

		this.player.tick(delta);
		this.obstaclesManager.tick(
			delta,
			this.depth,
			this.level,
			this.nextLevelDepth,
		);

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
			this.player.invincibleTimeout == 0 &&
			!this.player.isGameOver
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
			void S_Win.play({ volume: 0.3 });
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
			this.player.isGameOver = false;
			this.player.heartIndicators.reset();
			this.player.arrowIndicators.reset();
		}
	}

	cheatToLevel(level: number) {
		if (import.meta.env.DEV) {
			if (this.level >= level) {
				return;
			}
			while (this.level < level) {
				const delta = this.nextLevelDepth - this.depth;
				this.depth += delta;
				this.player.posY += delta;
				this.nextLevelDepth += levelData[this.level].duration * 1920;
				this.level++;
			}
		}
	}

	nextLevel() {
		if (this.level < levelData.length) {
			this.nextLevelDepth += levelData[this.level].duration * 1920;
		} else {
			this.nextLevelDepth += 1920 * 2;
		}
		this.level++;
		if (
			!this.player.heartIndicators.isFull() ||
			!this.player.arrowIndicators.isFull()
		) {
			void S_AddHeartAndArrow.play({ volume: 0.3 });
		}
		this.player.heartIndicators.refill();
		this.player.arrowIndicators.refill();
		if (this.level <= levelData.length) {
			this.cameraSpeed = levelData[this.level - 1].speed;
		}
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
