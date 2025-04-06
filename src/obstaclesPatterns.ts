type PatternData = {
	x: [number, number];
	y: [number, number];
	flipped: boolean;
	index: number;
};

type Pattern = PatternData[];

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
	x: number,
	y: number | [number, number] = 0,
): PatternData => ({
	x: [1080 / 2 - x, 1080 / 2 + x],
	y: typeof y == "number" ? [y, y] : y,
	flipped: false,
	index,
});

export const obstaclesPatternsData: Pattern[][] = [
	// Level 1
	[
		[spikeLeft(1)],
		[spikeLeft(2)],
		[spikeLeft(3)],
		[spikeLeft(4)],
		[spikeRight(1)],
		[spikeRight(2)],
		[spikeRight(3)],
		[spikeRight(4)],
	],
	// Level 2
	[
		[spikeLeft(2)],
		[spikeRight(2)],
		[rock(5, 200)],
		[rock(6, 200)],
		[rock(7, 200)],
	],
	// Level 3
	[
		[spikeLeft(1), spikeRight(2, [50, 100])],
		[spikeRight(3), spikeLeft(2, [50, 100])],
		[spikeLeft(1), spikeRight(2, [50, 100])],
		[spikeRight(3), spikeLeft(2, [50, 100])],
		[rock(5, 200)],
		[rock(6, 200)],
		[rock(7, 200)],
	],
];

obstaclesPatternsData[3] = obstaclesPatternsData[2];
obstaclesPatternsData[4] = obstaclesPatternsData[2];
obstaclesPatternsData[5] = obstaclesPatternsData[2];
obstaclesPatternsData[6] = obstaclesPatternsData[2];
obstaclesPatternsData[7] = obstaclesPatternsData[2];
obstaclesPatternsData[8] = obstaclesPatternsData[2];

export const getObstaclePattern = (level: number) => {
	const possibleObstaclePatterns = obstaclesPatternsData[level - 1];
	return possibleObstaclePatterns[
		Math.floor(Math.random() * possibleObstaclePatterns.length)
	];
};
