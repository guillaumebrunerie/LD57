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

	return (
		<container>
			<Background game={game} />
			{game.obstacleManager.obstacles.map((obstacle) => (
				<ObstacleC key={obstacle.id} game={game} obstacle={obstacle} />
			))}
			{game.enemyManager.enemies.map((enemy) => (
				<EnemyC key={enemy.id} game={game} enemy={enemy} />
			))}
			<PlayerC player={game.player} />
			<Foreground game={game} />
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
				y={y}
				eventMode="static"
				onPointerDown={pointerEventListener(game, "pointerdown")}
				onPointerMove={pointerEventListener(game, "pointermove")}
				onPointerUp={pointerEventListener(game, "pointerup")}
			/>
			<sprite
				texture={getBg(game.level)}
				// filters={[f]}
				x={0}
				y={y - 1920}
				eventMode="static"
				onPointerDown={pointerEventListener(game, "pointerdown")}
				onPointerMove={pointerEventListener(game, "pointermove")}
				onPointerUp={pointerEventListener(game, "pointerup")}
			/>
		</>
	);
};

const Foreground = ({ game }: { game: Game }) => {
	return (
		<>
			<Rectangle
				x={0}
				y={0}
				width={1080 / 2 - game.boundX}
				height={1920}
				color={0x444444}
				draw={() => {}}
			/>
			<Rectangle
				x={1080 / 2 + game.boundX}
				y={0}
				width={1080 / 2 - game.boundX}
				height={1920}
				color={0x444444}
				draw={() => {}}
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
		<container
			x={1080 / 2 + player.posX}
			y={player.posY - player.game.depth}
		>
			<Circle radius={30} draw={() => {}} />
		</container>
	);
};

const ObstacleC = ({ game, obstacle }: { game: Game; obstacle: Obstacle }) => {
	return (
		<container x={1080 / 2 + obstacle.x} y={obstacle.y - game.depth}>
			<Rectangle
				x={-obstacle.width / 2}
				y={-obstacle.height / 2}
				width={obstacle.width}
				height={obstacle.height}
				color={obstacle.color}
				draw={() => {}}
			/>
		</container>
	);
};

const EnemyC = ({ game, enemy }: { game: Game; enemy: Enemy }) => {
	return (
		<container x={1080 / 2 + enemy.x} y={enemy.y - game.depth}>
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
