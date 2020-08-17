# aframe-skeletor

<p align="center">
<img src="./docs/img/legend.png"/>
</p>

Inverse Kinematics for aframe.io using [three-skeletor](https://github.com/agoblinking/three-skeletor).

# Quick Start

```html
<html>
	<head>
		<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
	</head>
	<body>
		<a-scene>
			<!-- this hand is the mover or effector -->
			<a-entity
				id="hand"
				animation="property: position; from: 0 0 -1; to: 0 0 1; loop: true; dir: alternate;"
			/>

			<!-- this is the root of the joint chain with a ball joint-->
			<a-entity bone="root: true; ball: 180">
				<!-- this is the cap of the joint chain with a hinge joint to the target
				-->
				<a-entity bone="target: #hand; hinge: 90" />
			</a-entity>
		</a-scene>
	</body>
</html>
```

# Usage

## [goblin-life](https://goblin.life/legend)

Used for character IK in [goblin.life](https://goblin.life)!

# Playlist

- [Spotify](https://open.spotify.com/playlist/1sy0OGu2TTXLTiZ7zMdcoB?si=R0hXnZI_RSetxiD9Axh8Pg)
