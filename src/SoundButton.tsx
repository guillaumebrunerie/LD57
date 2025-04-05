import type { ComponentProps } from "react";
import { useSetVolumeAll } from "./sound";
import { CustomText } from "./CustomText";

export const SoundButton = (_: ComponentProps<"sprite">) => {
	const [volumeAll, setVolumeAll] = useSetVolumeAll();
	const toggleSound = () => {
		setVolumeAll((volume) => 1 - volume);
	};

	return (
		<CustomText
			text={volumeAll == 1 ? "Sound on" : "Sound off"}
			cursor="pointer"
			eventMode="static"
			onPointerDown={toggleSound}
			x={15}
			y={15}
			style={{
				fontSize: 25,
				fontFamily: "Heroes Legend",
				fill: volumeAll == 1 ? "#DDD" : "#448",
				dropShadow: {
					angle: 90,
					distance: 3,
				},
			}}
		/>
	);
};
