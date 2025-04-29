import { Obstacle, type ObstacleData } from "./obstacle";
import { obstaclesData } from "./obstaclesData";
import {
	getObstaclePattern,
	getPatternSpacing,
	type Pattern,
} from "./obstaclesPatterns";
import type { Player } from "./player";
import { pick } from "./utils";

export const getPossibleObstacles = (_level: number) => {
	return obstaclesData[0];
};

const getRandomObstacle = (level: number, type: ObstacleData["type"]) => {
	const obstacles = getPossibleObstacles(level).filter((o) => o.type == type);
	return obstacles[Math.floor(Math.random() * obstacles.length)];
};

export class ObstacleManager {
	constructor() {}

	obstacles: Obstacle[] = [];

	lastYWallLeft = Math.random() * 1920 - 1920 * 2;
	lastYWallRight = Math.random() * 1920 - 1920 * 2;

	lastY = 1500;

	previousPatterns: { side: "left" | "right"; pattern: Pattern }[] = [];

	reset(level: number) {
		this.lastY = getPatternSpacing(level);
		this.previousPatterns = [];

		this.obstacles = [
			new Obstacle(0, 1920 / 2, false, getRandomObstacle(level, "wall")),
			new Obstacle(
				1080,
				1920 / 2,
				true,
				getRandomObstacle(level, "wall"),
			),
		];
	}

	tick(
		delta: number,
		levelDepth: number,
		depth: number,
		level: number,
		levels: number,
	) {
		const getLevel = (y: number) => Math.ceil(y / levelDepth);
		if (this.obstacles.some((o) => o.isOutOfBounds(depth))) {
			this.obstacles = this.obstacles.filter(
				(o) => !o.isOutOfBounds(depth),
			);
		}

		let needSort = false;
		while (this.lastYWallLeft <= depth + 1920) {
			this.lastYWallLeft += 1920;
			this.obstacles.push(
				new Obstacle(
					0,
					this.lastYWallLeft,
					false,
					getRandomObstacle(level, "wall"),
				),
			);
			needSort = true;
		}

		while (this.lastYWallRight <= depth + 1920) {
			this.lastYWallRight += 1920;
			this.obstacles.push(
				new Obstacle(
					1080,
					this.lastYWallRight,
					true,
					getRandomObstacle(level, "wall"),
				),
			);
			needSort = true;
		}

		while (this.lastY <= depth + 1920) {
			this.lastY += getPatternSpacing(level);
			if (this.lastY >= levelDepth * levels) {
				break;
			}
			const { pattern, side } = getObstaclePattern(
				level,
				this.previousPatterns,
			);
			this.instantiatePattern(pattern, side, getLevel(this.lastY));
			this.previousPatterns.push({ pattern, side });
			needSort = true;
		}

		if (needSort) {
			this.obstacles.sort((a, b) => a.z - b.z);
		}

		this.obstacles.forEach((e) => {
			e.tick(delta);
		});
	}

	instantiatePattern(
		pattern: Pattern,
		side: "left" | "right",
		level: number,
	) {
		let maxY = this.lastY;
		for (const patternData of pattern) {
			const xMin =
				side == "right" ? 1080 - patternData.x[1] : patternData.x[0];
			const xMax =
				side == "right" ? 1080 - patternData.x[0] : patternData.x[1];
			const yMin = patternData.y[0];
			const yMax = patternData.y[1];
			const x = xMin + Math.random() * (xMax - xMin);
			const y = yMin + Math.random() * (yMax - yMin);
			const flipped =
				side == "right" ? !patternData.flipped : patternData.flipped;
			const obstacleData =
				obstaclesData[level - 1][pick(patternData.index)];
			const range: [number, number] | undefined =
				(
					side == "right" &&
					obstacleData.type == "enemy-horizontal" &&
					patternData.range
				) ?
					[1080 - patternData.range[1], 1080 - patternData.range[0]]
				:	patternData.range;
			const radius = patternData.radius;
			this.obstacles.push(
				new Obstacle(
					x,
					this.lastY + y,
					flipped,
					obstacleData,
					patternData.frequency,
					range,
					radius,
					patternData.dy,
				),
			);
			maxY = Math.max(maxY, this.lastY + y);
		}
		this.lastY = maxY;
	}

	checkCollision(player: Player) {
		for (const obstacle of this.obstacles) {
			if (obstacle.checkCollision(player)) {
				return true;
			}
		}
		return false;
	}

	destroy(targetId: string) {
		for (const obstacle of this.obstacles) {
			if (obstacle.id == targetId) {
				obstacle.destroy();
			}
		}
	}
}
