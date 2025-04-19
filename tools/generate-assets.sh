#!/bin/zsh
setopt null_glob

root=$(dirname $(dirname ${0:a}))

export LC_ALL=C
echo "/** Generated on $(date) by 'tools/generate-assets.sh' */"
echo
echo "/* eslint-disable */"
echo "// @ts-nocheck"
echo

names=()
exports=()

echo "/** Textures */"
for file in $root/gfx/*.(png|jpg)
do
	texture=$(basename ${file})
	name=${texture%.*}
	if [[ ! -a "$root/gfx/${name}.json" ]]
	then
		echo "import ${name}_TEXTURE from \"../gfx/$texture?texture\";"
		names+=(${name}_TEXTURE)
		exports+=(T_${name})
	fi
done

echo
echo "/** Spritesheets */"
for file in $root/gfx/*.json
do
	spritesheet=$(basename ${file%.*})
	echo "import ${spritesheet}_SPRITESHEET from \"../gfx/$spritesheet.png?spritesheet\";"
	names+=(${spritesheet}_SPRITESHEET)
	exports+=(SS_${spritesheet})
	names+=(${spritesheet}_SPRITESHEET)
	exports+=("{ animations: { $spritesheet: A_$spritesheet } }")
done

echo
echo "/** Sounds */"
for file in $root/audio/*.mp3
do
	sound=$(basename ${file%.*})
	echo "import ${sound}_SOUND from \"../audio/$sound.mp3?sound\";"
	names+=(${sound}_SOUND)
	exports+=(S_${sound})
done

echo
echo "/** Fonts */"
for file in $root/fonts/*.ttf
do
	font=$(basename ${file%.*})
	echo "import ${font}_FONT from \"../fonts/$font.ttf?font\";"
	names+=(${font}_FONT)
	exports+=(F_${font})
done

echo
echo "export const ["
for export_ in $exports
do
	echo "	${export_},"
done
echo "] = await Promise.all(["
for name in $names
do
	echo "	${name},"
done
echo "]);"
