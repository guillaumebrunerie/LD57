type PatternData = {
	x: [number, number];
	y: [number, number];
	flipped: boolean;
	index: number;
	frequency?: number;
	range?: [number, number];
};

export type Pattern = {
	side: "left" | "right";
	data: PatternData[];
};

const spikeLeft = (
	index: number,
	y: number | [number, number] = 0,
): PatternData => ({
	x: [0, 0],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index,
});

const spikeRight = (
	index: number,
	y: number | [number, number] = 0,
): PatternData => ({
	x: [1080, 1080],
	y: typeof y == "number" ? [y, y] : y,
	flipped: true,
	index,
});

const rock = (
	index: number,
	x: [number, number],
	y: number | [number, number] = 0,
): PatternData => ({
	x: [1080 / 2 + x[0], 1080 / 2 + x[1]],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index,
});

const enemyHorizontal = (
	index: number,
	frequency: number,
	range: [number, number],
	y: number | [number, number] = 0,
): PatternData => ({
	x: [0, 0],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index,
	frequency,
	range,
});

const enemyVertical = (
	index: number,
	frequency: number,
	x: number | [number, number],
	range: [number, number],
	y: number | [number, number] = 0,
): PatternData => ({
	x: typeof x == "number" ? [x, x] : x,
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index,
	frequency,
	range,
});

type LevelPattern = {
	spacing: [number, number];
	data: Pattern[];
};

const patterns: Pattern[][] = [
	[],
	// Difficulty 1
	[
		{ side: "right", data: [spikeLeft(1)] },
		{ side: "right", data: [spikeLeft(3)] },
		{ side: "right", data: [spikeLeft(4)] },
		{ side: "right", data: [rock(6, [-200, -50])] },
		{ side: "right", data: [rock(7, [-200, 50])] },
		{ side: "left", data: [spikeRight(1)] },
		{ side: "left", data: [spikeRight(3)] },
		{ side: "left", data: [spikeRight(4)] },
		{ side: "left", data: [rock(6, [50, 200])] },
		{ side: "left", data: [rock(7, [-50, 200])] },
	],
	// Difficulty 2
	[
		{ side: "right", data: [spikeLeft(2)] },
		{ side: "left", data: [spikeRight(2)] },
		{ side: "right", data: [spikeLeft(2, [0, 50])] },
		{ side: "left", data: [spikeRight(2, [0, 50])] },
		{
			side: "left",
			data: [spikeLeft(3, [0, 100]), spikeRight(4, [0, 100])],
		},
		{
			side: "left",
			data: [spikeLeft(1, [0, 100]), spikeRight(3, [0, 100])],
		},
		{ side: "left", data: [rock(5, [50, 200])] },
		{
			side: "right",
			data: [spikeLeft(4, [0, 100]), spikeRight(3, [0, 100])],
		},
		{
			side: "right",
			data: [spikeLeft(3, [0, 100]), spikeRight(1, [0, 100])],
		},
		{ side: "right", data: [rock(5, [-200, 50])] },
	],
	// Difficulty 3
	[
		{
			side: "right",
			data: [enemyHorizontal(8, 1, [250, 830], [-100, 100])],
		},
		{
			side: "left",
			data: [enemyHorizontal(8, 1, [250, 830], [-100, 100])],
		},
		{
			side: "right",
			data: [
				spikeLeft(1),
				enemyHorizontal(8, 1, [400, 850], [-100, 100]),
			],
		},
		{
			side: "right",
			data: [
				spikeLeft(3),
				enemyHorizontal(8, 1, [500, 850], [-100, 100]),
			],
		},
		{
			side: "right",
			data: [
				spikeLeft(4),
				enemyHorizontal(8, 1, [350, 850], [-100, 100]),
			],
		},
		{
			side: "left",
			data: [
				spikeRight(1),
				enemyHorizontal(8, 1, [230, 680], [-100, 100]),
			],
		},
		{
			side: "left",
			data: [
				spikeRight(3),
				enemyHorizontal(8, 1, [230, 580], [-100, 100]),
			],
		},
		{
			side: "left",
			data: [
				spikeRight(4),
				enemyHorizontal(8, 1, [230, 730], [-100, 100]),
			],
		},
	],
	// Difficulty 4
	[
		{
			side: "right",
			data: [spikeLeft(2), enemyHorizontal(8, 2, [500, 850], [100, 150])],
		},
		{
			side: "right",
			data: [spikeLeft(2), enemyVertical(9, 1, 600, [100, 350])],
		},
		{
			side: "right",
			data: [spikeLeft(1), enemyVertical(9, 1, [600, 800], [-200, 200])],
		},
		{
			side: "right",
			data: [spikeLeft(3), enemyVertical(9, 1, [600, 800], [-200, 200])],
		},
		{
			side: "right",
			data: [spikeLeft(4), enemyVertical(9, 1, [600, 800], [-200, 200])],
		},
		{
			side: "left",
			data: [
				spikeRight(2),
				enemyHorizontal(8, 2, [230, 580], [100, 150]),
			],
		},
		{
			side: "left",
			data: [spikeRight(2), enemyVertical(9, 1, 480, [100, 350])],
		},
		{
			side: "left",
			data: [spikeRight(1), enemyVertical(9, 1, [280, 480], [-200, 200])],
		},
		{
			side: "left",
			data: [spikeRight(3), enemyVertical(9, 1, [280, 480], [-200, 200])],
		},
		{
			side: "left",
			data: [spikeRight(4), enemyVertical(9, 1, [280, 480], [-200, 200])],
		},
	],
	// Difficulty 5
	[
		{
			side: "right",
			data: [spikeLeft(2), spikeRight(1, [350, 450])],
		},
		{
			side: "right",
			data: [spikeLeft(2), spikeRight(3, [200, 300])],
		},
		{
			side: "right",
			data: [spikeLeft(2), spikeRight(4, [200, 300])],
		},
		{
			side: "left",
			data: [spikeRight(2), spikeLeft(1, [350, 450])],
		},
		{
			side: "left",
			data: [spikeRight(2), spikeLeft(3, [200, 300])],
		},
		{
			side: "left",
			data: [spikeRight(2), spikeLeft(4, [200, 300])],
		},
	],
	// Difficulty 6
	[
		{
			side: "left",
			data: [
				enemyHorizontal(8, 2, [250, 830]),
				enemyHorizontal(8, 2, [250, 830], [200, 300]),
			],
		},
		{
			side: "left",
			data: [
				spikeRight(1),
				// enemyHorizontal(8, 1, [230, 680], [-200, -100]),
				enemyHorizontal(8, 1, [230, 680], [100, 200]),
			],
		},
		{
			side: "left",
			data: [
				spikeRight(3),
				// enemyHorizontal(8, 1, [230, 580], [-200, -100]),
				enemyHorizontal(8, 1, [230, 580], [100, 200]),
			],
		},
		{
			side: "left",
			data: [
				spikeRight(4),
				enemyHorizontal(8, 1, [230, 730], [-200, -100]),
				enemyHorizontal(8, 1, [230, 730], [100, 200]),
			],
		},
		{
			side: "right",
			data: [
				enemyHorizontal(8, 2, [250, 830]),
				enemyHorizontal(8, 2, [250, 830], [200, 300]),
			],
		},
		{
			side: "right",
			data: [
				spikeLeft(1),
				// enemyHorizontal(8, 1, [400, 850], [-200, -100]),
				enemyHorizontal(8, 1, [400, 850], [100, 200]),
			],
		},
		{
			side: "right",
			data: [
				spikeLeft(3),
				// enemyHorizontal(8, 1, [500, 850], [-200, -100]),
				enemyHorizontal(8, 1, [500, 850], [100, 200]),
			],
		},
		{
			side: "right",
			data: [
				spikeLeft(4),
				enemyHorizontal(8, 1, [350, 850], [-200, -100]),
				enemyHorizontal(8, 1, [350, 850], [100, 200]),
			],
		},
	],
	// Difficulty 7
	[
		{
			side: "right",
			data: [spikeLeft(2), spikeRight(2, [400, 500])],
		},
		{
			side: "right",
			data: [
				spikeLeft(3),
				spikeRight(4, [0, 100]),
				enemyHorizontal(8, 2, [500, 730]),
			],
		},
		{
			side: "right",
			data: [
				spikeLeft(4),
				spikeRight(1, [0, 100]),
				enemyHorizontal(8, 2, [350, 680]),
			],
		},
		{
			side: "left",
			data: [spikeRight(2), spikeLeft(2, [500, 600])],
		},
		{
			side: "left",
			data: [
				spikeRight(3),
				spikeLeft(4, [0, 100]),
				enemyHorizontal(8, 2, [350, 580]),
			],
		},
		{
			side: "left",
			data: [
				spikeRight(4),
				spikeLeft(1, [0, 100]),
				enemyHorizontal(8, 2, [400, 730]),
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
	previousPatterns: Pattern[],
) => {
	const last = previousPatterns.at(-1);
	const previousLast = previousPatterns.at(-2);
	let side;
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
		(o) => o.side == side && JSON.stringify(o) != JSON.stringify(last),
	);
	return possibleObstaclePatterns[
		Math.floor(Math.random() * possibleObstaclePatterns.length)
	];
};

export const getPatternSpacing = (level: number) => {
	const [minSpacingY, maxSpacingY] = obstaclesPatternsData[level - 1].spacing;
	return Math.random() * (maxSpacingY - minSpacingY) + minSpacingY;
};
