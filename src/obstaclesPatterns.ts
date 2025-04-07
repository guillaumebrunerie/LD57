type PatternData = {
	x: [number, number];
	y: [number, number];
	flipped: boolean;
	index: number;
	frequency?: number;
	range?: [number, number];
};

export type Pattern = { side: "left" | "right"; data: PatternData[] };

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

export const obstaclesPatternsData: LevelPattern[] = [
	// Level 1
	{
		spacing: [800, 1200],
		data: [
			{ side: "right", data: [enemyVertical(9, 0.8, 300, [-100, 100])] },
			{ side: "left", data: [enemyVertical(9, 0.8, 780, [-100, 100])] },
			{ side: "right", data: [enemyVertical(9, 0.8, 300, [-50, 50])] },
			{ side: "left", data: [enemyVertical(9, 0.8, 780, [-50, 50])] },
			{ side: "right", data: [spikeLeft(1)] },
			{ side: "right", data: [spikeLeft(2)] },
			{ side: "right", data: [spikeLeft(3)] },
			{ side: "right", data: [spikeLeft(4)] },
			{ side: "left", data: [spikeRight(1)] },
			{ side: "left", data: [spikeRight(2)] },
			{ side: "left", data: [spikeRight(3)] },
			{ side: "left", data: [spikeRight(4)] },
		],
	},
	// Level 2
	{
		spacing: [700, 1100],
		data: [
			{
				side: "right",
				data: [enemyHorizontal(8, 1, [250, 830], [-100, 100])],
			},
			{
				side: "left",
				data: [enemyHorizontal(8, 1, [250, 830], [-100, 100])],
			},
			{ side: "right", data: [spikeLeft(2)] },
			{ side: "left", data: [spikeRight(2)] },
			{ side: "left", data: [rock(5, [50, 200])] },
			{ side: "left", data: [rock(6, [50, 200])] },
			{ side: "left", data: [rock(7, [50, 200])] },
			{ side: "right", data: [rock(5, [-200, 50])] },
			{ side: "right", data: [rock(6, [-200, 50])] },
			{ side: "right", data: [rock(7, [-200, 50])] },
		],
	},
	// Level 3
	{
		spacing: [700, 1100],
		data: [
			{ side: "right", data: [enemyVertical(9, 0.8, 300, [-100, 100])] },
			{ side: "left", data: [enemyVertical(9, 0.8, 780, [-100, 100])] },
			{
				side: "right",
				data: [enemyHorizontal(8, 1, [250, 830], [-100, 100])],
			},
			{
				side: "left",
				data: [enemyHorizontal(8, 1, [250, 830], [-100, 100])],
			},
			{ side: "left", data: [spikeLeft(1), spikeRight(2, [50, 100])] },
			{ side: "right", data: [spikeRight(3), spikeLeft(2, [50, 100])] },
			{ side: "left", data: [spikeLeft(1), spikeRight(2, [50, 100])] },
			{ side: "right", data: [spikeRight(3), spikeLeft(2, [50, 100])] },
			{ side: "left", data: [rock(5, [50, 200])] },
			{ side: "left", data: [rock(6, [50, 200])] },
			{ side: "left", data: [rock(7, [50, 200])] },
			{ side: "right", data: [rock(5, [-200, 50])] },
			{ side: "right", data: [rock(6, [-200, 50])] },
			{ side: "right", data: [rock(7, [-200, 50])] },
		],
	},
	// Level 4
	{
		spacing: [600, 1000],
		data: [
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
					spikeLeft(2),
					enemyHorizontal(8, 2, [500, 850], [150, 200]),
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
					spikeRight(2),
					enemyHorizontal(8, 2, [230, 580], [150, 200]),
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
	},
];

obstaclesPatternsData[4] = {
	...obstaclesPatternsData[3],
	spacing: [600, 1000],
};
obstaclesPatternsData[5] = { ...obstaclesPatternsData[3], spacing: [500, 900] };
obstaclesPatternsData[6] = { ...obstaclesPatternsData[3], spacing: [500, 900] };
obstaclesPatternsData[7] = { ...obstaclesPatternsData[3], spacing: [400, 800] };
obstaclesPatternsData[8] = { ...obstaclesPatternsData[3], spacing: [300, 700] };

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
