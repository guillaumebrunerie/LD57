import { useRef } from "react";
import type { Obstacle } from "./obstacle";
import { getFrame } from "./Animation";
import { A_HeartExplosion, T_Gradient } from "./assets";
import { PolygonShape } from "./Polygon";

export const ObstacleC = ({
	obstacle,
	level,
	depth,
	nextLevelDepth,
}: {
	obstacle: Obstacle;
	depth: number;
	level: number;
	nextLevelDepth: number;
}) => {
	const ref = useRef(null);

	if (obstacle.isDestroyed) {
		return (
			<sprite
				x={obstacle.x}
				y={obstacle.y}
				anchor={{ x: obstacle.pivotX, y: obstacle.pivotY }}
				blendMode="add"
				texture={getFrame(A_HeartExplosion, 15, obstacle.lt, "remove")}
				scale={{
					x: obstacle.scaleX * 1.2,
					y: obstacle.scaleY * 1.2,
				}}
			/>
		);
	}

	const getTexture = (level: number) => {
		if (obstacle.colliderData.texture.type == "texture-by-level") {
			return obstacle.colliderData.texture.textures[level - 1];
		} else {
			return getFrame(
				obstacle.colliderData.texture.textures,
				obstacle.colliderData.texture.fps,
				obstacle.lt,
			);
		}
	};

	const blendMode =
		obstacle.colliderData.texture.type == "animation" ?
			obstacle.colliderData.texture.blendMode
		:	"normal";

	const isBefore = obstacle.y < nextLevelDepth - 1920 / 2;

	type Interval = [number, number];

	const intervalIntersect = (...intervals: Interval[]) =>
		Math.max(...intervals.map((i) => i[0])) <
		Math.min(...intervals.map((i) => i[1]));

	const masked = intervalIntersect(
		[nextLevelDepth - 1920, nextLevelDepth],
		[depth, depth + 1920],
	);

	const baseLevel = isBefore ? level : level + 1;
	const maskingLevel = isBefore ? level + 1 : level;

	return (
		<container>
			<sprite
				x={obstacle.x}
				y={obstacle.y}
				scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
				anchor={{ x: obstacle.pivotX, y: obstacle.pivotY }}
				texture={getTexture(baseLevel)}
				blendMode={blendMode}
			/>
			<sprite
				texture={T_Gradient}
				ref={ref}
				x={0}
				y={nextLevelDepth - 1920 / 2}
				anchor={{ x: 0, y: 0.5 }}
				scale={{ x: 1, y: isBefore ? 1 : -1 }}
				alpha={0}
			/>
			{masked && (
				<sprite
					x={obstacle.x}
					y={obstacle.y}
					scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
					anchor={{ x: obstacle.pivotX, y: obstacle.pivotY }}
					texture={getTexture(maskingLevel)}
					mask={ref.current}
					alpha={ref.current ? 1 : 0}
				/>
			)}
			<PolygonShape
				x={obstacle.x - getTexture(1).width * obstacle.pivotX}
				y={obstacle.y - getTexture(1).height * obstacle.pivotY}
				scale={{ x: obstacle.scaleX, y: obstacle.scaleY }}
				alpha={0}
				polygon={obstacle.polygon()}
			/>
		</container>
	);
};
