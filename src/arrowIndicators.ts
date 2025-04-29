export class ArrowIndicators {
	arrowIndicators: ArrowIndicator[] = [];
	constructor(count: number) {
		for (let i = 0; i < count; i++) {
			this.arrowIndicators.push(new ArrowIndicator());
		}
	}
	tick(delta: number) {
		for (const arrowIndicator of this.arrowIndicators) {
			arrowIndicator.tick(delta);
		}
	}
	reset() {
		for (const arrowIndicator of this.arrowIndicators) {
			arrowIndicator.refill();
		}
	}
	refill() {
		for (const arrowIndicator of this.arrowIndicators) {
			if (arrowIndicator.isEmpty()) {
				arrowIndicator.refill();
				return;
			}
		}
	}
	consume() {
		for (const arrowIndicator of this.arrowIndicators.toReversed()) {
			if (!arrowIndicator.isEmpty()) {
				arrowIndicator.consume();
				return;
			}
		}
	}
	isEmpty() {
		return this.arrowIndicators.every((arrowIndicator) =>
			arrowIndicator.isEmpty(),
		);
	}
	isFull() {
		return this.arrowIndicators.every(
			(arrowIndicator) => !arrowIndicator.isEmpty(),
		);
	}
}

export class ArrowIndicator {
	lt = 0;
	hasArrow = true;
	constructor(hasArrow = true) {
		this.hasArrow = hasArrow;
	}
	tick(delta: number) {
		this.lt += delta;
	}
	refill() {
		this.lt = 0;
		this.hasArrow = true;
	}
	consume() {
		this.hasArrow = false;
	}
	isEmpty() {
		return !this.hasArrow;
	}
}
