type PatternData = {
	x: [number, number];
	y: [number, number];
	flipped: boolean;
	index: number[];
	frequency?: number;
	range?: [number, number];
	radius?: number;
	dy?: number;
};

export type Pattern = PatternData[];

const spikeLeft = (
	index: number,
	y: number | [number, number] = 0,
): PatternData => ({
	x: [0, 0],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [index],
});

const shortSpikeLeft = (y: number | [number, number] = 0): PatternData => ({
	x: [0, 0],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [1, 3, 4],
});

const longSpikeLeft = (y: number | [number, number] = 0): PatternData => ({
	x: [0, 0],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [2],
});

const spikeRight = (
	index: number,
	y: number | [number, number] = 0,
): PatternData => ({
	x: [1080, 1080],
	y: typeof y == "number" ? [y, y] : y,
	flipped: true,
	index: [index],
});

const shortSpikeRight = (y: number | [number, number] = 0): PatternData => ({
	x: [1080, 1080],
	y: typeof y == "number" ? [y, y] : y,
	flipped: true,
	index: [1, 3, 4],
});

const longSpikeRight = (y: number | [number, number] = 0): PatternData => ({
	x: [1080, 1080],
	y: typeof y == "number" ? [y, y] : y,
	flipped: true,
	index: [2],
});

const rock = (
	index: number,
	x: [number, number],
	y: number | [number, number] = 0,
): PatternData => ({
	x: [1080 / 2 + x[0], 1080 / 2 + x[1]],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [index],
});

const anyRock = (
	x: [number, number],
	y: number | [number, number] = 0,
): PatternData => ({
	x: [1080 / 2 + x[0], 1080 / 2 + x[1]],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [5, 6, 7],
});

const enemyHorizontal = (
	speed: number,
	range: [number, number],
	y: number | [number, number] = 0,
): PatternData => ({
	x: [0, 0],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [8],
	frequency: (range[1] - range[0]) / speed,
	range,
});

const enemyVertical = (
	speed: number,
	x: number | [number, number],
	range: [number, number],
	y: number | [number, number] = 0,
): PatternData => ({
	x: typeof x == "number" ? [x, x] : x,
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [9],
	frequency: (range[1] - range[0]) / speed,
	range,
});

const enemyStill = (
	radius: number,
	speed: number,
	x: number | [number, number],
	y: number | [number, number] = 0,
): PatternData => ({
	x: typeof x == "number" ? [x, x] : x,
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	radius,
	frequency: 1 / speed,
	index: [10],
});

const fireball = (
	speed: number,
	range: [number, number],
	dy = 0,
	y: number | [number, number] = 0,
): PatternData => ({
	x: [0, 0],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [11],
	frequency: (range[1] - range[0]) / speed,
	range,
	dy,
});

const iceball = (
	speed: number,
	range: [number, number],
	dy = 0,
	y: number | [number, number] = 0,
): PatternData => ({
	x: [0, 0],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index: [12],
	frequency: (range[1] - range[0]) / speed,
	range,
	dy,
});

type LevelData = {
	duration: number;
	spacing: [number, number];
	patterns: Pattern[];
};

const patterns: Pattern[][] = [
	[],
	// Difficulty 1
	[
		[fireball(2000, [-700, 1700])],
		[shortSpikeRight()],
		[iceball(2000, [-700, 1700])],
		[rock(6, [50, 200])],
		[rock(7, [-50, 200])],
		[enemyStill(20, 2, [600, 700])],
		[enemyStill(20, 2, [600, 800])],
	],
	// Difficulty 2
	[
		[spikeRight(2)],
		[spikeRight(2, [0, 50])],
		[spikeLeft(3, [0, 100]), spikeRight(4, [0, 100])],
		[spikeLeft(1, [0, 100]), spikeRight(3, [0, 100])],
		[rock(5, [50, 200])],
	],
	// Difficulty 3
	[
		[enemyHorizontal(580, [250, 830], [-100, 100])],
		[spikeRight(1), enemyHorizontal(450, [230, 680], [-100, 100])],
		[spikeRight(3), enemyHorizontal(350, [230, 580], [-100, 100])],
		[spikeRight(4), enemyHorizontal(500, [230, 730], [-100, 100])],
	],
	// Difficulty 4
	[
		[spikeRight(2), enemyHorizontal(175, [230, 580], [100, 150])],
		[spikeRight(2), enemyVertical(250, 480, [100, 350])],
		[spikeRight(1), enemyVertical(400, [280, 480], [-200, 200])],
		[spikeRight(3), enemyVertical(400, [280, 480], [-200, 200])],
		[spikeRight(4), enemyVertical(400, [280, 480], [-200, 200])],
	],
	// Difficulty 5
	[
		[spikeRight(2), spikeLeft(1, [350, 450])],
		[spikeRight(2), spikeLeft(3, [200, 300])],
		[spikeRight(2), spikeLeft(4, [200, 300])],
	],
	// Difficulty 6
	[
		[
			enemyHorizontal(290, [250, 830]),
			enemyHorizontal(290, [250, 830], [200, 300]),
		],
		[spikeRight(1), enemyHorizontal(450, [230, 680], [100, 200])],
		[spikeRight(3), enemyHorizontal(350, [230, 580], [100, 200])],
		[
			spikeRight(4),
			enemyHorizontal(500, [230, 730], [-200, -100]),
			enemyHorizontal(500, [230, 730], [100, 200]),
		],
	],
	// Difficulty 7
	[
		[spikeRight(2), spikeLeft(2, [600, 700])],
		[
			spikeRight(3),
			spikeLeft(4, [0, 100]),
			enemyHorizontal(115, [350, 580]),
		],
		[
			spikeRight(4),
			spikeLeft(1, [0, 100]),
			enemyHorizontal(200, [400, 730]),
		],
	],
];

export const levelData: LevelData[] = [
	// Level 1: only rocks/spikes
	{
		duration: 4,
		spacing: [800, 1200],
		patterns: [...patterns[1]],
	},
	// Level 2: introduce still enemy
	{
		duration: 8,
		spacing: [700, 1000],
		patterns: [...patterns[1], ...patterns[2]],
	},
	// Level 3: more still enemies and more rock patterns
	{
		duration: 8,
		spacing: [700, 900],
		patterns: [...patterns[1], ...patterns[2], ...patterns[3]],
	},
	// Level 4: introduce vertical enemies
	{
		duration: 8,
		spacing: [600, 1000],
		patterns: [...patterns[1], ...patterns[4]],
	},
	// Level 5: introduce horizontal enemies
	{
		duration: 4,
		spacing: [700, 1000],
		patterns: [...patterns[2], ...patterns[5]],
	},
	// Level 6: introduce fireballs
	{
		duration: 8,
		spacing: [700, 1000],
		patterns: [...patterns[3], ...patterns[6]],
	},
	// Level 7: more patterns
	{
		duration: 4,
		spacing: [600, 900],
		patterns: [...patterns[4], ...patterns[7]],
	},
	// Level 8: nothing special, it’s already dark
	{
		duration: 8,
		spacing: [600, 900],
		patterns: [...patterns[5], ...patterns[6]],
	},
	// Level 9: introduce iceballs
	{
		duration: 8,
		spacing: [500, 800],
		patterns: [...patterns[5], ...patterns[6], ...patterns[7]],
	},
];

export const totalDuration =
	1920 * levelData.reduce((acc, level) => acc + level.duration, 0);

const otherSide = {
	left: "right",
	right: "left",
} as const;

export const getObstaclePattern = (
	level: number,
	previousPatterns: { side: "left" | "right"; pattern: Pattern }[],
) => {
	const last = previousPatterns.at(-1);
	const previousLast = previousPatterns.at(-2);
	let side: "left" | "right";
	if (!last) {
		side = Math.random() < 0.5 ? "left" : "right";
	} else if (!previousLast || last.side != previousLast.side) {
		side = Math.random() < 0.7 ? otherSide[last.side] : last.side;
	} else {
		side = last.side == "left" ? "right" : "left";
	}

	const possibleObstaclePatterns = levelData[level - 1].patterns.filter(
		(o) => !last || JSON.stringify(o) != JSON.stringify(last.pattern),
	);
	return {
		side,
		pattern:
			possibleObstaclePatterns[
				Math.floor(Math.random() * possibleObstaclePatterns.length)
			],
	};
};

export const getPatternSpacing = (level: number) => {
	const [minSpacingY, maxSpacingY] = levelData[level - 1].spacing;
	return Math.random() * (maxSpacingY - minSpacingY) + minSpacingY;
};
