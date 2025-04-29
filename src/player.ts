import { ArrowIndicators } from "./arrowIndicators";
import { S_ArrowShot, S_CupidHurt, S_GameOver } from "./assets";
import type { Game } from "./game";
import { HeartIndicators } from "./heartIndicators";
import { setMusic } from "./musicManager";
import type { Point } from "./utils";

const marginX = 10;
const minX = marginX;
const maxX = 1080 - marginX;

export class Player {
	game: Game;
	lt = 0;

	sideSpeed = 800;

	movingLeft = false;
	movingRight = false;

	isShooting = false;

	lookingLeft = false;

	width = 50;

	posX = 1080 / 2;
	posY = 300;

	tapPos: Point | null = null;
	baseTargetX = this.posX;
	targetX = this.posX;
	downLt = 0;

	tapActionY: "up" | "down" | null = null;

	isGameOver = false;
	heartIndicators = new HeartIndicators(3);
	invincibleTimeout = 0;

	arrowIndicators = new ArrowIndicators(3);
	arrow: Arrow | null = null;

	constructor(game: Game) {
		this.game = game;
	}

	tick(delta: number) {
		this.lt += delta;
		this.arrow?.tick(delta);

		if (this.isGameOver) {
			return;
		}

		if (this.game.level > this.game.levels) {
			this.targetX = 250;
			this.movingLeft = false;
			this.movingRight = false;
		}
		if (this.movingLeft) {
			this.posX -= this.sideSpeed * delta;
			this.targetX = this.posX;
			this.lookingLeft = true;
		}
		if (this.movingRight) {
			this.posX += this.sideSpeed * delta;
			this.targetX = this.posX;
			this.lookingLeft = false;
		}
		if (!this.movingLeft && !this.movingRight) {
			const absDelta = Math.max(
				-this.sideSpeed * delta,
				Math.min(this.sideSpeed * delta, this.targetX - this.posX),
			);
			this.posX += absDelta;
			if (Math.abs(absDelta) > this.sideSpeed * delta * 0.1) {
				this.lookingLeft = absDelta < 0;
			}
		}

		// // Level 2 wind
		// this.targetX += Math.cos(this.lt * 2) * 200 * delta;

		this.posX = Math.max(minX, Math.min(this.posX, maxX));
		this.posY += this.game.cameraSpeed * delta;
		const targetY = this.game.levelDepth * this.game.levels + 1920 - 1200;
		this.posY = Math.min(this.posY, targetY);

		if (
			this.game.level > this.game.levels &&
			Math.abs(this.posX - 250) < 1 &&
			Math.abs(this.posY - targetY) < 1 &&
			!this.game.isWinning
		) {
			this.game.win();
			this.finalShoot();
			this.lookingLeft = false;
		}

		this.invincibleTimeout -= delta;
		if (this.invincibleTimeout < 0) {
			this.invincibleTimeout = 0;
		}
	}

	hit() {
		if (this.heartIndicators.isEmpty()) {
			this.isGameOver = true;
			this.lt = 0;
			void S_GameOver.play({ volume: 0.2 });
			setMusic(0);
		} else {
			this.heartIndicators.consume();
			this.invincibleTimeout = 1.2;
			void S_CupidHurt.play({ volume: 0.5 });
		}
	}

	shoot(angle: number, distance: number, targetId: string, dx: number) {
		if (this.arrow || this.arrowIndicators.isEmpty() || this.isGameOver) {
			return;
		}
		this.lookingLeft = dx < 0;
		this.lt = 0;
		this.isShooting = true;
		this.arrowIndicators.consume();
		this.arrow = new Arrow(this.posX, this.posY, angle, distance, targetId);
		void S_ArrowShot.play({ volume: 0.5 });
	}

	finalShoot() {
		const targetX = 750;
		const targetY = this.game.levelDepth * this.game.levels + 1920 - 700;
		const dx = targetX - this.posX;
		const dy = targetY - this.posY;
		this.lt = 0;
		this.isShooting = true;
		this.arrow = new Arrow(
			this.posX,
			this.posY,
			Math.atan2(dy, dx),
			Math.sqrt(dx * dx + dy * dy),
			"",
		);
		void S_ArrowShot.play({ volume: 0.5 });
	}

	moveLeft(activate: boolean) {
		this.movingLeft = activate;
	}

	moveRight(activate: boolean) {
		this.movingRight = activate;
	}

	onPointerDown(pos: Point) {
		this.tapPos = pos;
		this.baseTargetX = this.targetX;
		this.downLt = this.lt;
	}

	onPointerMove(pos: Point) {
		if (!this.tapPos) {
			return;
		}
		this.targetX = this.baseTargetX + pos.x - this.tapPos.x;
	}

	onPointerUp() {
		this.tapPos = null;
		this.tapActionY = null;
		if (this.lt < this.downLt + 0.125) {
			this.game.shoot();
		}
	}
}

export class Arrow {
	timeout: number;
	x: number;
	y: number;
	angle: number;
	targetId: string;
	speed = 5000;

	constructor(
		x: number,
		y: number,
		angle: number,
		distance: number,
		targetId: string,
	) {
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.targetId = targetId;
		this.timeout = distance / this.speed;
	}

	tick(delta: number) {
		this.x += Math.cos(this.angle) * this.speed * delta;
		this.y += Math.sin(this.angle) * this.speed * delta;
		this.timeout -= delta;
	}
}
