import type { Game } from "./game";

export class Obstacle {
	game: Game;
	x: number;
	y: number;
	width = 300;
	height = 50;
	color = 0xff0000;
	id: string;

	constructor(
		game: Game,
		x: number,
		y: number,
		width: number,
		color: number,
	) {
		this.game = game;
		this.id = Math.random().toString(36).substring(2, 15);
		this.x = x;
		this.y = y;
		this.width = width;
		this.color = color;
	}

	isOutOfBounds() {
		return this.y < this.game.depth - this.height;
	}
}
