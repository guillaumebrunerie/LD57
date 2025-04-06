import { Polygon } from "pixi.js";
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
		{
			type: "wall",
			texture: WallSpike_Level1_01,
			polygon: new Polygon(
				46.94,
				94.84,
				304.48,
				14.91,
				187.25,
				194.3,
				270.73,
				238.7,
				46.94,
				393.23,
			),
		},
		{
			type: "wall",
			texture: WallSpike_Level1_02,
			polygon: new Polygon(
				29.18,
				14.91,
				128.64,
				22.02,
				272.51,
				87.73,
				418.15,
				73.52,
				601.09,
				125.03,
				665.03,
				126.81,
				572.67,
				176.54,
				501.63,
				199.63,
				380.85,
				172.99,
				281.39,
				235.15,
				178.37,
				235.15,
				64.7,
				300.87,
				48.71,
				295.54,
			),
		},
		{
			type: "wall",
			texture: WallSpike_Level1_03,
			polygon: new Polygon(
				20.3,
				6.03,
				366.64,
				14.91,
				332.9,
				78.85,
				206.79,
				116.15,
				22.07,
				160.56,
			),
		},
		{
			type: "wall",
			texture: WallSpike_Level1_04,
			polygon: new Polygon(
				50.49,
				6.03,
				240.54,
				94.84,
				224.55,
				146.35,
				25.62,
				307.97,
			),
		},
	],
];

export const getPossibleObstacles = (_level: number) => {
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
