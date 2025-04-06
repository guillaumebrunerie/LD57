import type { Game } from "./game";

const smoothTriangle = (t: number) => {
	const x = ((t % 2) + 2) % 2; // wrap to [0, 2)
	const raw = x < 1 ? x : 2 - x; // triangle shape in [0, 1]
	// Apply smoothstep-style easing
	const eased = raw * raw * (3 - 2 * raw);
	return 2 * eased - 1; // scale to [-1, 1]
};

export class Enemy {
	game: Game;
	x: number;
	y: number;
	width = 50;
	height = 50;
	color = 0x00ff00;
	id: string;
	scaleX = 1;

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
		this.frequency = 1;
	}

	tick(delta: number) {
		this.lt += delta;
		this.x =
			this.originalX +
			smoothTriangle(this.lt / this.frequency) * this.range;
		this.scaleX = Math.floor(this.lt / this.frequency) % 2 === 0 ? 1 : -1;
	}

	isOutOfBounds() {
		return this.y < this.game.depth - this.height;
	}
}
