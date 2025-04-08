import type { Game } from "./game";
import {
	A_CupidDie,
	A_CupidIdle,
	A_CupidShot,
	A_DevilHit,
	A_DevilIdle,
	A_DevilLookUp,
	A_DevilWin,
	A_DevilWinLoop,
	A_HeartExplosion,
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
	T_Gradient,
	T_Heart_Off,
	T_Heart_On,
} from "./assets";
import { Rectangle } from "./Rectangle";
import { StartScreen, GameOverScreen } from "./Postings";
import { Polygon, type FederatedPointerEvent } from "pixi.js";
import { mod, smoothTriangle } from "./utils";
import type { Obstacle } from "./obstacle";
import type { Arrow, Player } from "./player";
import { CustomText } from "./CustomText";
import { PolygonShape } from "./Polygon";
import { useOnKeyDown } from "./useOnKeyDown";
import { useRef } from "react";
import { useOnKeyDownUp } from "./useOnKeyDownUp";
import { getDuration, getFrame } from "./Animation";

export const GameC = ({ game }: { game: Game }) => {
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
		return <StartScreen game={game} />;
	}

	if (game.state == "polygonEditor") {
		return <PolygonEditor game={game} />;
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
			<container y={-game.depth}>
				<Background game={game} />
				{mask && <PolygonShape polygon={mask} myRef={ref} />}
				<container mask={mask ? ref.current : undefined}>
					{game.obstaclesManager.obstacles.map((obstacle) => (
						<ObstacleC key={obstacle.id} obstacle={obstacle} />
					))}
				</container>
				<PlayerC player={game.player} />
				{game.player.arrow && <ArrowC arrow={game.player.arrow} />}
			</container>
			<Hearts player={game.player} />
			<ArrowIndicators player={game.player} />
			<Score game={game} />
			{game.player.lives == 0 && <GameOverScreen game={game} />}
			{/* {game.state == "gameover" && <GameOverScreen game={game} />} */}
			{/* {game.state == "win" && <WinScreen game={game} />} */}
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

const Background = ({ game }: { game: Game }) => {
	const y = mod(-game.depth, 1920);
	return (
		<>
			<container y={y + game.depth}>
				<BackgroundFragment game={game} depth={y + game.depth} />
			</container>
			<container y={y + game.depth - 1920}>
				<BackgroundFragment game={game} depth={y + game.depth - 1920} />
			</container>
			<End game={game} />
		</>
	);
};

const BackgroundFragment = ({ game, depth }: { game: Game; depth: number }) => {
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
			/>
			<sprite texture={T_Gradient} ref={ref} />
			<sprite
				texture={getBg(endLevel)}
				eventMode="static"
				onPointerDown={pointerEventListener(game, "pointerdown")}
				onPointerMove={pointerEventListener(game, "pointermove")}
				onPointerUp={pointerEventListener(game, "pointerup")}
				mask={ref.current}
			/>
		</>
	);
};

const End = ({ game }: { game: Game }) => {
	let frame = getFrame(A_DevilIdle, 25, game.lt);
	let explosionLt = game.lt - 0.2;
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
				texture={frame}
				anchor={{ x: 0.5, y: 1 }}
				x={750}
				y={game.levelDepth * game.levels + 1920 - 350}
				scale={1.3}
			/>
			{explosionLt > 0 && (
				<sprite
					x={750}
					y={game.levelDepth * game.levels + 1920 - 700}
					anchor={{ x: 0.5, y: 0.5 }}
					blendMode="add"
					texture={getFrame(
						A_HeartExplosion,
						15,
						explosionLt,
						"remove",
					)}
					scale={1.2}
				/>
			)}
		</container>
	);
};

const Score = ({ game }: { game: Game }) => {
	const minutes = Math.floor(game.score / 60);
	const seconds = Math.floor(game.score - minutes * 60);

	return (
		<container x={1080 - 95} y={20}>
			<CustomText
				anchor={{ x: 1, y: 0 }}
				x={-10}
				text={String(minutes).padStart(2, "0")}
			/>
			<CustomText anchor={{ x: 0.5, y: 0 }} text={":"} />
			<CustomText
				anchor={{ x: 0, y: 0 }}
				x={10}
				text={String(seconds).padStart(2, "0")}
			/>
		</container>
	);
};

const heartDeltaX = 65;

const Hearts = ({ player }: { player: Player }) => {
	return (
		<container x={1080 / 2 - 120} y={55}>
			<sprite
				texture={player.lives >= 2 ? T_Heart_On : T_Heart_Off}
				anchor={0.5}
				x={-heartDeltaX}
			/>
			<sprite
				texture={player.lives >= 3 ? T_Heart_On : T_Heart_Off}
				anchor={0.5}
				x={0}
			/>
			<sprite
				texture={player.lives >= 4 ? T_Heart_On : T_Heart_Off}
				anchor={0.5}
				x={heartDeltaX}
			/>
		</container>
	);
};

const arrowDeltaX = 60;

const ArrowIndicators = ({ player }: { player: Player }) => {
	return (
		<container x={1080 / 2 + 120} y={55}>
			<sprite
				texture={player.arrows >= 1 ? T_Arrow_On : T_Arrow_Off}
				anchor={0.5}
				x={-arrowDeltaX}
			/>
			<sprite
				texture={player.arrows >= 2 ? T_Arrow_On : T_Arrow_Off}
				anchor={0.5}
				x={0}
			/>
			<sprite
				texture={player.arrows >= 3 ? T_Arrow_On : T_Arrow_Off}
				anchor={0.5}
				x={arrowDeltaX}
			/>
		</container>
	);
};

const PlayerC = ({ player }: { player: Player }) => {
	const initialDuration = 0.3;
	const dy =
		600 *
			smoothTriangle(
				Math.min(1 + 2 * (player.game.lt - initialDuration), 1),
			) -
		600;
	return (
		<container
			x={player.posX}
			y={player.posY + (player.game.isWinning ? 0 : dy)}
		>
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
			{/* <Circle x={-40} y={-40} radius={10} /> */}
			{/* <Circle x={-40} y={40} radius={10} /> */}
			{/* <Circle x={40} y={-40} radius={10} /> */}
			{/* <Circle x={40} y={40} radius={10} /> */}
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
	return (
		<container
			x={obstacle.x}
			y={obstacle.y}
			scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
		>
			<sprite
				anchor={{ x: obstacle.anchorX, y: obstacle.anchorY }}
				blendMode={obstacle.isDestroyed ? "add" : "normal"}
				texture={
					obstacle.isDestroyed ?
						getFrame(A_HeartExplosion, 15, obstacle.lt, "remove")
					:	obstacle.data.texture
				}
				scale={obstacle.isDestroyed ? 1.2 : 1}
			></sprite>
			<PolygonShape alpha={0} polygon={obstacle.polygon()} />
			{/* <Circle radius={10} color={0xff0000} draw={() => {}} /> */}
		</container>
	);
};

const PolygonEditor = ({ game }: { game: Game }) => {
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
				<sprite texture={game.polygonEditor.obstacle.texture} />
				<PolygonShape
					alpha={0.4}
					polygon={game.polygonEditor.obstacle.polygon}
				/>
			</container>
		</container>
	);
};
