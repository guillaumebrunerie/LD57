import { Obstacle } from "./obstacle";
import { collidersData } from "./colliderData";
import {
	getObstaclePattern,
	getPatternSpacing,
	type NumberOrRange,
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

	previousPatterns: { flipped: boolean; pattern: Pattern }[] = [];

	reset(level: number) {
		this.lastY = getPatternSpacing(level);
		this.previousPatterns = [];

		this.obstacles = [
			new Obstacle(
				{ x: 0, y: 1920 / 2 },
				collidersData[0],
				wallPatternData,
			),
			new Obstacle(
				{
					x: 1080,
					y: 1920 / 2,
					scaleX: -1,
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
			const { pattern, flipped } = getObstaclePattern(
				this.lastY < nextLevelDepth ? level : level + 1,
				this.previousPatterns,
			);
			this.instantiatePattern(pattern, flipped);
			this.previousPatterns.push({ pattern, flipped });
			needSort = true;
		}

		if (needSort) {
			this.obstacles.sort((a, b) => a.z - b.z);
		}

		this.obstacles.forEach((e) => {
			e.tick(delta);
		});
	}

	instantiatePattern(pattern: Pattern, flipped: boolean) {
		let maxY = this.lastY;
		for (let patternData of pattern) {
			if (patternData.type == "wall") {
				continue;
			}
			const getValue = (value: NumberOrRange): number => {
				if (typeof value == "number") {
					return value;
				} else {
					return value[0] + Math.random() * (value[1] - value[0]);
				}
			};
			const x =
				flipped ?
					1080 - getValue(patternData.transform.x || 0)
				:	getValue(patternData.transform.x || 0);
			const y = getValue(patternData.transform.y || 0);
			const scaleX =
				getValue(patternData.transform.scaleX || 1) *
				(flipped ? -1 : 1);
			const scaleY = getValue(patternData.transform.scaleY || 1);
			const rotation =
				(getValue(patternData.transform.rotation || 0) * Math.PI) / 180;
			const obstacleData = collidersData[pick(patternData.index)];
			if (patternData.type == "enemy-horizontal" && flipped) {
				patternData = {
					...patternData,
					range: [
						1080 - patternData.range[1],
						1080 - patternData.range[0],
					],
				};
			}
			this.obstacles.push(
				new Obstacle(
					{ x, y: this.lastY + y, scaleX, scaleY, rotation },
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
