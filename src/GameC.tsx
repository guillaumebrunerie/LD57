import type { Game } from "./game";
import {
	S_Click,
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
	T_Devil,
	T_EnemyFlying_Level1_01,
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
import { useWindowEventListener } from "./useWindowEventListener";
import type { Obstacle } from "./obstacle";
import type { Player } from "./player";
import type { Enemy } from "./enemy";
import { CustomText } from "./CustomText";
import { PolygonShape } from "./Polygon";
import { useOnKeyDown } from "./useOnKeyDown";
import { useRef } from "react";
// import { crossfadeFilter } from "./crossfade";

export const GameC = ({ game }: { game: Game }) => {
	useWindowEventListener("keydown", (event) => {
		switch (event.code) {
			case "ArrowLeft":
				game.player.moveLeft(true);
				break;
			case "ArrowRight":
				game.player.moveRight(true);
				break;
		}
	});
	useWindowEventListener("keyup", (event) => {
		switch (event.code) {
			case "ArrowLeft":
				game.player.moveLeft(false);
				break;
			case "ArrowRight":
				game.player.moveRight(false);
				break;
		}
	});

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
				{game.enemiesManager.enemies.map((enemy) => (
					<EnemyC key={enemy.id} enemy={enemy} />
				))}
				<PlayerC player={game.player} />
			</container>
			<Hearts player={game.player} />
			<Timer game={game} />
			<PauseButton game={game} />
			{/* {game.state == "gameover" && <GameOverScreen game={game} />} */}
			{/* {game.state == "win" && <WinScreen game={game} />} */}
			{game.isPaused && <PauseScreen game={game} />}
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

const heartDeltaX = 80;

const Hearts = ({ player }: { player: Player }) => {
	return (
		<container x={1080 / 2} y={55}>
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

const ObstacleC = ({ obstacle }: { obstacle: Obstacle }) => {
	return (
		<container
			pivot={{ x: obstacle.pivotX, y: obstacle.pivotY }}
			x={obstacle.x}
			y={obstacle.y}
			scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
		>
			<sprite texture={obstacle.data.texture}></sprite>
			<PolygonShape alpha={0} polygon={obstacle.polygon()} />
		</container>
	);
};

const EnemyC = ({ enemy }: { enemy: Enemy }) => {
	return (
		<container x={enemy.x} y={enemy.y} scale={{ x: enemy.scaleX, y: 1 }}>
			<sprite anchor={0.5} texture={T_EnemyFlying_Level1_01} />
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
