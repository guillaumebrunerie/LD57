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

export type Pattern = {
	data: PatternData[];
};

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

type LevelPattern = {
	spacing: [number, number];
	data: Pattern[];
};

const patterns: Pattern[][] = [
	[],
	// Difficulty 1
	[
		{ data: [fireball(2000, [-700, 1700])] },
		{ data: [iceball(2000, [-700, 1700])] },
		{ data: [spikeRight(1)] },
		{ data: [spikeRight(3)] },
		{ data: [spikeRight(4)] },
		{ data: [rock(6, [50, 200])] },
		{ data: [rock(7, [-50, 200])] },
		{ data: [enemyStill(20, 2, [600, 700])] },
		{ data: [enemyStill(20, 2, [600, 800])] },
	],
	// Difficulty 2
	[
		{ data: [spikeRight(2)] },
		{ data: [spikeRight(2, [0, 50])] },
		{
			data: [spikeLeft(3, [0, 100]), spikeRight(4, [0, 100])],
		},
		{
			data: [spikeLeft(1, [0, 100]), spikeRight(3, [0, 100])],
		},
		{ data: [rock(5, [50, 200])] },
	],
	// Difficulty 3
	[
		{
			data: [enemyHorizontal(580, [250, 830], [-100, 100])],
		},
		{
			data: [
				spikeRight(1),
				enemyHorizontal(450, [230, 680], [-100, 100]),
			],
		},
		{
			data: [
				spikeRight(3),
				enemyHorizontal(350, [230, 580], [-100, 100]),
			],
		},
		{
			data: [
				spikeRight(4),
				enemyHorizontal(500, [230, 730], [-100, 100]),
			],
		},
	],
	// Difficulty 4
	[
		{
			data: [spikeRight(2), enemyHorizontal(175, [230, 580], [100, 150])],
		},
		{
			data: [spikeRight(2), enemyVertical(250, 480, [100, 350])],
		},
		{
			data: [spikeRight(1), enemyVertical(400, [280, 480], [-200, 200])],
		},
		{
			data: [spikeRight(3), enemyVertical(400, [280, 480], [-200, 200])],
		},
		{
			data: [spikeRight(4), enemyVertical(400, [280, 480], [-200, 200])],
		},
	],
	// Difficulty 5
	[
		{
			data: [spikeRight(2), spikeLeft(1, [350, 450])],
		},
		{
			data: [spikeRight(2), spikeLeft(3, [200, 300])],
		},
		{
			data: [spikeRight(2), spikeLeft(4, [200, 300])],
		},
	],
	// Difficulty 6
	[
		{
			data: [
				enemyHorizontal(290, [250, 830]),
				enemyHorizontal(290, [250, 830], [200, 300]),
			],
		},
		{
			data: [spikeRight(1), enemyHorizontal(450, [230, 680], [100, 200])],
		},
		{
			data: [spikeRight(3), enemyHorizontal(350, [230, 580], [100, 200])],
		},
		{
			data: [
				spikeRight(4),
				enemyHorizontal(500, [230, 730], [-200, -100]),
				enemyHorizontal(500, [230, 730], [100, 200]),
			],
		},
	],
	// Difficulty 7
	[
		{
			data: [spikeRight(2), spikeLeft(2, [600, 700])],
		},
		{
			data: [
				spikeRight(3),
				spikeLeft(4, [0, 100]),
				enemyHorizontal(115, [350, 580]),
			],
		},
		{
			data: [
				spikeRight(4),
				spikeLeft(1, [0, 100]),
				enemyHorizontal(200, [400, 730]),
			],
		},
	],
];

export const obstaclesPatternsData: LevelPattern[] = [
	// Level 1
	{
		spacing: [800, 1200],
		data: [...patterns[1]],
	},
	// Level 2
	{
		spacing: [700, 1000],
		data: [...patterns[1], ...patterns[2]],
	},
	// Level 3
	{
		spacing: [700, 900],
		data: [...patterns[1], ...patterns[2], ...patterns[3]],
	},
	// Level 4
	{
		spacing: [600, 1000],
		data: [...patterns[1], ...patterns[4]],
	},
	// Level 5
	{
		spacing: [700, 1000],
		data: [...patterns[2], ...patterns[5]],
	},
	// Level 6
	{
		spacing: [700, 1000],
		data: [...patterns[3], ...patterns[6]],
	},
	// Level 7
	{
		spacing: [600, 900],
		data: [...patterns[4], ...patterns[7]],
	},
	// Level 8
	{
		spacing: [600, 900],
		data: [...patterns[5], ...patterns[6]],
	},
	// Level 9
	{
		spacing: [500, 800],
		data: [...patterns[5], ...patterns[6], ...patterns[7]],
	},
];

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

	const possibleObstaclePatterns = obstaclesPatternsData[
		level - 1
	].data.filter(
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
	const [minSpacingY, maxSpacingY] = obstaclesPatternsData[level - 1].spacing;
	return Math.random() * (maxSpacingY - minSpacingY) + minSpacingY;
};
