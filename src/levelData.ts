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
	| ({
			type: "spike";
			colliderIndex: number;
	  } & TransformBlueprint)
	| ({
			type: "rock";
			colliderIndex: number;
	  } & TransformBlueprint)
	| ({
			type: "enemy-horizontal";
			colliderIndex: number;
			speed: number;
			range: [number, number];
	  } & TransformBlueprint)
	| ({
			type: "enemy-vertical";
			colliderIndex: number;
			speed: number;
			range: [number, number];
	  } & TransformBlueprint)
	| ({
			type: "enemy-still";
			colliderIndex: number;

			speed: number;
			radius: number;
	  } & TransformBlueprint)
	| ({
			type: "fireball";
			colliderIndex: number;
			speed: number;
			range: [number, number];
	  } & TransformBlueprint);

export type Pattern = PatternData[];

const spike1 = (data: TransformBlueprint = {}): PatternData => ({
	type: "spike",
	colliderIndex: 1,
	...data,
});

const spike2 = (data: TransformBlueprint = {}): PatternData => ({
	type: "spike",
	colliderIndex: 2,
	...data,
});

const spike3 = (data: TransformBlueprint = {}): PatternData => ({
	type: "spike",
	colliderIndex: 3,
	...data,
});

const spike4 = (data: TransformBlueprint = {}): PatternData => ({
	type: "spike",
	colliderIndex: 4,
	...data,
});

const rock1 = (data: TransformBlueprint = {}): PatternData => ({
	type: "rock",
	colliderIndex: 5,
	...data,
});

const rock2 = (data: TransformBlueprint = {}): PatternData => ({
	type: "rock",
	colliderIndex: 6,
	...data,
});

const rock3 = (data: TransformBlueprint = {}): PatternData => ({
	type: "rock",
	colliderIndex: 7,
	...data,
});

const enemyHorizontal = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "enemy-horizontal",
	colliderIndex: 8,
	...data,
});

const enemyVertical = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "enemy-vertical",
	colliderIndex: 9,
	...data,
});

const enemyStill = (
	data: TransformBlueprint & { speed: number; radius: number },
): PatternData => ({
	type: "enemy-still",
	colliderIndex: 10,
	...data,
});

const fireball = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "fireball",
	colliderIndex: 11,
	...data,
});

const iceball = (
	data: TransformBlueprint & { speed: number; range: [number, number] },
): PatternData => ({
	type: "fireball",
	colliderIndex: 12,
	...data,
});

type LevelData = {
	speed: number;
	duration: number;
	spacing: [number, number];
	patterns: Pattern[];
};

export const levelData: LevelData[] = [
	// Level 1: only rocks/spikes
	{
		speed: 600,
		duration: 4,
		spacing: [800, 1200],
		patterns: [
			[enemyStill({ x: [300, 500], radius: 50, speed: 2 })],
			[
				fireball({
					speed: 2000,
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
