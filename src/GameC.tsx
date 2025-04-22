import { useGame, type Game } from "./game";
import {
	A_CupidDie,
	A_CupidHurt,
	A_CupidIdle,
	A_CupidShot,
	A_DevilHit,
	A_DevilIdle,
	A_DevilLookUp,
	A_DevilWin,
	A_DevilWinLoop,
	A_Embers,
	A_HeartExplosion,
	A_Level2Wind,
	A_Level3Rain,
	A_Snow,
	A_TheEnd,
	T_Arrow_Off,
	T_Arrow_On,
	T_Bg_Level_01,
	T_Bg_Level_02,
	T_Bg_Level_03,
	T_Bg_Level_04,
	T_Bg_Level_05,
	T_Bg_Level_06,
	T_Bg_Level_07,
	T_Bg_Level_08,
	T_Bg_Level_09,
	T_Bg_Level_09_End,
	T_CupidArrow_Blurred,
	T_DevilShadow,
	T_Gradient,
	T_Heart_Off,
	T_Heart_On,
} from "./assets";
import { Rectangle } from "./Rectangle";
import { StartScreen, GameOverScreen } from "./Postings";
import { Polygon, type FederatedPointerEvent } from "pixi.js";
import { mod, smoothTriangle } from "./utils";
import { firstTexture, type Obstacle } from "./obstacle";
import type { Arrow } from "./player";
import { PolygonShape } from "./Polygon";
import { useOnKeyDown } from "./useOnKeyDown";
import { useRef } from "react";
import { useOnKeyDownUp } from "./useOnKeyDownUp";
import { getDuration, getFrame } from "./Animation";
import { CustomText } from "./CustomText";
import { clamp } from "./math";

export const GameC = () => {
	const game = useGame();

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

	const ref = useRef(null);

	if (game.state == "startScreen") {
		return <StartScreen />;
	}

	if (game.state == "polygonEditor") {
		return <PolygonEditor />;
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
		<container>
			<Screen>
				<Background />
				{mask && <PolygonShape polygon={mask} myRef={ref} />}
				<container mask={mask ? ref.current : undefined}>
					{game.obstaclesManager.obstacles.map((obstacle) => (
						<ObstacleC key={obstacle.id} obstacle={obstacle} />
					))}
				</container>
				<PlayerC />
				<HitFeathers />
				{game.player.arrow && <ArrowC arrow={game.player.arrow} />}
				<Foreground />
				<EndFg />
			</Screen>
			<Hearts />
			<ArrowIndicators />
			<LevelIndicator />
			{game.player.lives == 0 && <GameOverScreen />}
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

const pointerEventListener =
	(game: Game, type: "pointerdown" | "pointermove" | "pointerup") =>
	(e: FederatedPointerEvent) => {
		const { x, y } = e.global;
		game.onEvent(type, { x, y });
	};

const getBg = (level: number) => {
	switch (level) {
		case 1:
			return T_Bg_Level_01;
		case 2:
			return T_Bg_Level_02;
		case 3:
			return T_Bg_Level_03;
		case 4:
			return T_Bg_Level_04;
		case 5:
			return T_Bg_Level_05;
		case 6:
			return T_Bg_Level_06;
		case 7:
			return T_Bg_Level_07;
		case 8:
			return T_Bg_Level_08;
		default:
			return T_Bg_Level_09;
	}
};

const Background = () => {
	const game = useGame();
	const y = mod(-game.depth, 1920);
	return (
		<>
			<container y={y + game.depth}>
				<BackgroundFragment depth={y + game.depth} />
			</container>
			<container y={y + game.depth - 1920}>
				<BackgroundFragment depth={y + game.depth - 1920} />
			</container>
			<End />
		</>
	);
};

const BackgroundFragment = ({ depth }: { depth: number }) => {
	const game = useGame();
	const startLevel = 1 + Math.floor(depth / game.levelDepth);
	const endLevel = 1 + Math.floor((depth + 1920) / game.levelDepth);

	const ref = useRef(null);

	return (
		<>
			<sprite
				texture={getBg(startLevel)}
				eventMode="static"
				onPointerDown={pointerEventListener(game, "pointerdown")}
				onPointerMove={pointerEventListener(game, "pointermove")}
				onPointerUp={pointerEventListener(game, "pointerup")}
				onPointerUpOutside={pointerEventListener(game, "pointerup")}
			/>
			<sprite texture={T_Gradient} ref={ref} />
			<sprite
				texture={getBg(endLevel)}
				eventMode="static"
				onPointerDown={pointerEventListener(game, "pointerdown")}
				onPointerMove={pointerEventListener(game, "pointermove")}
				onPointerUp={pointerEventListener(game, "pointerup")}
				onPointerUpOutside={pointerEventListener(game, "pointerup")}
				mask={ref.current}
			/>
		</>
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
				<Rectangle
					x={0}
					y={0}
					width={1080}
					height={1920}
					color={0x000000}
					alpha={alpha * 0.6}
					draw={() => {}}
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

const End = () => {
	const game = useGame();
	let frame = getFrame(A_DevilIdle, 25, game.lt);
	if (game.isWinning) {
		const d1 = getDuration(A_DevilLookUp, 15);
		const d2 = getDuration(A_DevilHit, 15);
		const d3 = getDuration(A_DevilWin, 15);
		if (game.lt < d1) {
			frame = getFrame(A_DevilLookUp, 15, game.lt);
		} else if (game.lt < d1 + d2) {
			frame = getFrame(A_DevilHit, 15, game.lt - d1);
		} else if (game.lt < d1 + d2 + d3) {
			frame = getFrame(A_DevilWin, 15, game.lt - d1 - d2);
		} else {
			frame = getFrame(A_DevilWinLoop, 15, game.lt - d1 - d2 - d3);
		}
	}
	return (
		<container>
			<sprite
				texture={T_Bg_Level_09_End}
				anchor={{ x: 0, y: 1 }}
				x={0}
				y={game.levelDepth * game.levels + 1920}
			/>
			<sprite
				texture={T_DevilShadow}
				anchor={{ x: 0.5, y: 1 }}
				x={750}
				y={game.levelDepth * game.levels + 1920 - 440}
			/>
			<sprite
				texture={frame}
				anchor={{ x: 0.5, y: 1 }}
				x={750}
				y={game.levelDepth * game.levels + 1920 - 350}
				scale={1.3}
			/>
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

const Hearts = () => {
	const game = useGame();
	const lives = game.player.lives;
	return (
		<container x={1080 / 2 - 120} y={55}>
			<sprite
				texture={lives >= 2 ? T_Heart_On : T_Heart_Off}
				anchor={0.5}
				x={-heartDeltaX}
			/>
			<sprite
				texture={lives >= 3 ? T_Heart_On : T_Heart_Off}
				anchor={0.5}
				x={0}
			/>
			<sprite
				texture={lives >= 4 ? T_Heart_On : T_Heart_Off}
				anchor={0.5}
				x={heartDeltaX}
			/>
		</container>
	);
};

const arrowDeltaX = 60;

const ArrowIndicators = () => {
	const game = useGame();
	const arrows = game.player.arrows;
	return (
		<container x={1080 / 2 + 120} y={55}>
			<sprite
				texture={arrows >= 1 ? T_Arrow_On : T_Arrow_Off}
				anchor={0.5}
				x={-arrowDeltaX}
			/>
			<sprite
				texture={arrows >= 2 ? T_Arrow_On : T_Arrow_Off}
				anchor={0.5}
				x={0}
			/>
			<sprite
				texture={arrows >= 3 ? T_Arrow_On : T_Arrow_Off}
				anchor={0.5}
				x={arrowDeltaX}
			/>
		</container>
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
			{player.lives > 0 && (
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
			{player.invincibleTimeout > 0 && player.lives > 0 && (
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
			{player.lives == 0 && (
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

const ObstacleC = ({ obstacle }: { obstacle: Obstacle }) => {
	const game = useGame();
	const ref = useRef(null);

	if (obstacle.isDestroyed) {
		return (
			<sprite
				x={obstacle.x}
				y={obstacle.y}
				anchor={{ x: obstacle.anchorX, y: obstacle.anchorY }}
				blendMode="add"
				texture={getFrame(A_HeartExplosion, 15, obstacle.lt, "remove")}
				scale={{
					x: obstacle.scaleX * 1.2,
					y: obstacle.scaleY * 1.2,
				}}
			/>
		);
	}

	const getTexture = (level: number) => {
		if (obstacle.data.texture.type == "texture-by-level") {
			return obstacle.data.texture.textures[level - 1];
		} else {
			return getFrame(
				obstacle.data.texture.textures,
				obstacle.data.texture.fps,
				obstacle.lt,
			);
		}
	};

	const level =
		1 + Math.floor((obstacle.y - (1920 * 1) / 2) / game.levelDepth);
	const nextLevel =
		1 + Math.floor((obstacle.y + (1920 * 3) / 2) / game.levelDepth);

	const isBefore = obstacle.y + 1920 / 2 < level * game.levelDepth;

	const maskBefore =
		level != nextLevel &&
		isBefore &&
		game.depth >= level * game.levelDepth - 1920 * 2;
	const maskAfter =
		level != nextLevel &&
		!isBefore &&
		game.depth <= level * game.levelDepth;

	return (
		<container>
			{!maskBefore && !maskAfter && (
				<sprite
					x={obstacle.x}
					y={obstacle.y}
					scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
					anchor={{ x: obstacle.anchorX, y: obstacle.anchorY }}
					texture={getTexture(isBefore ? level : nextLevel)}
				/>
			)}
			{maskBefore && (
				<>
					<sprite
						x={obstacle.x}
						y={obstacle.y}
						scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
						anchor={{ x: obstacle.anchorX, y: obstacle.anchorY }}
						texture={getTexture(level)}
					/>
					<sprite
						texture={T_Gradient}
						ref={ref}
						x={0}
						y={level * game.levelDepth - 1920}
						alpha={0}
					/>
					<sprite
						x={obstacle.x}
						y={obstacle.y}
						scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
						anchor={{ x: obstacle.anchorX, y: obstacle.anchorY }}
						texture={getTexture(nextLevel)}
						mask={ref.current}
						alpha={ref.current ? 1 : 0}
					/>
				</>
			)}
			{maskAfter && (
				<>
					<sprite
						x={obstacle.x}
						y={obstacle.y}
						scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
						anchor={{ x: obstacle.anchorX, y: obstacle.anchorY }}
						texture={getTexture(nextLevel)}
					/>
					<sprite
						texture={T_Gradient}
						ref={ref}
						x={0}
						y={level * game.levelDepth}
						alpha={0}
						scale={{ x: 1, y: -1 }}
					/>
					<sprite
						x={obstacle.x}
						y={obstacle.y}
						scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
						anchor={{ x: obstacle.anchorX, y: obstacle.anchorY }}
						texture={getTexture(level)}
						mask={ref.current}
						alpha={ref.current ? 1 : 0}
					/>
				</>
			)}
			<PolygonShape
				x={obstacle.x - getTexture(nextLevel).width * obstacle.anchorX}
				y={obstacle.y - getTexture(nextLevel).height * obstacle.anchorY}
				scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
				alpha={0}
				polygon={obstacle.polygon()}
			/>
		</container>
	);
};

const PolygonEditor = () => {
	const game = useGame();
	useOnKeyDown("Enter", async () => {
		await game.polygonEditor.save();
	});
	useOnKeyDown("ArrowRight", () => {
		game.polygonEditor.switch(1);
	});
	useOnKeyDown("ArrowLeft", () => {
		game.polygonEditor.switch(-1);
	});

	return (
		<container>
			<sprite
				texture={getBg(1)}
				eventMode="static"
				onPointerDown={(e: FederatedPointerEvent) => {
					const { x, y } = e.global;
					game.polygonEditor.click({ x: x - 300, y });
				}}
			/>
			<container x={300} y={0}>
				<sprite texture={firstTexture(game.polygonEditor.obstacle)} />
				<PolygonShape
					alpha={0.4}
					polygon={game.polygonEditor.obstacle.polygon}
				/>
			</container>
		</container>
	);
};
