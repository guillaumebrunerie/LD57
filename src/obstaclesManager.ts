import type { Game } from "./game";
import { Obstacle, type ObstacleData } from "./obstacle";
import { obstacles as obstacleData } from "./obstaclesData";
import type { Player } from "./player";

export const getPossibleObstacles = (_level: number) => {
	return obstacleData[0];
};

const getRandomObstacle = (level: number, type: ObstacleData["type"]) => {
	const obstacles = getPossibleObstacles(level).filter((o) => o.type == type);
	return obstacles[Math.floor(Math.random() * obstacles.length)];
};

export class ObstacleManager {
	constructor(public game: Game) {}

	obstacles: Obstacle[] = [];

	lastYWallLeft = 0;
	lastYWallRight = Math.random() * 1920 - 1920;

	lastYLeft = 2000;
	lastYRight = 2000;

	minSpacingY = 800;
	maxSpacingY = 1200;

	tick(_delta: number) {
		if (this.obstacles.some((o) => o.isOutOfBounds())) {
			this.obstacles = this.obstacles.filter((o) => !o.isOutOfBounds());
		}

		while (this.lastYWallLeft <= this.game.depth + 1920) {
			this.obstacles.push(
				new Obstacle(
					this.game,
					0,
					this.lastYWallLeft,
					false,
					getRandomObstacle(this.game.level, "wall"),
				),
			);
			this.lastYWallLeft += 1920;
		}

		while (this.lastYWallRight <= this.game.depth + 1920) {
			this.obstacles.push(
				new Obstacle(
					this.game,
					1080,
					this.lastYWallRight,
					true,
					getRandomObstacle(this.game.level, "wall"),
				),
			);
			this.lastYWallRight += 1920;
		}

		while (this.lastYLeft <= this.game.depth + 1920) {
			this.lastYLeft +=
				Math.random() * (this.maxSpacingY - this.minSpacingY) +
				this.minSpacingY;
			this.obstacles.push(
				new Obstacle(
					this.game,
					0,
					this.lastYLeft,
					false,
					getRandomObstacle(this.game.level, "spike"),
				),
			);
		}

		while (this.lastYRight <= this.game.depth + 1920) {
			this.lastYRight +=
				Math.random() * (this.maxSpacingY - this.minSpacingY) +
				this.minSpacingY;
			this.obstacles.push(
				new Obstacle(
					this.game,
					1080,
					this.lastYRight,
					true,
					getRandomObstacle(this.game.level, "spike"),
				),
			);
		}
	}

	nextLevel() {
		this.minSpacingY *= 0.8;
		this.maxSpacingY *= 0.8;

		this.minSpacingY = Math.max(this.minSpacingY, 100);
		this.maxSpacingY = Math.max(this.maxSpacingY, 200);
	}

	checkCollision(player: Player) {
		for (const obstacle of this.obstacles) {
			if (obstacle.checkCollision(player)) {
				return true;
			}
		}
		return false;
	}
}
