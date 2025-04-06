import type { Game } from "./game";
import { Bg, PauseBtn, Click } from "./assets";
import { Rectangle } from "./Rectangle";
import { GameOverScreen, LogoScreen, PauseScreen, WinScreen } from "./Postings";
import type { FederatedPointerEvent } from "pixi.js";
import { Circle } from "./Circle";
import { mod } from "./utils";
import { useWindowEventListener } from "./useWindowEventListener";
import type { Obstacle } from "./obstacle";

export const GameC = ({ game }: { game: Game }) => {
	useWindowEventListener("keydown", (event) => {
		switch (event.code) {
			case "ArrowLeft":
				game.moveLeft(true);
				break;
			case "ArrowRight":
				game.moveRight(true);
				break;
		}
	});
	useWindowEventListener("keyup", (event) => {
		switch (event.code) {
			case "ArrowLeft":
				game.moveLeft(false);
				break;
			case "ArrowRight":
				game.moveRight(false);
				break;
		}
	});

	if (game.state == "logo") {
		return <LogoScreen game={game} />;
	}

	return (
		<container>
			<Background game={game} />
			<Player game={game} />
			{game.obstacles.map((obstacle, i) => (
				<ObstacleC key={i} game={game} obstacle={obstacle} />
			))}
			<PauseButton game={game} />
			{game.state == "gameover" && <GameOverScreen game={game} />}
			{game.state == "win" && <WinScreen game={game} />}
			{game.isPaused && <PauseScreen game={game} />}
		</container>
	);
};

const Background = ({ game }: { game: Game }) => {
	const y = mod(-game.depth, 1920);

	return (
		<>
			<sprite
				texture={Bg}
				angle={90}
				x={1080}
				y={y}
				eventMode="static"
				onPointerDown={(e: FederatedPointerEvent) => {
					const { x, y } = e.global;
					game.tap({ x, y });
				}}
			/>
			<sprite
				texture={Bg}
				angle={90}
				x={1080}
				y={y - 1920}
				eventMode="static"
				onPointerDown={(e: FederatedPointerEvent) => {
					const { x, y } = e.global;
					game.tap({ x, y });
				}}
			/>
		</>
	);
};

const Player = ({ game }: { game: Game }) => {
	return (
		<container x={1080 / 2 + game.posX} y={game.posY - game.depth}>
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
