import { Sound, sound } from "@pixi/sound";
import { useForceUpdate } from "./utils";

export const initSound = () => {
	sound.init();
};

export const closeSound = () => {
	sound.stopAll();
	sound.removeAll();
	sound.close();
};

export const useSetVolumeAll = () => {
	const forceUpdate = useForceUpdate();
	return [
		sound.volumeAll,
		(setter: (volume: number) => number) => {
			const newVolume = setter(sound.volumeAll);
			sound.volumeAll = newVolume;
			forceUpdate();
		},
	] as const;
};

export const fadeVolume = (
	name: string,
	sound: Sound,
	to: number,
	duration: number,
) => {
	const from = sound.volume;
	const steps = 10;
	let step = 0;
	const interval = setInterval(() => {
		if (step > steps) {
			clearInterval(interval);
		}
		sound.volume = from + ((to - from) * step) / steps;
		step++;
	}, duration / steps);
};
