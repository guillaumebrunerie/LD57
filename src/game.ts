import {
	// S_CompleteLevel,
	// LoseGame,
	S_Music,
	S_MusicIntensity1,
	S_MusicIntensity2,
	S_MusicIntensity3,
	// S_StartLevel,
} from "./assets";
import { ObstacleManager as ObstaclesManager } from "./obstaclesManager";
import { Player } from "./player";
import { type Point } from "./utils";
import { PolygonEditor } from "./polygonEditor";
import { fadeVolume } from "./sound";

export class Game {
	lt = 0;
	startLt = 0;

	isPaused = false;
	state: "startScreen" | "game" | "polygonEditor" = "startScreen";
	polygonEditor = new PolygonEditor();

	depth = 0;
	baseSpeed = 600;
	speedIncrease = 40;
	cameraSpeed = this.baseSpeed;

	yBgOffset = Math.random();

	player = new Player(this);
	obstaclesManager = new ObstaclesManager(this);

	level = 0;
	levelDepth = 7500;

	constructor() {}

	init() {
		S_MusicIntensity1.singleInstance = true;
		S_MusicIntensity2.singleInstance = true;
		S_MusicIntensity3.singleInstance = true;
		void S_MusicIntensity1.play({ loop: true, volume: 0.1 });
		void S_MusicIntensity2.play({ loop: true, volume: 0.1 });
		void S_MusicIntensity3.play({ loop: true, volume: 0.1 });
	}

	levels = 9;

	tick(delta: number) {
		if (this.isPaused) {
			return;
		}
		this.lt += delta;
		this.startLt += delta;

		if (this.state !== "game") {
			return;
		}

		if (this.level <= this.levels) {
			this.depth += this.cameraSpeed * delta;
			if (this.depth > this.levelDepth * this.level) {
				this.nextLevel();
			}
		} else {
			this.depth = this.levelDepth * this.levels;
		}

		this.player.tick(delta);

		this.obstaclesManager.tick(delta);

		if (
			this.level < this.levels &&
			this.obstaclesManager.checkCollision(this.player) &&
			this.player.invincibleTimeout == 0
		) {
			this.player.hit();
		}
	}

	nextLevel() {
		this.level++;
		this.obstaclesManager.nextLevel();
		this.cameraSpeed = this.baseSpeed + this.level * this.speedIncrease;
		S_MusicIntensity1.singleInstance = true;
		S_MusicIntensity2.singleInstance = true;
		S_MusicIntensity3.singleInstance = true;

		const musicVolumes = [
			[2, 0, 0],
			[1.3, 0.7, 0],
			[0.7, 1.3, 0],
			[0, 2, 0],
			[0, 1.6, 0.4],
			[0, 1.2, 0.8],
			[0, 0.8, 1.2],
			[0, 0.4, 1.6],
			[0, 0, 2],
			[0, 0, 2],
		];

		const minVolume = 0.1;

		fadeVolume(
			"S_MusicIntensity1",
			S_MusicIntensity1,
			musicVolumes[this.level - 1][0] + minVolume,
			1000,
		);
		fadeVolume(
			"S_MusicIntensity2",
			S_MusicIntensity2,
			musicVolumes[this.level - 1][1] + minVolume,
			1000,
		);
		fadeVolume(
			"S_MusicIntensity3",
			S_MusicIntensity3,
			musicVolumes[this.level - 1][2] + minVolume,
			1000,
		);
	}

	start() {
		this.state = "game";
		S_MusicIntensity1.singleInstance = true;
		S_MusicIntensity2.singleInstance = true;
		S_MusicIntensity3.singleInstance = true;
		void S_MusicIntensity1.play({ loop: true, volume: 0.1 });
		void S_MusicIntensity2.play({ loop: true, volume: 0.1 });
		void S_MusicIntensity3.play({ loop: true, volume: 0.1 });
		S_MusicIntensity1.volume = 0.1;
		S_MusicIntensity2.volume = 0.1;
		S_MusicIntensity3.volume = 0.1;
		this.lt = 0;
	}

	reset() {
		this.isPaused = false;
		void S_Music.stop();
	}

	backToMainMenu() {
		this.reset();
		this.state = "startScreen";
		void S_Music.resume();
	}

	pause() {
		void S_Music.pause();
		void S_Music.pause();
		this.isPaused = true;
	}

	resume() {
		void S_Music.resume();

		this.isPaused = false;
	}

	autoPause() {
		if (this.state == "game") {
			this.pause();
		}
	}

	autoResume() {
		if (this.state == "game") {
			this.resume();
		}
	}

	// win() {
	// 	void S_Music.pause();
	// 	void S_CompleteLevel.play({ volume: 0.5 });
	// 	this.state = "win";
	// 	this.startLt = 0;
	// }

	onEvent(type: "pointerdown" | "pointermove" | "pointerup", pos: Point) {
		switch (type) {
			case "pointerdown":
				this.player.onPointerDown(pos);
				break;
			case "pointermove":
				this.player.onPointerMove(pos);
				break;
			case "pointerup":
				this.player.onPointerUp();
				break;
		}
	}
}
