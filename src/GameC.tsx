import type { Game } from "./game";
import {
	A_DemonExplosion,
	S_Click,
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
	T_Cupid,
	T_CupidArrow_Blurred,
	T_Devil,
	T_Heart_Off,
	T_Heart_On,
	T_PauseBtn,
} from "./assets";
import { Rectangle } from "./Rectangle";
import {
	// GameOverScreen,
	StartScreen,
	PauseScreen,
	// WinScreen,
} from "./Postings";
import { Polygon, type FederatedPointerEvent } from "pixi.js";
import { mod } from "./utils";
import type { Obstacle } from "./obstacle";
import type { Arrow, Player } from "./player";
import { CustomText } from "./CustomText";
import { PolygonShape } from "./Polygon";
import { useOnKeyDown } from "./useOnKeyDown";
import { useRef } from "react";
import { useOnKeyDownUp } from "./useOnKeyDownUp";
import { getFrame } from "./Animation";
// import { Circle } from "./Circle";
// import { crossfadeFilter } from "./crossfade";

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
			<Timer game={game} />
			<PauseButton game={game} />
			{/* {game.state == "gameover" && <GameOverScreen game={game} />} */}
			{/* {game.state == "win" && <WinScreen game={game} />} */}
			{game.isPaused && <PauseScreen game={game} />}
			<Rectangle
				x={0}
				y={0}
				width={1080}
				height={1920}
				color={0x000000}
				alpha={fadeAlpha}
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

// const f = crossfadeFilter(getBg(4), getBg(6));

const Background = ({ game }: { game: Game }) => {
	const y = mod(-game.depth, 1920);

	return (
		<>
			<sprite
				texture={getBg(game.level)}
				x={0}
				y={y + game.depth}
				eventMode="static"
				onPointerDown={pointerEventListener(game, "pointerdown")}
				onPointerMove={pointerEventListener(game, "pointermove")}
				onPointerUp={pointerEventListener(game, "pointerup")}
			/>
			<sprite
				texture={getBg(game.level)}
				// filters={[f]}
				x={0}
				y={y + game.depth - 1920}
				eventMode="static"
				onPointerDown={pointerEventListener(game, "pointerdown")}
				onPointerMove={pointerEventListener(game, "pointermove")}
				onPointerUp={pointerEventListener(game, "pointerup")}
			/>
			<End game={game} />
		</>
	);
};

const End = ({ game }: { game: Game }) => {
	return (
		<container>
			<sprite
				texture={T_Bg_Level_09_End}
				anchor={{ x: 0, y: 1 }}
				x={0}
				y={game.levelDepth * game.levels + 1920}
			/>
			<sprite
				texture={T_Devil}
				anchor={{ x: 0.5, y: 1 }}
				x={750}
				y={game.levelDepth * game.levels + 1920 - 450}
			/>
		</container>
	);
};

const Timer = ({ game }: { game: Game }) => {
	const minutes = Math.floor(game.lt / 60);
	const seconds = Math.floor(game.lt - minutes * 60);
	const text = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

	return (
		<CustomText anchor={{ x: 1, y: 0 }} x={1080 - 20} y={20} text={text} />
	);
};

const heartDeltaX = 65;

const Hearts = ({ player }: { player: Player }) => {
	return (
		<container x={1080 / 2 - 120} y={55}>
			<sprite
				texture={player.lives >= 1 ? T_Heart_On : T_Heart_Off}
				anchor={0.5}
				x={-heartDeltaX}
			/>
			<sprite
				texture={player.lives >= 2 ? T_Heart_On : T_Heart_Off}
				anchor={0.5}
				x={0}
			/>
			<sprite
				texture={player.lives >= 3 ? T_Heart_On : T_Heart_Off}
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
	return (
		<container x={player.posX} y={player.posY}>
			<sprite
				texture={T_Cupid}
				anchor={0.5}
				alpha={player.invincibleTimeout > 0 ? 0.4 : 1}
				scale={{ x: player.lookingLeft ? -1 : 1, y: 1 }}
			/>
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
				texture={
					obstacle.isDestroyed ?
						getFrame(A_DemonExplosion, 15, obstacle.lt, "remove")
					:	obstacle.data.texture
				}
			></sprite>
			<PolygonShape alpha={0} polygon={obstacle.polygon()} />
			{/* <Circle radius={10} color={0xff0000} draw={() => {}} /> */}
		</container>
	);
};

const PauseButton = ({ game }: { game: Game }) => {
	return (
		<container x={1920 - 50} y={50}>
			<Rectangle
				x={-50}
				y={-50}
				width={100}
				height={100}
				alpha={0}
				cursor="pointer"
				eventMode="static"
				onPointerDown={() => {
					void S_Click.play();
					game.pause();
				}}
				draw={() => {}}
			/>
			<sprite texture={T_PauseBtn} anchor={0.5} />
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
