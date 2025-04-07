import { BackdropBlurFilter } from "pixi-filters";
import {
	T_BtnCompleteTxt,
	T_BtnGamePausedTxt,
	T_BtnGameTxt,
	T_BtnLevelTxt,
	T_BtnOverTxt,
	S_Click,
	T_BgMenu,
	T_CloudStart_Btn,
	T_Cloud_01,
	T_Cloud_02,
	T_Cloud_03,
	T_StartTxt,
	T_Logo,
	T_Cupid,
	T_GroundMask,
	A_CloudStartButton,
} from "./assets";
import { CustomText } from "./CustomText";
import type { Game } from "./game";
import { Rectangle } from "./Rectangle";
import { getFrame } from "./Animation";

const buttonsY = 850;

const buttonsXLeft = 1920 / 3;
const buttonsXRight = (1920 * 2) / 3;

const backdropFilter = new BackdropBlurFilter();
const textColor = "#DDD";

export const StartScreen = ({ game }: { game: Game }) => {
	const cloudAlpha = Math.max(1 - game.lt / 0.5, 0);
	const cupidY = game.lt * game.lt * 2000 + 1350;
	const cameraDt = Math.min(game.lt / 1, 1);
	const cameraY = -(1 - Math.pow(1 - cameraDt, 1.5)) * 1920;
	const fadeAlpha = Math.max(0, Math.min(1, (game.lt - 1) / 0.5));
	return (
		<container y={cameraY}>
			<sprite
				texture={T_BgMenu}
				cursor="pointer"
				eventMode="static"
				onPointerDown={() => {
					void S_Click.play();
					game.clickStart();
				}}
			/>
			<sprite texture={T_Cloud_01} anchor={0.5} x={300} y={250} />
			<sprite texture={T_Cloud_02} anchor={0.5} x={900} y={900} />
			<sprite texture={T_Cloud_03} anchor={0.5} x={200} y={1100} />
			<sprite texture={T_Cloud_03} anchor={0.5} x={300} y={2150} />
			<sprite texture={T_Cloud_01} anchor={0.5} x={900} y={2800} />
			<sprite texture={T_Cloud_02} anchor={0.5} x={200} y={3300} />
			<sprite texture={T_Logo} anchor={0.5} x={1080 / 2} y={650} />
			<sprite texture={T_Cupid} anchor={0.5} x={1080 / 2} y={cupidY} />
			<sprite texture={T_GroundMask} />
			<sprite
				texture={getFrame(A_CloudStartButton, 15, game.lt, "remove")}
				anchor={0.5}
				x={1080 / 2}
				y={1500}
			/>
			<Rectangle
				x={0}
				y={-cameraY}
				width={1080}
				height={1920}
				color={0x000000}
				alpha={fadeAlpha}
				draw={() => {}}
			/>
		</container>
	);
};

export const PauseScreen = ({ game }: { game: Game }) => {
	return (
		<container>
			<Rectangle
				x={0}
				y={0}
				width={1920}
				height={1080}
				draw={() => {}}
				alpha={0.01}
				color={0}
				filters={backdropFilter}
				cursor="pointer"
				eventMode="static"
				onPointerDown={() => {
					void S_Click.play();
					game.resume();
				}}
			/>
			<sprite
				texture={T_BtnGamePausedTxt}
				anchor={0.5}
				x={1920 / 2}
				y={450}
				scale={1.5}
			/>
			<RestartButton />
			<MainMenuButton game={game} />
			<CustomText
				x={1920 / 2}
				y={980}
				anchor={0.5}
				text="(click anywhere to resume)"
				style={{
					fontSize: 20,
					fontFamily: "Heroes Legend",
					fill: textColor,
					dropShadow: {
						angle: 90,
						distance: 3,
					},
				}}
			/>
		</container>
	);
};

export const LevelSelectPauseScreen = ({ game }: { game: Game }) => {
	return (
		<container>
			<Rectangle
				x={0}
				y={0}
				width={1920}
				height={1080}
				draw={() => {}}
				alpha={0.01}
				color={0}
				filters={backdropFilter}
				cursor="pointer"
				eventMode="static"
				onPointerDown={() => {
					void S_Click.play();
					game.resume();
				}}
			/>
			<sprite
				texture={T_BtnGamePausedTxt}
				anchor={0.5}
				x={1920 / 2}
				y={450}
				scale={1.5}
			/>
			<MainMenuButton game={game} />
			<WipeSaveButton game={game} />
			<CustomText
				x={1920 / 2}
				y={980}
				anchor={0.5}
				text="(click anywhere to resume)"
				style={{
					fontSize: 20,
					fontFamily: "Heroes Legend",
					fill: textColor,
					dropShadow: {
						angle: 90,
						distance: 3,
					},
				}}
			/>
		</container>
	);
};

const RestartButton = () => {
	return (
		<CustomText
			x={buttonsXRight}
			y={buttonsY}
			anchor={0.5}
			text="Restart"
			cursor="pointer"
			eventMode="static"
			style={{
				fontFamily: "Heroes Legend",
				fill: textColor,
				dropShadow: {
					angle: 90,
					distance: 6,
				},
			}}
			onPointerDown={() => {
				void S_Click.play();
				// game.restart();
			}}
		/>
	);
};

const MainMenuButton = ({ game }: { game: Game }) => {
	return (
		<CustomText
			x={buttonsXLeft}
			y={buttonsY}
			anchor={0.5}
			text="Main menu"
			style={{
				fontFamily: "Heroes Legend",
				fill: textColor,
				dropShadow: {
					angle: 90,
					distance: 6,
				},
			}}
			cursor="pointer"
			eventMode="static"
			onPointerDown={() => {
				void S_Click.play();
				game.backToMainMenu();
			}}
		/>
	);
};

const MainMenuButton2 = ({ game }: { game: Game }) => {
	return (
		<CustomText
			x={buttonsXLeft}
			y={buttonsY}
			anchor={0.5}
			text="Main menu"
			style={{
				fontFamily: "Heroes Legend",
				fill: textColor,
				dropShadow: {
					angle: 90,
					distance: 6,
				},
			}}
			cursor="pointer"
			eventMode="static"
			onPointerDown={() => {
				void S_Click.play();
				game.backToMainMenu();
			}}
		/>
	);
};

const WipeSaveButton = ({ game }: { game: Game }) => {
	return (
		<CustomText
			x={buttonsXRight}
			y={buttonsY}
			anchor={0.5}
			text="Wipe save (!)"
			style={{
				fontFamily: "Heroes Legend",
				fill: "#D44",
				dropShadow: {
					angle: 90,
					distance: 6,
				},
			}}
			cursor="pointer"
			eventMode="static"
			onPointerDown={() => {
				void S_Click.play();
				// game.resetLastUnlockedLevel();
				game.resume();
			}}
		/>
	);
};

export const GameOverScreen = ({ game }: { game: Game }) => {
	return (
		<container>
			<Rectangle
				x={0}
				y={0}
				width={1920}
				height={1080}
				draw={() => {}}
				filters={backdropFilter}
				alpha={0.3}
				color={0}
				eventMode="static"
			/>
			<container x={1920 / 2} y={450}>
				<sprite texture={T_BtnGameTxt} anchor={0.5} />
				<sprite texture={T_BtnOverTxt} anchor={0.5} />
			</container>
			<container y={70}>
				<RestartButton />
				<MainMenuButton game={game} />
			</container>
		</container>
	);
};

export const WinScreen = ({ game }: { game: Game }) => {
	const nt = Math.min(game.startLt / 0.5, 1);
	if (nt < 1) {
		return null;
	}
	return (
		<container alpha={nt * nt}>
			<Rectangle
				x={0}
				y={0}
				width={1920}
				height={1080}
				draw={() => {}}
				alpha={0.3}
				color={0}
				eventMode="static"
			/>
			<container x={1920 / 2} y={400}>
				<sprite texture={T_BtnLevelTxt} anchor={0.5} />
				<sprite texture={T_BtnCompleteTxt} anchor={0.5} />
			</container>
			<MainMenuButton2 game={game} />
		</container>
	);
};
