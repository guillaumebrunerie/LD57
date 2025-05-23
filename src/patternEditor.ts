import { clamp } from "./math";
import { ObstacleManager } from "./obstaclesManager";
import { levelData } from "./levelData";
import { mod } from "./utils";

export class PatternEditor {
	level = 1;
	patternIndex = 0;
	obstacleManager: ObstacleManager;
	lt = 0;

	constructor(
		data: { level: number; patternIndex: number } = {
			level: 1,
			patternIndex: 0,
		},
	) {
		this.obstacleManager = new ObstacleManager();
		this.level = data.level;
		this.patternIndex = mod(
			data.patternIndex,
			levelData[this.level - 1].patterns.length,
		);
		this.refresh();
	}

	tick(delta: number) {
		this.lt += delta;
		for (const obstacle of this.obstacleManager.obstacles) {
			obstacle.tick(delta);
		}
	}

	refresh() {
		this.obstacleManager.reset(this.level);
		this.obstacleManager.instantiatePattern(
			levelData[this.level - 1].patterns[this.patternIndex],
			false,
		);
	}

	switchPattern(dx: number) {
		this.patternIndex = mod(
			this.patternIndex + dx,
			levelData[this.level - 1].patterns.length,
		);
		this.refresh();
	}

	switchLevel(dx: number) {
		this.level = clamp(this.level + dx, 1, 9);
		this.patternIndex = 0;
		this.refresh();
	}
}
