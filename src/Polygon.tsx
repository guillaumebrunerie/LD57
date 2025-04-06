import type { Graphics, Polygon } from "pixi.js";
import { type ComponentProps, useCallback } from "react";

type PolygonProps = Omit<ComponentProps<"graphics">, "draw"> & {
	myRef?: React.Ref<Graphics>;
	polygon: Polygon;
	alpha?: number;
	y?: number;
};

type Draw = ComponentProps<"graphics">["draw"];

export const PolygonShape = ({
	myRef,
	polygon,
	alpha = 0.0,
	...rest
}: PolygonProps) => {
	const draw = useCallback<Draw>(
		(g) => {
			g.clear();
			g.poly(polygon.points);
			g.fill({ color: 0xff00ff, alpha });
		},
		[polygon, alpha],
	);

	return <graphics {...rest} ref={myRef} draw={draw} />;
};
