import { useWindowEventListener } from "./useWindowEventListener";

export const useOnKeyDown = (
	code: string,
	callback: (event: KeyboardEvent) => void,
) => {
	useWindowEventListener("keydown", (event) => {
		if (event.code == code) {
			callback(event);
		}
	});
};

const getKeyBinding = (event: KeyboardEvent) => {
	const cPrefix = event.ctrlKey ? "C-" : "";
	const sPrefix = event.shiftKey ? "S-" : "";
	const aPrefix = event.altKey ? "A-" : "";
	const mPrefix = event.metaKey ? "M-" : "";
	return cPrefix + sPrefix + aPrefix + mPrefix + event.code;
};

export const useOnKeyDownDEV = (
	code: string,
	callback: (event: KeyboardEvent) => void,
) => {
	useWindowEventListener("keydown", (event) => {
		if (import.meta.env.DEV && getKeyBinding(event) == code) {
			callback(event);
		}
	});
};
