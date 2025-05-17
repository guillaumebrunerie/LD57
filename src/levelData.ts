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
		duration: 6,
		spacing: [800, 1200],
		patterns: [
			/*[enemyStill({ x: [300, 500], radius: 50, speed: 2 })],*/
			/*[
				fireball({
					speed: 2000,
					range: [-700, 1700],
					scaleX: -1,
					rotation: [-30, 30],
				}),
			],*/
			/*[iceball({ speed: 2000, range: [-700, 1700], scaleX: -1 })],*/
			[
				spike1({ x: 1080, y: 500, scaleX: -1 }),
				spike4({ y: -500 }),
				rock3({ x: [400, 500], y: [-200, 200] }),
			],
			[
				spike3({ x: 1080, y: 600, scaleX: -1 }),
				spike4({ x: 1080, y: 100, scaleX: -1 }),
				spike2({ y: -520 }),
			],
			[
				spike1({ x: 1080, y: [400, 600], scaleX: -1 }),
				spike3({ x: 0, y: [-150, 100], scaleX: 1 }),
				spike1({ y: [-600, -300] }),
				rock3({ x: [360, 400], y: [260, 600] }),
			],
			[rock2({ x: [500, 600], y: [400, -300] })],
			/*[rock3({ x: [330, 700] })],*/
			[rock1({ x: 400, y: -400 }), rock2({ x: [600, 700], y: 300 })],
			[
				rock3({ x: 700, y: -440 }),
				rock2({ x: 400, y: 0 }),
				rock1({ x: 700, y: 440 }),
			],
			[
				spike3({ y: 0, rotation: 15 }),
				spike3({ y: -400, rotation: 45 }),
				spike3({ y: 800, rotation: -25 }),
				rock3({ x: 740, y: 340 }),
			],
		],
	},
	// Level 2: introduce still enemy
	{
		speed: 650,
		duration: 6,
		spacing: [900, 1100],
		patterns: [
			[
				spike1({ x: 1080, y: 400, scaleX: -0.7, scaleY: -0.7 }),
				spike1({ x: 1080, y: 200, scaleX: -1 }),
				spike2({ y: -420 }),
				rock1({ x: 400, y: [400, 500] }),
			],
			[
				spike3({ x: 1080, y: 580, scaleX: -1, rotation: 40 }),
				spike4({ x: 1040, y: 200, scaleX: -1 }),
				spike2({ y: -200, scaleX: 0.8, scaleY: 0.8 }),
				spike2({
					x: 60,
					y: -180,
					scaleX: 0.5,
					scaleY: 0.5,
					rotation: 30,
				}),
				spike2({
					x: 40,
					y: -220,
					scaleX: 0.6,
					scaleY: 0.6,
					rotation: -30,
				}),
			],
			[
				spike4({ y: 380, scaleX: 1.1, scaleY: 1.1 }),
				spike1({ y: -300, scaleX: 1.1, scaleY: 1.1 }),
				spike4({ x: 1080, y: -500, scaleX: -1.3, scaleY: 1.3 }),
				spike3({
					x: 1070,
					y: 700,
					scaleX: -1,
					scaleY: 1,
					rotation: 40,
				}),
				rock3({ x: 540, y: 460 }),
			],
			[
				rock1({ x: [560, 660], y: -540, rotation: -20 }),
				rock2({ x: 500, y: [-50, 50] }),
				rock3({ x: 400, y: 340, rotation: -20 }),
			],
			[
				rock2({ x: [560, 660], y: -540, rotation: 20 }),
				rock3({ x: [400, 500], y: [300, 500] }),
			],
			[
				rock1({ x: 500, y: -100, rotation: -20 }),
				rock2({ x: 580, y: 160 }),
			],
			[
				spike3({ y: [240, 500] }),
				spike4({ x: 1080, y: [-300, -400], scaleX: -1 }),
				rock3({ x: [400, 500], y: [-100, -300] }),
			],
			[
				spike3({ x: 50, y: [0, -340] }),
				spike1({ x: 1050, y: [-200, -400], scaleX: -1.2, scaleY: 1.2 }),
				spike2({ y: [460, 540], scaleX: 0.9, scaleY: 0.9 }),
				spike4({ x: 1080, y: [400, 480], scaleX: -1 }),
			],
		],
	},
	// Level 3: more still enemies and more rock patterns
	{
		speed: 700,
		duration: 6,
		spacing: [700, 900],
		patterns: [
			[
				spike4({ y: 800, scaleX: 1.4, scaleY: 1.4 }),
				spike1({ y: -300, scaleX: 1.1, scaleY: 1.1 }),
				spike4({ x: 1080, y: -300, scaleX: -1.3, scaleY: 1.3 }),
				rock3({ x: 570, y: [100, 150] }),
			],
			[
				spike1({ x: 1080, y: 300, scaleX: -1 }),
				spike4({ y: -200 }),
				rock3({ x: 500, y: 600 }),
			],
			[rock2({ x: [560, 660], y: -240, rotation: 20 })],
			[
				spike3({ y: -200, rotation: 26 }),
				spike1({ x: 1080, y: 400, scaleX: -1.4, rotation: 15 }),
				rock3({ x: 400, y: -400, rotation: 20 }),
				enemyHorizontal({
					y: 700,
					speed: 360,
					range: [240, 820],
				}),
			],
			[
				enemyHorizontal({
					y: [-200, -300],
					speed: 380,
					range: [250, 830],
				}),
				rock1({ x: [560, 660], y: 140, rotation: -15 }),
				rock3({ x: [300, 400], y: 700, rotation: 35 }),
			],
			[
				spike1({ y: -80, scaleX: 1, scaleY: 1 }),
				spike1({ x: 1090, y: 700, scaleX: -1.2, rotation: 15 }),
				enemyHorizontal({
					y: 540,
					speed: 200,
					range: [220, 680],
				}),
			],
			[
				spike3({ y: 0, rotation: 15 }),
				spike3({ y: -400, rotation: 45 }),
				spike3({ y: 400, rotation: 15, scaleX: 1.3, scaleY: 1 }),
				spike3({ y: 800, rotation: -25 }),
				enemyHorizontal({
					y: 240,
					speed: 350,
					range: [240, 840],
				}),
			],
			[
				spike4({ y: -370, scaleX: 1, scaleY: 0.9, rotation: 15 }),
				spike1({ x: 1070, y: 600, scaleX: -1.4, scaleY: 0.9 }),
				spike1({ y: 700, scaleX: 1, scaleY: 0.9 }),
				enemyHorizontal({
					y: -130,
					speed: 400,
					range: [260, 800],
				}),
			],
		],
	},
	// Level 4: introduce vertical enemies
	{
		speed: 750,
		duration: 6,
		spacing: [800, 1100],
		patterns: [
			[
				spike3({
					x: 1050,
					y: 400,
					scaleX: -1,
					scaleY: 0.8,
					rotation: -20,
				}),
				spike2({
					x: 1050,
					y: 660,
					scaleX: -0.5,
					scaleY: 0.5,
					rotation: 10,
				}),
				spike1({ x: 1090, y: -340, scaleX: -1 }),
				spike2({
					x: -40,
					y: -300,
					scaleX: 0.8,
					scaleY: 0.8,
					rotation: -30,
				}),
				spike2({
					x: -80,
					y: 380,
					scaleX: 1,
					scaleY: 0.7,
					rotation: -20,
				}),
			],
			[
				spike1({ y: 120, rotation: 26 }),
				spike3({ x: 1060, y: 700, scaleX: -1.5 }),
				rock3({ x: 660, y: -300, rotation: 20 }),
			],
			[
				spike1({ x: 1070, y: 560, scaleX: -1.2, scaleY: 0.9 }),
				spike1({ y: 640, scaleX: 1.2, scaleY: 0.9 }),
				spike1({
					x: 1070,
					y: -640,
					scaleX: -1.2,
					scaleY: 0.9,
					rotation: -42,
				}),
				spike1({ y: -40, scaleX: 1.4, scaleY: 0.9, rotation: -17 }),
				enemyHorizontal({
					y: 200,
					speed: 460,
					range: [260, 800],
				}),
			],
			[
				spike2({ y: 120, rotation: 26 }),
				enemyHorizontal({
					y: 130,
					speed: 175,
					range: [400, 850],
				}),
			],
			[
				spike2({ y: -280, scaleX: 1 }),
				spike2({ x: 1080, y: 560, scaleX: -0.9, scaleY: 0.9 }),
				enemyVertical({ x: 600, speed: 250, range: [-180, 400] }),
			],
			[
				spike1({ y: 120, rotation: -12 }),
				spike3({
					x: 1070,
					y: 660,
					scaleX: -1,
					scaleY: 1,
					rotation: 30,
				}),
				enemyVertical({
					x: 460,
					speed: 380,
					range: [-200, 600],
				}),
				enemyVertical({
					x: 660,
					speed: 450,
					range: [-400, 600],
				}),
			],
			[
				spike3({
					x: 1070,
					y: 560,
					scaleX: -1,
					scaleY: 1,
					rotation: 20,
				}),
				spike4({ y: 440, scaleX: 1, scaleY: 1 }),
				spike4({
					x: 1070,
					y: -560,
					scaleX: -1,
					scaleY: 1,
					rotation: -12,
				}),
				spike3({ y: -40, scaleX: 1, scaleY: 0.9, rotation: -17 }),
				enemyVertical({
					x: 340,
					speed: 400,
					range: [0, 480],
				}),
				enemyVertical({
					x: 860,
					speed: 400,
					range: [-360, 300],
				}),
			],
			[
				spike4({ y: -300, scaleX: 1 }),
				spike1({ x: 1070, y: 560, scaleX: -0.9, scaleY: 0.9 }),
				enemyVertical({
					x: 540,
					speed: 400,
					range: [-500, 700],
				}),
			],
		],
	},
	// Level 5: introduce horizontal enemies
	{
		speed: 800,
		duration: 4,
		spacing: [800, 1100],
		patterns: [
			[
				spike2({ x: 1080, y: 130, scaleX: -0.7, scaleY: 0.7 }),
				spike1({ x: 1080, y: -420, scaleX: -1 }),
				spike1({ x: 1080, y: 700, scaleX: -1 }),
				spike4({
					x: 30,
					y: -360,
					scaleX: 1.4,
					scaleY: 0.9,
					rotation: -12,
				}),
				rock3({ x: 340, y: 530 }),
			],
			[
				spike3({ x: 1050, y: 500, scaleX: -1, rotation: -20 }),
				spike3({
					x: 1050,
					y: 830,
					scaleX: -0.8,
					scaleY: 0.8,
					rotation: 20,
				}),
				spike4({ x: 1040, y: [0, 200], scaleX: -1 }),
				spike2({
					x: 60,
					y: -180,
					scaleX: 0.5,
					scaleY: 0.5,
					rotation: 30,
				}),
				spike2({ y: -200, scaleX: 0.8, scaleY: 0.8 }),
				rock3({ x: 280, y: 440 }),
				rock3({ x: 740, y: -520 }),
			],
			[
				spike2({ y: 600, scaleX: 0.8, scaleY: 1 }),
				spike1({ y: -300, scaleX: 1.1, scaleY: 1.1 }),
				spike4({ x: 1080, y: -500, scaleX: -1.3, scaleY: 1.3 }),
				spike2({
					x: 1200,
					y: 160,
					scaleX: -0.9,
					scaleY: 0.9,
					rotation: 10,
				}),
				spike3({ x: 1050, y: 800, scaleX: -0.8, rotation: 20 }),
			],
			[
				rock3({ x: 800, y: -300 }),
				rock1({ x: 360, y: 140, rotation: -20 }),
				enemyHorizontal({
					y: 520,
					speed: 175,
					range: [260, 850],
				}),
			],
			[
				rock2({ x: 400, y: -400, rotation: 20 }),
				rock3({ x: 800, y: 430 }),
				enemyHorizontal({
					y: -120,
					speed: 400,
					range: [260, 850],
				}),
			],
			[
				rock3({ x: 520, y: -200, rotation: 30 }),
				rock2({ x: 700, y: 160 }),
			],
			[
				spike3({ y: 600 }),
				spike4({ x: 1080, y: -400, scaleX: -1 }),
				rock1({ x: 500, y: -180, scaleX: 1, scaleY: 1 }),
				enemyVertical({
					x: 500,
					speed: 400,
					range: [140, 600],
				}),
			],
			[
				spike3({ x: 50, y: -120 }),
				spike2({ x: 1300, y: -460, scaleX: -1, scaleY: 1 }),
				spike3({ x: 1080, y: [400, 480], scaleX: -1 }),
				enemyHorizontal({
					y: 180,
					speed: 300,
					range: [260, 820],
				}),
			],
		],
	},
	// Level 6: introduce fireballs
	{
		speed: 830,
		duration: 8,
		spacing: [800, 1000],
		patterns: [
			[
				rock3({ x: 360, y: -340, rotation: -20 }),
				rock3({ x: 780, y: -120, rotation: 30 }),
				rock1({ x: 360, y: 240, rotation: -20 }),
				enemyHorizontal({
					y: 620,
					speed: 400,
					range: [260, 850],
				}),
			],
			[
				spike3({
					x: 1070,
					y: 620,
					scaleX: -1.4,
					scaleY: 0.9,
					rotation: 28,
				}),
				spike3({ y: 540, scaleX: 1.4, scaleY: 0.9, rotation: 32 }),
				spike4({
					x: 1070,
					y: -560,
					scaleX: -1.4,
					scaleY: 0.9,
					rotation: -12,
				}),
				spike3({ y: -40, scaleX: 1.4, scaleY: 0.9, rotation: -17 }),
				enemyHorizontal({
					y: 200,
					speed: 450,
					range: [240, 850],
				}),
			],
			[
				spike2({
					x: -60,
					y: 800,
					scaleX: 0.8,
					scaleY: 1,
					rotation: -42,
				}),
				spike1({ y: -200, scaleX: 1, scaleY: 1 }),
				spike4({ x: 1080, y: -500, scaleX: -1.3, scaleY: 1.3 }),
				spike2({
					x: 1080,
					y: -160,
					scaleX: -0.9,
					scaleY: 0.9,
					rotation: -36,
				}),
				spike1({ x: 1050, y: 660, scaleX: -0.8 }),
				enemyHorizontal({
					y: 300,
					speed: 450,
					range: [500, 850],
				}),
			],
			[
				spike3({
					x: 1070,
					y: 560,
					scaleX: -1.4,
					scaleY: 0.9,
					rotation: 20,
				}),
				spike4({ y: 640, scaleX: 1.4, scaleY: 0.9 }),
				spike4({
					x: 1070,
					y: -560,
					scaleX: -1.4,
					scaleY: 0.9,
					rotation: -12,
				}),
				spike3({ y: -40, scaleX: 1.4, scaleY: 0.9, rotation: -17 }),
				enemyVertical({
					x: 240,
					speed: 400,
					range: [0, 480],
				}),
				enemyVertical({
					x: 860,
					speed: 400,
					range: [-360, 300],
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
				rock3({ x: 400, y: -200, rotation: 30 }),
				rock2({ x: 540, y: 160 }),
				rock3({
					x: 660,
					y: 400,
					rotation: 50,
					scaleX: 0.8,
					scaleY: 0.8,
				}),
				enemyHorizontal({
					y: -180,
					speed: 200,
					range: [600, 850],
				}),
			],
			[
				spike3(),
				enemyHorizontal({
					y: -300,
					speed: 350,
					range: [500, 820],
				}),
				fireball({
					y: 500,
					speed: 1800,
					range: [-1000, 1400],
					scaleX: -1,
					rotation: -15,
				}),
				fireball({
					y: 800,
					speed: 2000,
					range: [1400, -1000],
					scaleX: -1,
					rotation: -195,
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
				fireball({
					y: 600,
					speed: 2000,
					range: [-1000, 1400],
					scaleX: -1,
				}),
			],
			[
				fireball({
					y: 960,
					speed: 2000,
					range: [-1000, 1400],
					scaleX: -1,
					scaleY: 1,
					rotation: -30,
				}),
				spike1({
					x: -60,
					y: 480,
					scaleX: 1.2,
					scaleY: 1,
					rotation: -15,
				}),
				fireball({
					y: 460,
					speed: 2000,
					range: [1400, -1000],
					scaleX: -1,
					rotation: -210,
				}),
				spike1({
					x: 1120,
					y: -640,
					scaleX: -1.4,
					scaleY: 1,
					rotation: -42,
				}),
			],
		],
	},
	// Level 7: more patterns
	{
		speed: 860,
		duration: 4,
		spacing: [600, 900],
		patterns: [
			[
				spike3({
					x: 1070,
					y: -80,
					scaleX: -1.4,
					scaleY: 0.9,
					rotation: 28,
				}),
				spike3({ y: 340, scaleX: 1.4, scaleY: 0.9, rotation: 32 }),
				enemyHorizontal({
					y: 100,
					speed: 175,
					range: [240, 850],
				}),
			],
			[
				spike2(),
				enemyVertical({ x: 600, speed: 250, range: [100, 350] }),
			],
			[
				spike1(),
				enemyVertical({
					x: 800,
					speed: 360,
					range: [-300, 700],
				}),
				enemyVertical({
					x: 500,
					speed: 260,
					range: [-100, 600],
				}),
			],
			[
				spike3({ x: 1050, y: 500, scaleX: -1, rotation: -20 }),
				spike3({
					x: 1050,
					y: 830,
					scaleX: -0.8,
					scaleY: 0.8,
					rotation: 20,
				}),
				spike4({ x: 1040, y: [0, 200], scaleX: -1 }),
				spike2({ y: -200, scaleX: 0.8, scaleY: 0.8 }),
				rock3({ x: 320, y: 140 }),
				enemyVertical({
					x: 300,
					speed: 400,
					range: [400, 800],
				}),
			],
			[
				spike1({ y: 120, rotation: 26 }),
				spike3({ x: 1060, y: 700, scaleX: -1.5 }),
				rock3({ x: 500, y: -300, rotation: 20 }),
				enemyVertical({
					x: 540,
					speed: 400,
					range: [-100, 480],
				}),
			],
			[
				enemyStill({ x: 740, y: -320, radius: 50, speed: 2 }),
				enemyStill({ x: 380, y: 120, radius: 50, speed: 2 }),
				enemyStill({ x: 690, y: 620, radius: 50, speed: 2 }),
			],
			[
				spike3(),
				spike4({ x: 1080, y: [0, 100], scaleX: -1 }),
				enemyHorizontal({ speed: 115, range: [500, 730] }),
				enemyStill({ x: 340, y: 620, radius: 30, speed: -2 }),
				enemyStill({ x: 720, y: 620, radius: 30, speed: 2 }),
			],
			[
				spike3({ y: 0, rotation: 15 }),
				spike3({ y: -400, rotation: 45 }),
				spike3({ y: 400, rotation: 15, scaleX: 1.3, scaleY: 1 }),
				enemyStill({ x: 680, y: -320, radius: 30, speed: 2 }),
				enemyHorizontal({
					y: 800,
					speed: 200,
					range: [240, 820],
				}),
			],
		],
	},
	// Level 8: nothing special, it’s already dark
	{
		speed: 900,
		duration: 8,
		spacing: [600, 900],
		patterns: [
			[
				spike3({ y: -200, rotation: 26 }),
				spike1({ x: 1080, y: [350, 450], scaleX: -1 }),
				enemyStill({ x: 340, y: 320, radius: 30, speed: -2 }),
				enemyStill({ x: 720, y: 820, radius: 30, speed: 2 }),
			],
			[
				spike3({ x: 1080, y: [200, 300], scaleX: -1 }),
				enemyHorizontal({
					y: 800,
					speed: 180,
					range: [240, 820],
				}),
				enemyHorizontal({
					y: 460,
					speed: 300,
					range: [240, 820],
				}),
			],
			[
				spike2({ y: -100, scaleX: 0.9, scaleY: 0.9 }),
				spike4({ x: 1080, y: [200, 300], scaleX: -1 }),
				rock3({ x: 400, y: -400, rotation: 30 }),
				rock3({
					x: 680,
					y: 440,
					rotation: 50,
					scaleX: 0.8,
					scaleY: 0.8,
				}),
				rock1({ x: 640, y: 780, scaleX: 1, scaleY: 1 }),
			],
			[
				spike3({ y: -200, rotation: 26 }),
				spike1({ x: 1080, y: 400, scaleX: -1.4, rotation: 15 }),
				rock1({ x: 580, y: 600, scaleX: -0.7, scaleY: 0.7 }),
				enemyStill({ x: 800, y: 840, radius: 15, speed: 2 }),
			],
			[
				rock3({ x: 400, y: -200, rotation: 30 }),
				rock2({ x: 540, y: 660 }),
				enemyHorizontal({
					y: -380,
					speed: 200,
					range: [500, 850],
				}),
				enemyHorizontal({
					y: 400,
					speed: 230,
					range: [240, 800],
				}),
			],
			[
				spike3({
					x: 1050,
					y: 700,
					scaleX: -1.3,
					scaleY: 0.8,
					rotation: -20,
				}),
				spike1({ x: 1040, y: -140, scaleX: -1 }),
				spike2({ y: -80, scaleX: 0.8, scaleY: 0.8, rotation: -30 }),
				spike2({
					x: -260,
					y: 580,
					scaleX: 1,
					scaleY: 1,
					rotation: -20,
				}),
				enemyHorizontal({
					y: [100, 200],
					speed: 600,
					range: [240, 840],
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
		speed: 900,
		duration: 8,
		spacing: [800, 1000],
		patterns: [
			[
				spike3({ x: 1050, y: 500, scaleX: -1, rotation: -20 }),
				spike3({
					x: 1050,
					y: 830,
					scaleX: -0.8,
					scaleY: 0.8,
					rotation: 20,
				}),
				spike4({ x: 1040, y: [0, 200], scaleX: -1 }),
				spike2({
					x: 60,
					y: -180,
					scaleX: 0.5,
					scaleY: 0.5,
					rotation: 30,
				}),
				spike2({
					x: 40,
					y: -220,
					scaleX: 0.6,
					scaleY: 0.6,
					rotation: -30,
				}),
			],
			[
				spike3({
					x: 1070,
					y: 560,
					scaleX: -1.4,
					scaleY: 0.9,
					rotation: 20,
				}),
				spike4({ y: 640, scaleX: 1.4, scaleY: 0.9 }),
				spike4({
					x: 1070,
					y: -560,
					scaleX: -1.4,
					scaleY: 0.9,
					rotation: -12,
				}),
				spike3({ y: -40, scaleX: 1.4, scaleY: 0.9, rotation: -17 }),
				enemyHorizontal({
					y: 820,
					speed: 460,
					range: [260, 820],
				}),
				enemyVertical({
					x: 240,
					speed: 400,
					range: [0, 480],
				}),
				enemyVertical({
					x: 860,
					speed: 400,
					range: [-360, 300],
				}),
			],
			[
				enemyHorizontal({
					y: 200,
					speed: 290,
					range: [250, 600],
				}),
				spike3({ y: -200, rotation: 26 }),
				spike1({ x: 1080, y: 400, scaleX: -1.4, rotation: 15 }),
				rock3({ x: 740, y: -300, rotation: 20 }),
				enemyStill({ x: 380, y: 640, radius: 100, speed: 2 }),
			],
			[
				spike2({
					x: 1200,
					y: 180,
					scaleX: -0.8,
					scaleY: 0.8,
					rotation: 24,
				}),
				spike1({ x: 1080, y: -420, scaleX: -1 }),
				spike1({ x: 1080, y: 700, scaleX: -1 }),
				spike1({ y: 700, scaleX: 0.9, scaleY: 0.9 }),
				spike3({
					x: -80,
					y: -360,
					scaleX: 1.4,
					scaleY: 0.9,
					rotation: -12,
				}),
			],
			[
				spike3({ x: 1080, y: 500, scaleX: -1, rotation: -20 }),
				spike3({
					x: 1080,
					y: 800,
					scaleX: -0.8,
					scaleY: 0.8,
					rotation: 20,
				}),
				spike4({ x: 1040, y: -500, scaleX: -1 }),
				spike1({ y: 500, scaleX: 0.8, scaleY: 0.8 }),
				spike2({
					x: 60,
					y: -180,
					scaleX: 0.5,
					scaleY: 0.5,
					rotation: 30,
				}),
				spike2({ y: -200, scaleX: 0.8, scaleY: 0.8 }),
				rock3({ x: 620, y: 180, scaleX: 0.8, scaleY: 0.8 }),
				enemyStill({ x: 340, y: -500, radius: 60, speed: 2 }),
				enemyStill({ x: 260, y: 700, radius: 30, speed: 2 }),
			],
			[
				spike1({ y: -80, scaleX: 1, scaleY: 1 }),
				enemyHorizontal({
					y: -160,
					speed: 450,
					range: [400, 850],
				}),
				spike1({ x: 1090, y: 700, scaleX: -1.2, rotation: 15 }),
				enemyHorizontal({
					y: 560,
					speed: 200,
					range: [220, 680],
				}),
			],
			[
				rock2({ x: 560, y: -500, rotation: 20 }),
				rock3({ x: 280, y: 600 }),
				rock3({ x: 800, y: 600 }),
				enemyHorizontal({
					y: -160,
					speed: 600,
					range: [260, 850],
				}),
				enemyHorizontal({
					y: 300,
					speed: 480,
					range: [260, 850],
				}),
			],
			[
				rock3({ x: 360, y: -340, rotation: -20 }),
				rock3({ x: 740, y: [-50, 50], rotation: 30 }),
				rock1({ x: 360, y: 440, rotation: -20 }),
				enemyHorizontal({
					y: 720,
					speed: 175,
					range: [260, 850],
				}),
			],
			[
				spike1({ y: 120, rotation: -12 }),
				spike3({ y: 450, rotation: 15 }),
				spike3({ y: -600, rotation: 45 }),
				spike3({
					x: 1050,
					y: 860,
					scaleX: -1,
					scaleY: 1,
					rotation: 10,
				}),
				enemyVertical({
					x: 500,
					speed: 400,
					range: [-400, 400],
				}),
				enemyVertical({
					x: 820,
					speed: 400,
					range: [-100, 600],
				}),
			],
			[
				spike3({ x: 1050, y: 500, scaleX: -1, rotation: -20 }),
				spike3({
					x: 1050,
					y: 830,
					scaleX: -0.8,
					scaleY: 0.8,
					rotation: 20,
				}),
				spike4({ x: 1040, y: [0, 200], scaleX: -1 }),
				spike1({ y: 500, scaleX: 0.8, scaleY: 0.8 }),
				spike2({
					x: 60,
					y: -180,
					scaleX: 0.5,
					scaleY: 0.5,
					rotation: 30,
				}),
				spike2({ y: -200, scaleX: 0.8, scaleY: 0.8 }),
				rock2({ x: 380, y: -580 }),
				enemyStill({ x: 540, y: 240, radius: 30, speed: 2 }),
				enemyHorizontal({
					y: -400,
					speed: 200,
					range: [240, 840],
				}),
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
