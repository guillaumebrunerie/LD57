export type NumberOrRange = number | [number, number];

export type TransformBlueprint = {
	x?: NumberOrRange;
	y?: NumberOrRange;
	scaleX?: NumberOrRange;
	scaleY?: NumberOrRange;
	rotation?: NumberOrRange;
};

export type PatternData =
	| {
			type: "wall";
	  }
	| {
			type: "spike";
			transform: TransformBlueprint;
			index: number[];
	  }
	| {
			type: "rock";
			transform: TransformBlueprint;
			index: number[];
	  }
	| {
			type: "enemy-horizontal";
			transform: TransformBlueprint;
			index: number[];
			speed: number;
			range: [number, number];
	  }
	| {
			type: "enemy-vertical";
			transform: TransformBlueprint;
			index: number[];
			speed: number;
			range: [number, number];
	  }
	| {
			type: "enemy-still";
			transform: TransformBlueprint;
			index: number[];
			speed: number;
			radius: number;
	  }
	| {
			type: "fireball";
			transform: TransformBlueprint;
			index: number[];
			speed: number;
			range: [number, number];
	  };

export type Pattern = PatternData[];

const spike1 = (transform: TransformBlueprint = {}): PatternData => ({
	type: "spike",
	transform,
	index: [1],
});

const spike2 = (transform: TransformBlueprint = {}): PatternData => ({
	type: "spike",
	transform,
	index: [2],
});

const spike3 = (transform: TransformBlueprint = {}): PatternData => ({
	type: "spike",
	transform,
	index: [3],
});

const spike4 = (transform: TransformBlueprint = {}): PatternData => ({
	type: "spike",
	transform,
	index: [4],
});

const rock1 = (transform: TransformBlueprint = {}): PatternData => ({
	type: "rock",
	transform,
	index: [5],
});

const rock2 = (transform: TransformBlueprint = {}): PatternData => ({
	type: "rock",
	transform,
	index: [6],
});

const rock3 = (transform: TransformBlueprint = {}): PatternData => ({
	type: "rock",
	transform,
	index: [7],
});

const enemyHorizontal = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "enemy-horizontal",
	transform: data,
	speed: data.speed,
	range: data.range,
	index: [8],
});

const enemyVertical = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "enemy-vertical",
	transform: data,
	speed: data.speed,
	range: data.range,
	index: [9],
});

const enemyStill = (
	data: TransformBlueprint & { speed: number; radius: number },
): PatternData => ({
	type: "enemy-still",
	transform: data,
	speed: data.speed,
	radius: data.radius,
	index: [10],
});

const fireball = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "fireball",
	transform: data,
	index: [11],
	speed: data.speed,
	range: data.range,
});

const iceball = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "fireball",
	transform: data,
	index: [12],
	speed: data.speed,
	range: data.range,
});

type LevelData = {
	speed: number;
	duration: number;
	spacing: [number, number];
	patterns: Pattern[];
};

// [enemyStill({ x: [600, 800], radius: 20, speed: 2 })],
// [fireball({ speed: 2000, range: [-700, 1700] })],
// [iceball({ speed: 2000, range: [-700, 1700] })],

export const levelData: LevelData[] = [
	// Level 1: only rocks/spikes
	{
		speed: 600,
		duration: 4,
		spacing: [800, 1200],
		patterns: [
			[enemyStill({ x: [300, 500], radius: 20, speed: 2 })],
			[
				fireball({
					speed: 4000,
					range: [-700, 1700],
					scaleX: -1,
					rotation: [-30, 30],
				}),
			],
			[iceball({ speed: 2000, range: [-700, 1700], scaleX: -1 })],
			[spike1()],
			[spike3()],
			[spike4()],
			[rock2({ x: [300, 500] })],
			[rock3({ x: [300, 500] })],
		],
	},
	// Level 2: introduce still enemy
	{
		speed: 650,
		duration: 8,
		spacing: [700, 1000],
		patterns: [
			[spike1()],
			[spike3()],
			[spike4()],
			[rock2({ x: [300, 500] })],
			[rock3({ x: [300, 500] })],
			[spike2()],
			[spike2({ y: [0, 50] })],
			[
				spike3({ y: [0, 100] }),
				spike4({ x: 1080, y: [0, 100], scaleX: -1 }),
			],
			[
				spike3({ y: [0, 100] }),
				spike1({ x: 1080, y: [0, 100], scaleX: -1 }),
			],
			[rock1({ x: [300, 500] })],
		],
	},
	// Level 3: more still enemies and more rock patterns
	{
		speed: 700,
		duration: 8,
		spacing: [700, 900],
		patterns: [
			[spike1()],
			[spike3()],
			[spike4()],
			[rock2({ x: [300, 500] })],
			[rock3({ x: [300, 500] })],
			[spike2()],
			[spike2({ y: [0, 50] })],
			[
				spike3({ y: [0, 100] }),
				spike4({ x: 1080, y: [0, 100], scaleX: -1 }),
			],
			[
				spike3({ y: [0, 100] }),
				spike1({ x: 1080, y: [0, 100], scaleX: -1 }),
			],
			[rock1({ x: [300, 500] })],
			[
				enemyHorizontal({
					y: [-100, 100],
					speed: 580,
					range: [250, 830],
				}),
			],
			[
				spike1(),
				enemyHorizontal({
					y: [-100, 100],
					speed: 450,
					range: [400, 850],
				}),
			],
			[
				spike3(),
				enemyHorizontal({
					y: [-100, 100],
					speed: 350,
					range: [500, 850],
				}),
			],
			[
				spike4(),
				enemyHorizontal({
					y: [-100, 100],
					speed: 500,
					range: [350, 850],
				}),
			],
		],
	},
	// Level 4: introduce vertical enemies
	{
		speed: 750,
		duration: 8,
		spacing: [600, 1000],
		patterns: [
			[spike1()],
			[spike3()],
			[spike4()],
			[rock2({ x: [300, 500] })],
			[rock3({ x: [300, 500] })],
			[
				spike2(),
				enemyHorizontal({
					y: [100, 150],
					speed: 175,
					range: [500, 850],
				}),
			],
			[
				spike2(),
				enemyVertical({ x: 600, speed: 250, range: [100, 350] }),
			],
			[
				spike1(),
				enemyVertical({
					x: [600, 800],
					speed: 400,
					range: [-200, 200],
				}),
			],
			[
				spike3(),
				enemyVertical({
					x: [600, 800],
					speed: 400,
					range: [-200, 200],
				}),
			],
			[
				spike4(),
				enemyVertical({
					x: [600, 800],
					speed: 400,
					range: [-200, 200],
				}),
			],
		],
	},
	// Level 5: introduce horizontal enemies
	{
		speed: 800,
		duration: 4,
		spacing: [700, 1000],
		patterns: [
			[spike2()],
			[spike2({ y: [0, 50] })],
			[
				spike3({ y: [0, 100] }),
				spike4({ x: 1080, y: [0, 100], scaleX: -1 }),
			],
			[
				spike3({ y: [0, 100] }),
				spike1({ x: 1080, y: [0, 100], scaleX: -1 }),
			],
			[rock1({ x: [300, 500] })],
			[spike2(), spike1({ x: 1080, y: [350, 450], scaleX: -1 })],
			[spike2(), spike3({ x: 1080, y: [200, 300], scaleX: -1 })],
			[spike2(), spike4({ x: 1080, y: [200, 300], scaleX: -1 })],
		],
	},
	// Level 6: introduce fireballs
	{
		speed: 850,
		duration: 8,
		spacing: [700, 1000],
		patterns: [
			[
				enemyHorizontal({
					y: [-100, 100],
					speed: 580,
					range: [250, 830],
				}),
			],
			[
				spike1(),
				enemyHorizontal({
					y: [-100, 100],
					speed: 450,
					range: [400, 850],
				}),
			],
			[
				spike3(),
				enemyHorizontal({
					y: [-100, 100],
					speed: 350,
					range: [500, 850],
				}),
			],
			[
				spike4(),
				enemyHorizontal({
					y: [-100, 100],
					speed: 500,
					range: [350, 850],
				}),
			],
			[
				enemyHorizontal({ speed: 290, range: [250, 830] }),
				enemyHorizontal({
					y: [200, 300],
					speed: 290,
					range: [250, 830],
				}),
			],
			[
				spike1(),
				enemyHorizontal({
					y: [100, 200],
					speed: 450,
					range: [400, 850],
				}),
			],
			[
				spike3(),
				enemyHorizontal({
					y: [100, 200],
					speed: 350,
					range: [500, 850],
				}),
			],
			[
				spike4(),
				enemyHorizontal({
					y: [-200, -100],
					speed: 500,
					range: [350, 850],
				}),
				enemyHorizontal({
					y: [100, 200],
					speed: 500,
					range: [350, 850],
				}),
			],
		],
	},
	// Level 7: more patterns
	{
		speed: 900,
		duration: 4,
		spacing: [600, 900],
		patterns: [
			[
				spike2(),
				enemyHorizontal({
					y: [100, 150],
					speed: 175,
					range: [500, 850],
				}),
			],
			[
				spike2(),
				enemyVertical({ x: 600, speed: 250, range: [100, 350] }),
			],
			[
				spike1(),
				enemyVertical({
					x: [600, 800],
					speed: 400,
					range: [-200, 200],
				}),
			],
			[
				spike3(),
				enemyVertical({
					x: [600, 800],
					speed: 400,
					range: [-200, 200],
				}),
			],
			[
				spike4(),
				enemyVertical({
					x: [600, 800],
					speed: 400,
					range: [-200, 200],
				}),
			],
			[spike2(), spike2({ x: 1080, y: [600, 700], scaleX: -1 })],
			[
				spike3(),
				spike4({ x: 1080, y: [0, 100], scaleX: -1 }),
				enemyHorizontal({ speed: 115, range: [500, 730] }),
			],
			[
				spike4(),
				spike1({ x: 1080, y: [0, 100], scaleX: -1 }),
				enemyHorizontal({ speed: 200, range: [350, 680] }),
			],
		],
	},
	// Level 8: nothing special, it’s already dark
	{
		speed: 950,
		duration: 8,
		spacing: [600, 900],
		patterns: [
			[spike2(), spike1({ x: 1080, y: [350, 450], scaleX: -1 })],
			[spike2(), spike3({ x: 1080, y: [200, 300], scaleX: -1 })],
			[spike2(), spike4({ x: 1080, y: [200, 300], scaleX: -1 })],
			[
				enemyHorizontal({ speed: 290, range: [250, 830] }),
				enemyHorizontal({
					y: [200, 300],
					speed: 290,
					range: [250, 830],
				}),
			],
			[
				spike1(),
				enemyHorizontal({
					y: [100, 200],
					speed: 450,
					range: [400, 850],
				}),
			],
			[
				spike3(),
				enemyHorizontal({
					y: [100, 200],
					speed: 350,
					range: [500, 850],
				}),
			],
			[
				spike4(),
				enemyHorizontal({
					y: [-200, -100],
					speed: 500,
					range: [350, 850],
				}),
				enemyHorizontal({
					y: [100, 200],
					speed: 500,
					range: [350, 850],
				}),
			],
		],
	},
	// Level 9: introduce iceballs
	{
		speed: 1000,
		duration: 8,
		spacing: [500, 800],
		patterns: [
			[spike2(), spike1({ x: 1080, y: [350, 450], scaleX: -1 })],
			[spike2(), spike3({ x: 1080, y: [200, 300], scaleX: -1 })],
			[spike2(), spike4({ x: 1080, y: [200, 300], scaleX: -1 })],
			[
				enemyHorizontal({ speed: 290, range: [250, 830] }),
				enemyHorizontal({
					y: [200, 300],
					speed: 290,
					range: [250, 830],
				}),
			],
			[
				spike1(),
				enemyHorizontal({
					y: [100, 200],
					speed: 450,
					range: [400, 850],
				}),
			],
			[
				spike3(),
				enemyHorizontal({
					y: [100, 200],
					speed: 350,
					range: [500, 850],
				}),
			],
			[
				spike4(),
				enemyHorizontal({
					y: [-200, -100],
					speed: 500,
					range: [350, 850],
				}),
				enemyHorizontal({
					y: [100, 200],
					speed: 500,
					range: [350, 850],
				}),
			],
			[spike2(), spike2({ x: 1080, y: [600, 700], scaleX: -1 })],
			[
				spike3(),
				spike4({ x: 1080, y: [0, 100], scaleX: -1 }),
				enemyHorizontal({ speed: 115, range: [500, 730] }),
			],
			[
				spike4(),
				spike1({ x: 1080, y: [0, 100], scaleX: -1 }),
				enemyHorizontal({ speed: 200, range: [350, 680] }),
			],
		],
	},
];

export const totalDuration =
	1920 * levelData.reduce((acc, level) => acc + level.duration, 0);

export const getObstaclePattern = (
	level: number,
	previousPatterns: { flipped: boolean; pattern: Pattern }[],
) => {
	const last = previousPatterns.at(-1);
	const previousLast = previousPatterns.at(-2);
	let flipped = false;
	if (!last) {
		flipped = Math.random() < 0.5;
	} else if (!previousLast || last.flipped != previousLast.flipped) {
		flipped = Math.random() < 0.7 ? !last.flipped : last.flipped;
	} else {
		flipped = !last.flipped;
	}

	const possibleObstaclePatterns = levelData[level - 1].patterns.filter(
		(o) => !last || JSON.stringify(o) != JSON.stringify(last.pattern),
	);
	return {
		flipped,
		pattern:
			possibleObstaclePatterns[
				Math.floor(Math.random() * possibleObstaclePatterns.length)
			],
	};
};

export const getPatternSpacing = (level: number) => {
	if (level == 10) {
		level = 9;
	}
	const [minSpacingY, maxSpacingY] = levelData[level - 1].spacing;
	return Math.random() * (maxSpacingY - minSpacingY) + minSpacingY;
};
