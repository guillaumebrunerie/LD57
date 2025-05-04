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
			dy: number;
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
	dy: 0,
});

const iceball = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "fireball",
	transform: data,
	index: [12],
	speed: data.speed,
	range: data.range,
	dy: 0,
});

type LevelData = {
	speed: number;
	duration: number;
	spacing: [number, number];
	patterns: Pattern[];
};

const patterns: Pattern[][] = [
	[],
	// Difficulty 1
	[
		[spike1({ x: 1080, scaleX: -1 })],
		[spike3({ x: 1080, scaleX: -1 })],
		[spike4({ x: 1080, scaleX: -1 })],
		[rock2({ x: [600, 750] })],
		[rock3({ x: [500, 750] })],
		[fireball({ speed: 2000, range: [-700, 1700] })],
		[iceball({ speed: 2000, range: [-700, 1700] })],
		[enemyStill({ x: [600, 700], radius: 20, speed: 2 })],
		[enemyStill({ x: [600, 800], radius: 20, speed: 2 })],
	],
	// Difficulty 2
	[
		[spike2({ x: 1080, scaleX: -1 })],
		[spike2({ x: 1080, y: [0, 50], scaleX: -1 })],
		[spike3({ y: [0, 100] }), spike4({ x: 1080, y: [0, 100], scaleX: -1 })],
		[spike1({ y: [0, 100] }), spike3({ x: 1080, y: [0, 100], scaleX: -1 })],
		[rock1({ x: [600, 750] })],
	],
	// Difficulty 3
	[
		[enemyHorizontal({ y: [-100, 100], speed: 580, range: [250, 830] })],
		[
			spike1({ x: 1080, scaleX: -1 }),
			enemyHorizontal({ y: [-100, 100], speed: 450, range: [230, 680] }),
		],
		[
			spike3({ x: 1080, scaleX: -1 }),
			enemyHorizontal({ y: [-100, 100], speed: 350, range: [230, 580] }),
		],
		[
			spike4({ x: 1080, scaleX: -1 }),
			enemyHorizontal({ y: [-100, 100], speed: 500, range: [230, 730] }),
		],
	],
	// Difficulty 4
	[
		[
			spike2({ x: 1080, scaleX: -1 }),
			enemyHorizontal({ y: [100, 150], speed: 175, range: [230, 580] }),
		],
		[
			spike2({ x: 1080, scaleX: -1 }),
			enemyVertical({ x: 480, speed: 250, range: [100, 350] }),
		],
		[
			spike1({ x: 1080, scaleX: -1 }),
			enemyVertical({ x: [280, 480], speed: 400, range: [-200, 200] }),
		],
		[
			spike3({ x: 1080, scaleX: -1 }),
			enemyVertical({ x: [280, 480], speed: 400, range: [-200, 200] }),
		],
		[
			spike4({ x: 1080, scaleX: -1 }),
			enemyVertical({ x: [280, 480], speed: 400, range: [-200, 200] }),
		],
	],
	// Difficulty 5
	[
		[spike2({ x: 1080, scaleX: -1 }), spike1({ y: [350, 450] })],
		[spike2({ x: 1080, scaleX: -1 }), spike3({ y: [200, 300] })],
		[spike2({ x: 1080, scaleX: -1 }), spike4({ y: [200, 300] })],
	],
	// Difficulty 6
	[
		[
			enemyHorizontal({ speed: 290, range: [250, 830] }),
			enemyHorizontal({ y: [200, 300], speed: 290, range: [250, 830] }),
		],
		[
			spike1({ x: 1080, scaleX: -1 }),
			enemyHorizontal({ y: [100, 200], speed: 450, range: [230, 680] }),
		],
		[
			spike3({ x: 1080, scaleX: -1 }),
			enemyHorizontal({ y: [100, 200], speed: 350, range: [230, 580] }),
		],
		[
			spike4({ x: 1080, scaleX: -1 }),
			enemyHorizontal({ y: [-200, -100], speed: 500, range: [230, 730] }),
			enemyHorizontal({ y: [100, 200], speed: 500, range: [230, 730] }),
		],
	],
	// Difficulty 7
	[
		[spike2({ x: 1080, scaleX: -1 }), spike2({ y: [600, 700] })],
		[
			spike3({ x: 1080, scaleX: -1 }),
			spike4({ y: [0, 100] }),
			enemyHorizontal({ speed: 115, range: [350, 580] }),
		],
		[
			spike4({ x: 1080, scaleX: -1 }),
			spike1({ y: [0, 100] }),
			enemyHorizontal({ speed: 200, range: [400, 730] }),
		],
	],
];

export const levelData: LevelData[] = [
	// Level 1: only rocks/spikes
	{
		speed: 600,
		duration: 4,
		spacing: [800, 1200],
		patterns: [...patterns[1]],
	},
	// Level 2: introduce still enemy
	{
		speed: 650,
		duration: 8,
		spacing: [700, 1000],
		patterns: [...patterns[1], ...patterns[2]],
	},
	// Level 3: more still enemies and more rock patterns
	{
		speed: 700,
		duration: 8,
		spacing: [700, 900],
		patterns: [...patterns[1], ...patterns[2], ...patterns[3]],
	},
	// Level 4: introduce vertical enemies
	{
		speed: 750,
		duration: 8,
		spacing: [600, 1000],
		patterns: [...patterns[1], ...patterns[4]],
	},
	// Level 5: introduce horizontal enemies
	{
		speed: 800,
		duration: 4,
		spacing: [700, 1000],
		patterns: [...patterns[2], ...patterns[5]],
	},
	// Level 6: introduce fireballs
	{
		speed: 850,
		duration: 8,
		spacing: [700, 1000],
		patterns: [...patterns[3], ...patterns[6]],
	},
	// Level 7: more patterns
	{
		speed: 900,
		duration: 4,
		spacing: [600, 900],
		patterns: [...patterns[4], ...patterns[7]],
	},
	// Level 8: nothing special, it’s already dark
	{
		speed: 950,
		duration: 8,
		spacing: [600, 900],
		patterns: [...patterns[5], ...patterns[6]],
	},
	// Level 9: introduce iceballs
	{
		speed: 1000,
		duration: 8,
		spacing: [500, 800],
		patterns: [...patterns[5], ...patterns[6], ...patterns[7]],
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
