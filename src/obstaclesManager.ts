import type { Game } from "./game";
import { Obstacle, type ObstacleData } from "./obstacle";
import { obstaclesData } from "./obstaclesData";
import {
	getObstaclePattern,
	getPatternSpacing,
	type Pattern,
} from "./obstaclesPatterns";
import type { Player } from "./player";

export const getPossibleObstacles = (_level: number) => {
	return obstaclesData[0];
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

	lastY = 2000;

	previousPatterns: Pattern[] = [];

	tick(_delta: number) {
		if (this.obstacles.some((o) => o.isOutOfBounds())) {
			this.obstacles = this.obstacles.filter((o) => !o.isOutOfBounds());
		}

		let needSort = false;
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
			needSort = true;
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
			needSort = true;
		}

		while (this.lastY <= this.game.depth + 1920) {
			this.lastY += getPatternSpacing(this.game.level);
			if (this.lastY >= this.game.levelDepth * this.game.levels) {
				break;
			}
			const pattern = getObstaclePattern(
				this.game.level,
				this.previousPatterns,
			);
			this.previousPatterns.push(pattern);
			for (const patternData of pattern.data) {
				const x =
					Math.random() * (patternData.x[1] - patternData.x[0]) +
					patternData.x[0];
				const y =
					Math.random() * (patternData.y[1] - patternData.y[0]) +
					patternData.y[0];
				this.obstacles.push(
					new Obstacle(
						this.game,
						x,
						this.lastY + y,
						patternData.flipped,
						obstaclesData[this.game.level - 1][patternData.index],
					),
				);
			}
			needSort = true;
		}

		if (needSort) {
			this.obstacles.sort((a, b) => a.z - b.z);
		}
	}

	nextLevel() {}

	checkCollision(player: Player) {
		for (const obstacle of this.obstacles) {
			if (obstacle.checkCollision(player)) {
				return true;
			}
		}
		return false;
	}
}
