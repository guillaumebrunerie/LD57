import { getFrame } from "./Animation";
import {
	A_Embers,
	A_HeartExplosion,
	A_Level2Souls,
	A_Level2Wind,
	A_Level3Rain,
	A_Level8Black,
	A_Snow,
	A_TheEnd,
} from "./assets";
import { useGame } from "./game";
import { clamp } from "./math";
import { Rectangle } from "./Rectangle";

export const ForegroundFragment = ({
	level,
	lt,
	alpha,
}: {
	level: number;
	lt: number;
	alpha: number;
}) => {
	switch (level) {
		case 1:
			return null;
		case 2:
			return (
				<>
					<sprite
						blendMode="add"
						texture={getFrame(A_Level2Wind, 20, lt)}
						scale={5}
						alpha={alpha}
					/>
					<sprite
						blendMode="add"
						texture={getFrame(A_Level2Souls, 20, lt)}
						scale={5}
						alpha={alpha}
					/>
				</>
			);
		case 3:
			return (
				<sprite
					blendMode="add"
					texture={getFrame(A_Level3Rain, 20, lt)}
					scale={5}
					alpha={alpha}
				/>
			);
		case 4:
			return null;
		case 5:
			return null;
		case 6:
			return (
				<sprite
					blendMode="add"
					texture={getFrame(A_Embers, 20, lt)}
					scale={5}
					alpha={alpha}
				/>
			);
		case 7:
			return null;
		case 8:
			return (
				<sprite
					blendMode="multiply"
					texture={getFrame(A_Level8Black, 20, lt)}
					scale={5}
					alpha={alpha}
				/>
			);
		case 9:
			return (
				<sprite
					blendMode="add"
					texture={getFrame(A_Snow, 20, lt)}
					scale={5}
					alpha={alpha}
				/>
			);
		case 10:
			return (
				<sprite
					blendMode="add"
					texture={getFrame(A_Snow, 20, lt)}
					scale={5}
					alpha={alpha}
				/>
			);
		default:
			return null;
	}
};

const tween = (t: number, ...tweens: [number, number][]) => {
	const i = tweens.findIndex(([tweenT]) => t < tweenT);
	if (i == 0) {
		return tweens[0][1];
	} else if (i == -1) {
		return tweens[tweens.length - 1][1];
	} else {
		const [start, value1] = tweens[i - 1];
		const [end, value2] = tweens[i];
		return value1 + ((value2 - value1) * (t - start)) / (end - start);
	}
};

export const Foreground = () => {
	const game = useGame();
	const level = game.level;
	const nextLevel = level + 1;
	const nt = tween(
		game.depth,
		[game.levelDepth * level - 1920 * 2, 0],
		[game.levelDepth * level, 1],
	);
	return (
		<container y={game.depth}>
			<ForegroundFragment level={level} lt={game.lt} alpha={1 - nt} />
			{nt > 0 && (
				<ForegroundFragment level={nextLevel} lt={game.lt} alpha={nt} />
			)}
		</container>
	);
};

export const EndFg = () => {
	const game = useGame();
	const explosionLt = game.lt - 0.2;
	return (
		<container>
			{game.isWinning && explosionLt > 0 && (
				<sprite
					x={750}
					y={game.levelDepth * game.levels + 1920 - 700}
					anchor={{ x: 0.5, y: 0.5 }}
					blendMode="add"
					texture={getFrame(
						A_HeartExplosion,
						10,
						explosionLt,
						"remove",
					)}
					scale={1.2}
				/>
			)}
			{game.isWinning && explosionLt > 3 && (
				<container>
					<Rectangle
						x={0}
						y={game.levelDepth * game.levels}
						width={1080}
						height={1920}
						color={0x000022}
						alpha={clamp(explosionLt - 3, 0, 1) * 0.25}
						draw={() => {}}
					/>
					<sprite
						x={540}
						y={game.levelDepth * game.levels + 1920 / 2}
						anchor={{ x: 0.5, y: 0.5 }}
						texture={getFrame(
							A_TheEnd,
							10,
							explosionLt - 3,
							"hold",
						)}
						scale={2}
					/>
				</container>
			)}
		</container>
	);
};
