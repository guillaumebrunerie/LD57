import { CustomText } from "./CustomText";
import { obstaclesPatternsData } from "./obstaclesPatterns";
import { useOnKeyDown } from "./useOnKeyDown";
import { PatternEditor } from "./patternEditor";
import { ObstacleC } from "./ObstacleC";
import { getBg } from "./Background";
import { useTickingObject } from "./useTickingObject";
import { ForegroundFragment } from "./Foreground";

export const PatternEditorC = () => {
	const patternEditor = useTickingObject(PatternEditor);

	useOnKeyDown("Space", () => {
		patternEditor.refresh();
	});
	useOnKeyDown("ArrowRight", () => {
		patternEditor.switchPattern(1);
	});
	useOnKeyDown("ArrowLeft", () => {
		patternEditor.switchPattern(-1);
	});
	useOnKeyDown("ArrowDown", () => {
		patternEditor.switchLevel(1);
	});
	useOnKeyDown("ArrowUp", () => {
		patternEditor.switchLevel(-1);
	});

	return (
		<container>
			<sprite texture={getBg(patternEditor.level)} eventMode="static" />
			{patternEditor.obstacleManager.obstacles.map((obstacle) => (
				<ObstacleC
					key={obstacle.id}
					obstacle={obstacle}
					depth={0}
					level={patternEditor.level}
					nextLevelDepth={Infinity}
				/>
			))}
			<ForegroundFragment
				level={patternEditor.level}
				lt={patternEditor.lt}
				alpha={1}
			/>
			<CustomText
				anchor={{ x: 0.5, y: 1 }}
				x={1080 / 2}
				y={1920 - 20}
				text={`Level ${patternEditor.level}, pattern ${patternEditor.patternIndex + 1}/${obstaclesPatternsData[patternEditor.level - 1].data.length}`}
				style={{
					fontSize: 25,
					fontFamily: "Heroes Legend",
					fill: "#DDD",
					dropShadow: {
						angle: 90,
						distance: 3,
					},
				}}
			/>
		</container>
	);
};
