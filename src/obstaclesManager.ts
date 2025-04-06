import {
	WallSpike_Level1_01,
	WallSpike_Level1_02,
	WallSpike_Level1_03,
	WallSpike_Level1_04,
} from "./assets";
import type { Game } from "./game";
import { Obstacle, type ObstacleData } from "./obstacle";

const possibleObstacles: ObstacleData[][] = [
	// Level 1
	[
		{ type: "wall", texture: WallSpike_Level1_01 },
		{ type: "wall", texture: WallSpike_Level1_02 },
		{ type: "wall", texture: WallSpike_Level1_03 },
		{ type: "wall", texture: WallSpike_Level1_04 },
	],
];

const getPossibleObstacles = (_level: number) => {
	return possibleObstacles[0];
};

const getRandomObstacle = (level: number) => {
	const obstacles = getPossibleObstacles(level);
	return obstacles[Math.floor(Math.random() * obstacles.length)];
};

export class ObstacleManager {
	constructor(public game: Game) {}

	obstacles: Obstacle[] = [];

	lastYLeft = 2000;
	lastYRight = 2000;

	minSpacingY = 800;
	maxSpacingY = 1200;

	minWidth = 150;
	maxWidth = 500;

	tick(_delta: number) {
		if (this.obstacles.some((o) => o.isOutOfBounds())) {
			this.obstacles = this.obstacles.filter((o) => !o.isOutOfBounds());
		}

		while (this.lastYLeft <= this.game.depth + 1920) {
			this.lastYLeft +=
				Math.random() * (this.maxSpacingY - this.minSpacingY) +
				this.minSpacingY;
			const width =
				Math.random() * (this.maxWidth - this.minWidth) + this.minWidth;
			this.obstacles.push(
				new Obstacle(
					this.game,
					-this.game.boundX + width / 2,
					this.lastYLeft,
					false,
					getRandomObstacle(this.game.level),
				),
			);
		}

		while (this.lastYRight <= this.game.depth + 1920) {
			this.lastYRight +=
				Math.random() * (this.maxSpacingY - this.minSpacingY) +
				this.minSpacingY;
			const width =
				Math.random() * (this.maxWidth - this.minWidth) + this.minWidth;
			this.obstacles.push(
				new Obstacle(
					this.game,
					this.game.boundX - width / 2,
					this.lastYRight,
					true,
					getRandomObstacle(this.game.level),
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
}
