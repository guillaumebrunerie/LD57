import { useState } from "react";
import { GameC } from "./GameC";
import { PatternEditorC } from "./PatternEditorC";
import { SoundButton } from "./SoundButton";
import { useOnKeyDownDEV } from "./useOnKeyDown";
import { PolygonEditorC } from "./PolygonEditorC";

export const AppC = () => {
	const [state, setState] = useState("game");
	useOnKeyDownDEV("S-KeyQ", () => setState("game"));
	useOnKeyDownDEV("S-KeyW", () => setState("polygonEditor"));
	useOnKeyDownDEV("S-KeyE", () => setState("patternEditor"));

	return (
		<>
			{state == "game" && <GameC />}
			{state == "polygonEditor" && <PolygonEditorC />}
			{state == "patternEditor" && <PatternEditorC />}
			<SoundButton />
		</>
	);
};
