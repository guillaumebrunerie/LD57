import { Texture } from "pixi.js";

export const getDuration = (animation: Texture[], fps: number) =>
	animation.length / fps;

export const getFrame = (
	animation: Texture[],
	fps: number,
	t: number,
	time: "hold" | "loop" | "remove" = "loop",
) => {
	switch (time) {
		case "loop":
			return animation[Math.floor(t * fps) % animation.length];
		case "hold":
			return animation[
				Math.min(Math.floor(t * fps), animation.length - 1)
			];
		case "remove": {
			const i = Math.floor(t * fps);
			if (i >= animation.length) {
				return Texture.EMPTY;
			} else {
				return animation[i];
			}
		}
	}
};

export const getNtFrame = (animation: Texture[], nt: number) => {
	if (!animation) {
		throw new Error("no animation");
	}
	const i = Math.min(
		Math.max(Math.floor(nt * animation.length), 0),
		animation.length - 1,
	);
	return animation[i];
};
