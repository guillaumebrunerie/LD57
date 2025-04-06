import type { Game } from "./game";
import { Bg, PauseBtn, Click } from "./assets";
import { Rectangle } from "./Rectangle";
import { GameOverScreen, LogoScreen, PauseScreen, WinScreen } from "./Postings";
import type { FederatedPointerEvent } from "pixi.js";
import { Circle } from "./Circle";
import { mod } from "./utils";
import { useWindowEventListener } from "./useWindowEventListener";
import type { Obstacle } from "./obstacle";
import type { Player } from "./player";

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
			<PlayerC player={game.player} />
			{game.obstacles.map((obstacle) => (
				<ObstacleC key={obstacle.id} game={game} obstacle={obstacle} />
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
