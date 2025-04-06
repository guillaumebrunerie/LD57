import type { Game } from "./game";
import {
	Bg_Level_01,
	PauseBtn,
	Click,
	Bg_Level_09,
	Bg_Level_08,
	Bg_Level_06,
	Bg_Level_05,
	Bg_Level_04,
	Bg_Level_03,
	Bg_Level_02,
	Bg_Level_07,
} from "./assets";
import { Rectangle } from "./Rectangle";
import { GameOverScreen, LogoScreen, PauseScreen, WinScreen } from "./Postings";
import type { FederatedPointerEvent } from "pixi.js";
import { Circle } from "./Circle";
import { mod } from "./utils";
import { useWindowEventListener } from "./useWindowEventListener";
import type { Obstacle } from "./obstacle";
import type { Player } from "./player";
import type { Enemy } from "./enemy";
import { CustomText } from "./CustomText";
import { PolygonShape } from "./Polygon";
import { useOnKeyDown } from "./useOnKeyDown";
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

	if (game.state == "logo") {
		return <LogoScreen game={game} />;
	}

	if (game.state == "polygonEditor") {
		return <PolygonEditor game={game} />;
	}

	return (
		<container>
			<container y={-game.depth}>
				<Background game={game} />
				{game.enemiesManager.enemies.map((enemy) => (
					<EnemyC key={enemy.id} enemy={enemy} />
				))}
				{game.obstaclesManager.obstacles.map((obstacle) => (
					<ObstacleC key={obstacle.id} obstacle={obstacle} />
				))}
				<PlayerC player={game.player} />
			</container>
			<Timer game={game} />
			<PauseButton game={game} />
			{game.state == "gameover" && <GameOverScreen game={game} />}
			{game.state == "win" && <WinScreen game={game} />}
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
			return Bg_Level_01;
		case 2:
			return Bg_Level_02;
		case 3:
			return Bg_Level_03;
		case 4:
			return Bg_Level_04;
		case 5:
			return Bg_Level_05;
		case 6:
			return Bg_Level_06;
		case 7:
			return Bg_Level_07;
		case 8:
			return Bg_Level_08;
		default:
			return Bg_Level_09;
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
		</>
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

const PlayerC = ({ player }: { player: Player }) => {
	return (
		<container x={player.posX} y={player.posY}>
			<Circle
				radius={30}
				color={
					player.game.obstaclesManager.checkCollision(player) ?
						0xff0000
					:	0x0000ff
				}
				draw={() => {}}
			/>
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
			<sprite texture={obstacle.data.texture}></sprite>
			<PolygonShape alpha={0} polygon={obstacle.polygon()} />
		</container>
	);
};

const EnemyC = ({ enemy }: { enemy: Enemy }) => {
	return (
		<container x={1080 / 2 + enemy.x} y={enemy.y}>
			<Rectangle
				x={-enemy.width / 2}
				y={-enemy.height / 2}
				width={enemy.width}
				height={enemy.height}
				color={enemy.color}
				draw={() => {}}
			/>
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
					void Click.play();
					game.pause();
				}}
				draw={() => {}}
			/>
			<sprite texture={PauseBtn} anchor={0.5} />
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
					game.polygonEditor.click({ x: x - 200, y });
				}}
			/>
			<container x={200} y={0}>
				<sprite texture={game.polygonEditor.obstacle.texture} />
				<PolygonShape
					alpha={0.4}
					polygon={game.polygonEditor.obstacle.polygon}
				/>
			</container>
		</container>
	);
};
