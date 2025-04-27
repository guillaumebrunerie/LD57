import type { FederatedPointerEvent } from "pixi.js";
import { getBg } from "./Background";
import { PolygonEditor } from "./polygonEditor";
import { useOnKeyDown } from "./useOnKeyDown";
import { useTickingObject } from "./useTickingObject";
import { firstTexture } from "./obstacle";
import { PolygonShape } from "./Polygon";

export const PolygonEditorC = () => {
	const polygonEditor = useTickingObject(PolygonEditor);

	useOnKeyDown("Enter", async () => {
		await polygonEditor.save();
	});
	useOnKeyDown("ArrowRight", () => {
		polygonEditor.switch(1);
	});
	useOnKeyDown("ArrowLeft", () => {
		polygonEditor.switch(-1);
	});

	useOnKeyDown("C-ArrowRight", () => {
		polygonEditor.move(1, 0);
	});
	useOnKeyDown("C-ArrowLeft", () => {
		polygonEditor.move(-1, 0);
	});
	useOnKeyDown("C-ArrowUp", () => {
		polygonEditor.move(0, -1);
	});
	useOnKeyDown("C-ArrowDown", () => {
		polygonEditor.move(0, 1);
	});

	return (
		<container>
			<sprite
				texture={getBg(1)}
				eventMode="static"
				onPointerDown={(e: FederatedPointerEvent) => {
					const { x, y } = e.global;
					polygonEditor.click({ x: x - 300, y });
				}}
			/>
			<container x={300} y={0}>
				<sprite texture={firstTexture(polygonEditor.obstacle)} />
				<PolygonShape
					alpha={0.4}
					polygon={polygonEditor.obstacle.polygon}
				/>
			</container>
		</container>
	);
};
