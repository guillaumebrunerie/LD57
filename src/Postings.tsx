import {
	T_BgMenu,
	T_Cloud_01,
	T_Cloud_02,
	T_Cloud_03,
	T_Logo,
	T_Cupid,
	T_GroundMask,
	A_CloudStartButton,
	S_StartButton,
} from "./assets";
import { CustomText } from "./CustomText";
import { Game, useGame } from "./game";
import { Rectangle } from "./Rectangle";
import { getFrame } from "./Animation";
import { smoothTriangle } from "./utils";
import { useOnKeyDown } from "./useOnKeyDown";

const textColor = "#DDD";

const waveAround = (v: number, t: number, range = 100, speed = 0.2) =>
	v + Math.sin(t * speed) * range;

export const StartScreen = ({ game }: { game: Game }) => {
	const fallLt = Math.max(game.lt - 0.25, 0);
	const cupidY = fallLt * fallLt * 2000 + 1350;
	const cameraDt = Math.min(fallLt / 1, 1);
	const cameraY = -smoothTriangle(cameraDt) * 1920;
	const fadeAlpha = Math.max(0, Math.min(1, (game.lt - 1.3) / 0.5));
	useOnKeyDown("Space", () => game.clickStart());
	return (
		<container y={cameraY}>
			<sprite
				texture={T_BgMenu}
				cursor="pointer"
				eventMode="static"
				onPointerDown={() => {
					game.clickStart();
				}}
			/>
			<sprite
				texture={T_Cloud_01}
				anchor={0.5}
				x={waveAround(300, game.cloudLt)}
				y={250}
			/>
			<sprite
				texture={T_Cloud_02}
				anchor={0.5}
				x={waveAround(850, game.cloudLt + 150)}
				y={900}
			/>
			<sprite
				texture={T_Cloud_03}
				anchor={0.5}
				x={waveAround(300, game.cloudLt + 300)}
				y={1100}
			/>
			<sprite
				texture={T_Cloud_03}
				anchor={0.5}
				x={waveAround(350, game.cloudLt)}
				y={2150}
			/>
			<sprite
				texture={T_Cloud_01}
				anchor={0.5}
				x={waveAround(800, game.cloudLt + 150)}
				y={2800}
			/>
			<sprite
				texture={T_Cloud_02}
				anchor={0.5}
				x={waveAround(350, game.cloudLt + 300)}
				y={3300}
			/>
			<sprite texture={T_Logo} anchor={0.5} x={580} y={650} />
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

export const GameOverScreen = () => {
	const game = useGame();
	return (
		<container>
			<Rectangle
				x={0}
				y={0}
				width={1080}
				height={1920}
				draw={() => {}}
				alpha={0.3}
				color={0x000000}
				cursor="pointer"
				eventMode="static"
				onPointerDown={() => {
					void S_StartButton.play({ volume: 0.3 });
					game.restart();
				}}
			/>
			<CustomText
				x={1080 / 2}
				y={1700}
				anchor={0.5}
				text="Click to restart"
				style={{
					fontFamily: "Heroes Legend",
					fill: textColor,
					dropShadow: {
						angle: 90,
						distance: 6,
					},
				}}
			/>
		</container>
	);
};
