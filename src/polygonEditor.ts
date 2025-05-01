import { Polygon } from "pixi.js";
import { mod, type Point } from "./utils";
import { collidersData, type ColliderData } from "./obstaclesData";

export class PolygonEditor {
	colliderData: ColliderData;
	index = 0;

	constructor(data?: PolygonEditor) {
		this.index = data?.index ?? 0;
		this.colliderData = collidersData[this.index];
	}
	tick(_: number) {}

	switch(dx: number) {
		this.index = mod(this.index + dx, collidersData.length);
		this.colliderData = collidersData[this.index];
	}

	click(pos: Point) {
		this.colliderData.polygon = new Polygon(
			...this.colliderData.polygon.points,
			pos.x,
			pos.y,
		);
	}

	move(dx: number, dy: number) {
		this.colliderData.polygon = new Polygon(
			...this.colliderData.polygon.points.map((t, i) =>
				i % 2 === 0 ? t + dx : t + dy,
			),
		);
	}

	async save() {
		await navigator.clipboard.writeText(
			`new Polygon(${this.colliderData.polygon.points
				.map((t) => t.toFixed(2))
				.join(", ")})`,
		);
	}
}
