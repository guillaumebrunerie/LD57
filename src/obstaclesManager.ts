import { Obstacle } from "./obstacle";
import { collidersData } from "./obstaclesData";
import {
	getObstaclePattern,
	getPatternSpacing,
	type Pattern,
	type PatternData,
} from "./levelData";
import type { Player } from "./player";
import { pick } from "./utils";

const wallPatternData: PatternData = { type: "wall" };

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
			new Obstacle(
				{ x: 0, y: 1920 / 2, pivotX: 0 },
				collidersData[0],
				wallPatternData,
			),
			new Obstacle(
				{
					x: 1080,
					y: 1920 / 2,
					scaleX: -1,
					pivotX: 0,
				},
				collidersData[0],
				wallPatternData,
			),
		];
	}

	tick(delta: number, depth: number, level: number, nextLevelDepth: number) {
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
					{
						x: 0,
						y: this.lastYWallLeft,
						pivotX: 0,
					},
					collidersData[0],
					wallPatternData,
				),
			);
			needSort = true;
		}

		while (this.lastYWallRight <= depth + 1920) {
			this.lastYWallRight += 1920;
			this.obstacles.push(
				new Obstacle(
					{
						x: 1080,
						y: this.lastYWallRight,
						pivotX: 0,
						scaleX: -1,
					},
					collidersData[0],
					wallPatternData,
				),
			);
			needSort = true;
		}

		while (this.lastY <= depth + 1920) {
			this.lastY += getPatternSpacing(
				this.lastY < nextLevelDepth ? level : level + 1,
			);
			if (level == 9 && this.lastY >= nextLevelDepth) {
				break;
			}
			const { pattern, side } = getObstaclePattern(
				this.lastY < nextLevelDepth ? level : level + 1,
				this.previousPatterns,
			);
			this.instantiatePattern(pattern, side);
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

	instantiatePattern(pattern: Pattern, side: "left" | "right") {
		let maxY = this.lastY;
		for (const patternData of pattern) {
			if (patternData.type == "wall") {
				continue;
			}
			const xMin =
				side == "right" ? 1080 - patternData.x[1] : patternData.x[0];
			const xMax =
				side == "right" ? 1080 - patternData.x[0] : patternData.x[1];
			const yMin = patternData.y[0];
			const yMax = patternData.y[1];
			const x = xMin + Math.random() * (xMax - xMin);
			const y = yMin + Math.random() * (yMax - yMin);
			const scaleX =
				("flipped" in patternData && patternData.flipped ? -1 : 1) *
				(side == "right" ? -1 : 1);
			const obstacleData = collidersData[pick(patternData.index)];
			if (patternData.type == "enemy-horizontal") {
				patternData.range =
					side == "right" && patternData.range ?
						[
							1080 - patternData.range[1],
							1080 - patternData.range[0],
						]
					:	patternData.range;
			}
			this.obstacles.push(
				new Obstacle(
					{ x, y: this.lastY + y, scaleX },
					obstacleData,
					patternData,
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
