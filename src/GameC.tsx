import { Game, GameContext, useGame } from "./game";
import {
	A_Arrow,
	A_CupidDie,
	A_CupidHurt,
	A_CupidIdle,
	A_CupidShot,
	A_Embers,
	A_Heart,
	A_HeartExplosion,
	A_Level2Wind,
	A_Level3Rain,
	A_Level8Black,
	A_Snow,
	A_TheEnd,
	T_Arrow_Off,
	T_Arrow_On,
	T_CupidArrow_Blurred,
	T_Heart_Off,
	T_Heart_On,
} from "./assets";
import { Rectangle } from "./Rectangle";
import { StartScreen, GameOverScreen } from "./Postings";
import { Polygon } from "pixi.js";
import { smoothTriangle } from "./utils";
import type { Arrow } from "./player";
import { PolygonShape } from "./Polygon";
import { useOnKeyDown } from "./useOnKeyDown";
import { useRef } from "react";
import { useOnKeyDownUp } from "./useOnKeyDownUp";
import { getDuration, getFrame } from "./Animation";
import { CustomText } from "./CustomText";
import { clamp } from "./math";
import { ObstacleC } from "./ObstacleC";
import { Background } from "./Background";
import { useTickingObject } from "./useTickingObject";
import type { ArrowIndicator, ArrowIndicators } from "./arrowIndicators";
import type { HeartIndicator, HeartIndicators } from "./heartIndicators";

export const GameC = () => {
	const game = useTickingObject(Game, "game");

	useOnKeyDownUp(
		"ArrowLeft",
		() => game.player.moveLeft(true),
		() => game.player.moveLeft(false),
	);
	useOnKeyDownUp(
		"ArrowRight",
		() => game.player.moveRight(true),
		() => game.player.moveRight(false),
	);
	useOnKeyDown("Space", () => game.shoot());
	useOnKeyDown("Enter", () => game.cheat());
	useOnKeyDown("Digit1", () => game.cheatToLevel(1));
	useOnKeyDown("Digit2", () => game.cheatToLevel(2));
	useOnKeyDown("Digit3", () => game.cheatToLevel(3));
	useOnKeyDown("Digit4", () => game.cheatToLevel(4));
	useOnKeyDown("Digit5", () => game.cheatToLevel(5));
	useOnKeyDown("Digit6", () => game.cheatToLevel(6));
	useOnKeyDown("Digit7", () => game.cheatToLevel(7));
	useOnKeyDown("Digit8", () => game.cheatToLevel(8));
	useOnKeyDown("Digit9", () => game.cheatToLevel(9));
	useOnKeyDown("Digit0", () => game.cheatToLevel(10));

	const ref = useRef(null);

	if (game.state == "startScreen") {
		return <StartScreen game={game} />;
	}

	let mask = undefined;
	if (game.depth >= game.levelDepth * game.levels - 2000) {
		mask = new Polygon([
			0,
			0,
			1080,
			0,
			1080,
			game.levelDepth * game.levels - 30,
			1080 - 75,
			game.levelDepth * game.levels,
			1080 - 150,
			game.levelDepth * game.levels - 30,
			150,
			game.levelDepth * game.levels - 30,
			75,
			game.levelDepth * game.levels,
			0,
			game.levelDepth * game.levels - 30,
		]);
	}

	const fadeAlpha = Math.max(0, Math.min(1, 1 - game.lt / 0.5));

	return (
		<GameContext value={game}>
			<container>
				<Screen>
					<Background />
					{mask && <PolygonShape polygon={mask} myRef={ref} />}
					<container mask={mask ? ref.current : undefined}>
						{game.obstaclesManager.obstacles.map((obstacle) => (
							<ObstacleC
								key={obstacle.id}
								obstacle={obstacle}
								level={game.level}
								depth={game.depth}
								nextLevelDepth={game.levelDepth * game.level}
							/>
						))}
					</container>
					<PlayerC />
					<HitFeathers />
					{game.player.arrow && <ArrowC arrow={game.player.arrow} />}
					<Foreground />
					<EndFg />
				</Screen>
				<HeartIndicatorsC
					heartIndicators={game.player.heartIndicators}
				/>
				<ArrowIndicatorsC
					arrowIndicators={game.player.arrowIndicators}
				/>
				<LevelIndicator />
				{game.player.isGameOver && <GameOverScreen />}
				<Rectangle
					x={0}
					y={0}
					width={1080}
					height={1920}
					color={0x000000}
					alpha={game.isWinning ? 0 : fadeAlpha}
					draw={() => {}}
				/>
			</container>
		</GameContext>
	);
};

const Screen = ({ children }: { children: React.ReactNode }) => {
	const game = useGame();
	const screenShakeDuration = 0.2;
	const screenShakeX = 20;
	const screenShakeY = 20;
	const inScreenShake =
		game.lastHit && game.lt < game.lastHit.lt + screenShakeDuration;
	const shakeX = inScreenShake ? (Math.random() * 2 - 1) * screenShakeX : 0;
	const shakeY = inScreenShake ? (Math.random() * 2 - 1) * screenShakeY : 0;
	return (
		<container x={shakeX} y={shakeY - game.depth}>
			{children}
		</container>
	);
};

const ForegroundFragment = ({
	level,
	alpha,
}: {
	level: number;
	alpha: number;
}) => {
	const game = useGame();
	switch (level) {
		case 1:
			return null;
		case 2:
			return (
				<sprite
					blendMode="add"
					texture={getFrame(A_Level2Wind, 20, game.lt)}
					scale={5}
					alpha={alpha}
				/>
			);
		case 3:
			return (
				<sprite
					blendMode="add"
					texture={getFrame(A_Level3Rain, 20, game.lt)}
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
					texture={getFrame(A_Embers, 20, game.lt)}
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
					texture={getFrame(A_Level8Black, 20, game.lt)}
					scale={5}
					alpha={alpha}
				/>
			);
		case 9:
			return (
				<sprite
					blendMode="add"
					texture={getFrame(A_Snow, 20, game.lt)}
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

const Foreground = () => {
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
			<ForegroundFragment level={level} alpha={1 - nt} />
			{nt > 0 && <ForegroundFragment level={nextLevel} alpha={nt} />}
		</container>
	);
};

const EndFg = () => {
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

const LevelIndicator = () => {
	const game = useGame();
	return (
		<container x={1080 - 20} y={20}>
			<CustomText
				anchor={{ x: 1, y: 0 }}
				text={game.level <= 9 ? `Level ${game.level}/9` : "The End"}
				style={{
					fontSize: 25,
					fontFamily: "Heroes Legend",
					fill: "#DDD",
					dropShadow: {
						angle: 90,
						distance: 3,
					},
				}}
			/>
		</container>
	);
};

const heartDeltaX = 65;

const HeartIndicatorsC = ({
	heartIndicators,
}: {
	heartIndicators: HeartIndicators;
}) => {
	return (
		<container x={1080 / 2 - 120} y={55}>
			{heartIndicators.heartIndicators.map((heartIndicator, i) => (
				<container key={i} x={(i - 1) * heartDeltaX}>
					<HeartIndicatorC heartIndicator={heartIndicator} />
				</container>
			))}
		</container>
	);
};

const HeartIndicatorC = ({
	heartIndicator,
}: {
	heartIndicator: HeartIndicator;
}) => {
	return (
		<sprite
			texture={
				heartIndicator.hasHeart ?
					getFrame(A_Heart, 20, heartIndicator.lt, "hold")
				:	T_Heart_Off
			}
			anchor={0.5}
		/>
	);
};

const arrowDeltaX = 60;

const ArrowIndicatorsC = ({
	arrowIndicators,
}: {
	arrowIndicators: ArrowIndicators;
}) => {
	return (
		<container x={1080 / 2 + 120} y={55}>
			{arrowIndicators.arrowIndicators.map((arrowIndicator, i) => (
				<container key={i} x={(i - 1) * arrowDeltaX}>
					<ArrowIndicatorC arrowIndicator={arrowIndicator} />
				</container>
			))}
		</container>
	);
};

const ArrowIndicatorC = ({
	arrowIndicator,
}: {
	arrowIndicator: ArrowIndicator;
}) => {
	return (
		<sprite
			texture={
				arrowIndicator.hasArrow ?
					getFrame(A_Arrow, 20, arrowIndicator.lt, "hold")
				:	T_Arrow_Off
			}
			anchor={0.5}
		/>
	);
};

const HitFeathers = () => {
	const game = useGame();
	if (!game.lastHit) {
		return null;
	}
	return (
		<sprite
			anchor={0.5}
			x={game.lastHit.x}
			y={game.lastHit.y}
			texture={getFrame(
				A_CupidHurt,
				20,
				game.lt - game.lastHit.lt,
				"remove",
			)}
		/>
	);
};

const PlayerC = () => {
	const game = useGame();
	const player = game.player;
	const initialDuration = 0.3;
	const dy =
		600 * smoothTriangle(Math.min(1 + 2 * (game.lt - initialDuration), 1)) -
		600;
	return (
		<container x={player.posX} y={player.posY + (game.isWinning ? 0 : dy)}>
			{!player.isGameOver && (
				<sprite
					texture={
						(
							player.isShooting &&
							player.lt < getDuration(A_CupidShot, 20)
						) ?
							getFrame(A_CupidShot, 20, player.lt)
						:	getFrame(A_CupidIdle, 20, player.lt)
					}
					anchor={0.5}
					scale={{ x: player.lookingLeft ? -1 : 1, y: 1 }}
				/>
			)}
			{player.invincibleTimeout > 0 && !player.isGameOver && (
				<sprite
					texture={getFrame(A_CupidIdle, 20, player.lt)}
					tint={
						0xffffff -
						0x000101 *
							Math.floor((player.invincibleTimeout / 3) * 255)
					}
					anchor={0.5}
					scale={{ x: player.lookingLeft ? -1 : 1, y: 1 }}
				/>
			)}
			{player.isGameOver && (
				<sprite
					texture={getFrame(A_CupidDie, 10, player.lt, "remove")}
					anchor={0.5}
					scale={{ x: player.lookingLeft ? -1 : 1, y: 1 }}
				/>
			)}
		</container>
	);
};

const ArrowC = ({ arrow }: { arrow: Arrow }) => {
	return (
		<container x={arrow.x} y={arrow.y} rotation={arrow.angle - Math.PI / 2}>
			<sprite texture={T_CupidArrow_Blurred} anchor={0.5} />
		</container>
	);
};
