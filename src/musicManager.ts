import {
	S_MusicIntensity1,
	S_MusicIntensity2,
	S_MusicIntensity3,
} from "./assets";
import { fadeVolume } from "./sound";

export const startMusic = () => {
	S_MusicIntensity1.singleInstance = true;
	S_MusicIntensity2.singleInstance = true;
	S_MusicIntensity3.singleInstance = true;
	void S_MusicIntensity1.play({ loop: true, volume: 0.1 });
	void S_MusicIntensity2.play({ loop: true, volume: 0.1 });
	void S_MusicIntensity3.play({ loop: true, volume: 0.1 });
	S_MusicIntensity1.volume = 0.1;
	S_MusicIntensity2.volume = 0.1;
	S_MusicIntensity3.volume = 0.1;
};

export const setMusic = (level: number) => {
	S_MusicIntensity1.singleInstance = true;
	S_MusicIntensity2.singleInstance = true;
	S_MusicIntensity3.singleInstance = true;

	const musicVolumes = [
		[0, 0, 0],
		[2, 0, 0],
		[1.3, 0.7, 0],
		[0.7, 1.3, 0],
		[0, 2, 0],
		[0, 1.6, 0.4],
		[0, 1.2, 0.8],
		[0, 0.8, 1.2],
		[0, 0.4, 1.6],
		[0, 0, 2],
		[0, 0, 0],
	];

	const minVolume = 0.1;

	fadeVolume(S_MusicIntensity1, musicVolumes[level][0] + minVolume, 1000);
	fadeVolume(S_MusicIntensity2, musicVolumes[level][1] + minVolume, 1000);
	fadeVolume(S_MusicIntensity3, musicVolumes[level][2] + minVolume, 1000);
};
