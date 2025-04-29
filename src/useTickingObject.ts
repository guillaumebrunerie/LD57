import { action } from "mobx";
import { Ticker } from "pixi.js";
import { useEffect, useState } from "react";
import { useWindowEventListener } from "./useWindowEventListener";

export const useTickingObject = <
	T extends {
		tick(delta: number): void;
	},
>(
	Obj: new (data?: T) => T,
	name?: string,
): T => {
	const [obj, setObj] = useState(new Obj());
	useEffect(() => {
		const newObj = new Obj(obj);
		if (name) {
			// @ts-ignore
			window[name] = newObj;
		}
		setObj(newObj);
	}, []);

	useEffect(() => {
		// Initialize sound and ticker
		const tick = action((ticker: Ticker) => {
			const delta = (ticker.deltaTime / 60) * speed;
			obj?.tick?.(delta);
		});
		Ticker.shared.add(tick);
		return () => {
			Ticker.shared.remove(tick);
		};
	});

	const [speed, setSpeed] = useState(1);
	useWindowEventListener("keydown", (event) => {
		if (!import.meta.env.DEV || !event.shiftKey) {
			return;
		}
		switch (event.code) {
			case "ArrowUp":
				setSpeed((speed) => speed * 2);
				break;
			case "ArrowDown":
				setSpeed((speed) => (speed == 0 ? 1 / 64 : speed / 2));
				break;
			case "ArrowLeft":
				setSpeed(0);
				break;
			case "ArrowRight":
				setSpeed(1);
				break;
		}
	});

	return obj;
};
