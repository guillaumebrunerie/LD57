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
