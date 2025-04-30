import { useRef } from "react";
import {
	A_DevilHit,
	A_DevilIdle,
	A_DevilLookUp,
	A_DevilWin,
	A_DevilWinLoop,
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
	T_DevilShadow,
	T_Gradient,
} from "./assets";
import { Game, useGame } from "./game";
import { mod } from "./utils";
import type { FederatedPointerEvent } from "pixi.js";
import { getDuration, getFrame } from "./Animation";
import { totalDuration } from "./levelData";

export const getBg = (level: number) => {
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

export const Background = () => {
	const game = useGame();
	const y = mod(-game.depth, 1920);
	const level1 = game.level;
	const level2 =
		game.nextLevelDepth - game.depth > 1920 ? game.level : game.level + 1;
	const level3 =
		game.nextLevelDepth - game.depth > 1920 * 2 ?
			game.level
		:	game.level + 1;
	return (
		<>
			<container y={y + game.depth - 1920}>
				<BackgroundFragment levelFrom={level1} levelTo={level2} />
			</container>
			<container y={y + game.depth}>
				<BackgroundFragment levelFrom={level2} levelTo={level3} />
			</container>
			<End />
		</>
	);
};

const pointerEventListener =
	(game: Game, type: "pointerdown" | "pointermove" | "pointerup") =>
	(e: FederatedPointerEvent) => {
		const { x, y } = e.global;
		game.onEvent(type, { x, y });
	};

const BackgroundFragment = ({
	levelFrom,
	levelTo,
}: {
	levelFrom: number;
	levelTo: number;
}) => {
	const game = useGame();
	const ref = useRef(null);
	game.depth; // TODO: remove, but currently needed (bug?)

	return (
		<>
			<sprite
				texture={getBg(levelFrom)}
				eventMode="static"
				onPointerDown={pointerEventListener(game, "pointerdown")}
				onPointerMove={pointerEventListener(game, "pointermove")}
				onPointerUp={pointerEventListener(game, "pointerup")}
				onPointerUpOutside={pointerEventListener(game, "pointerup")}
			/>
			<sprite texture={T_Gradient} ref={ref} />
			<sprite
				texture={getBg(levelTo)}
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
				y={totalDuration + 1920}
			/>
			<sprite
				texture={T_DevilShadow}
				anchor={{ x: 0.5, y: 1 }}
				x={750}
				y={totalDuration + 1920 - 440}
			/>
			<sprite
				texture={frame}
				anchor={{ x: 0.5, y: 1 }}
				x={750}
				y={totalDuration + 1920 - 350}
				scale={1.3}
			/>
		</container>
	);
};
