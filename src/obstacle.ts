export class Obstacle {
	x: number;
	y: number;
	width = 300;
	height = 50;
	color = 0xff0000;

	constructor(x: number, y: number, color: number) {
		this.x = x;
		this.y = y;
		this.color = color;
	}
}
