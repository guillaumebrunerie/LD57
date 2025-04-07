import { useWindowEventListener } from "./useWindowEventListener";

export const useOnKeyDownUp = (
	code: string,
	downCallback: (event: KeyboardEvent) => void,
	upCallback: (event: KeyboardEvent) => void,
) => {
	useWindowEventListener("keydown", (event) => {
		if (event.code == code) {
			downCallback(event);
		}
	});
	useWindowEventListener("keyup", (event) => {
		if (event.code == code) {
			upCallback(event);
		}
	});
};
