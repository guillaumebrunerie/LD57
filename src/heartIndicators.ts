export class HeartIndicators {
	heartIndicators: HeartIndicator[] = [];
	constructor(count: number) {
		for (let i = 0; i < count; i++) {
			this.heartIndicators.push(new HeartIndicator());
		}
	}
	tick(delta: number) {
		for (const heartIndicator of this.heartIndicators) {
			heartIndicator.tick(delta);
		}
	}
	reset() {
		for (const heartIndicator of this.heartIndicators) {
			heartIndicator.refill();
		}
	}
	refill() {
		for (const heartIndicator of this.heartIndicators) {
			if (heartIndicator.isEmpty()) {
				heartIndicator.refill();
				return;
			}
		}
	}
	consume() {
		for (const heartIndicator of this.heartIndicators.toReversed()) {
			if (!heartIndicator.isEmpty()) {
				heartIndicator.consume();
				return;
			}
		}
	}
	isEmpty() {
		return this.heartIndicators.every((heartIndicator) =>
			heartIndicator.isEmpty(),
		);
	}
	isFull() {
		return this.heartIndicators.every(
			(heartIndicator) => !heartIndicator.isEmpty(),
		);
	}
}

export class HeartIndicator {
	lt = 0;
	hasHeart = true;
	constructor(hasHeart = true) {
		this.hasHeart = hasHeart;
	}
	tick(delta: number) {
		this.lt += delta;
	}
	refill() {
		this.lt = 0;
		this.hasHeart = true;
	}
	consume() {
		this.hasHeart = false;
	}
	isEmpty() {
		return !this.hasHeart;
	}
}
