import type { Game } from "./game";

export class Enemy {
	game: Game;
	x: number;
	y: number;
	width = 50;
	height = 50;
	color = 0x00ff00;
	id: string;

	lt = 0;
	originalX: number;
	range: number;
	frequency: number;

	constructor(game: Game, x: number, y: number) {
		this.game = game;
		this.id = Math.random().toString(36).substring(2, 15);
		this.x = x;
		this.y = y;
		this.originalX = x;
		this.range = 200;
		this.frequency = 0.5;
	}

	tick(delta: number) {
		this.lt += delta;
		this.x =
			this.originalX + Math.sin(this.lt / this.frequency) * this.range;
	}

	isOutOfBounds() {
		return this.y < this.game.depth - this.height;
	}
}
