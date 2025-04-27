import { Polygon } from "pixi.js";
import type { ObstacleData } from "./obstacle";
import { getPossibleObstacles } from "./obstaclesManager";
import { mod, type Point } from "./utils";

export class PolygonEditor {
	obstacle: ObstacleData;
	possibleObstacles = getPossibleObstacles(1);
	index = 0;

	constructor(data?: PolygonEditor) {
		this.index = data?.index ?? 0;
		this.obstacle = this.possibleObstacles[this.index];
	}
	tick(_: number) {}

	switch(dx: number) {
		this.index = mod(this.index + dx, this.possibleObstacles.length);
		this.obstacle = this.possibleObstacles[this.index];
	}

	click(pos: Point) {
		this.obstacle.polygon = new Polygon(
			...this.obstacle.polygon.points,
			pos.x,
			pos.y,
		);
	}

	async save() {
		await navigator.clipboard.writeText(
			`new Polygon(${this.obstacle.polygon.points
				.map((t) => t.toFixed(2))
				.join(", ")})`,
		);
	}
}
