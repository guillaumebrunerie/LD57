#!/bin/zsh

echo
echo "# Size before crunching:"
du -hs gfx
du -hs audio
echo

echo "# Crunching PNG files"
for i in gfx/*.png
do
	pngquant --force --ext .png $i
	echo -n .
done
echo

echo "# Crunching JPG files"
for i in gfx/*.jpg
do
	jpegoptim --max=80 -q $i
	echo -n .
done
echo

echo "# Crunching MP3 files"
for i in audio/*.mp3
do
	lame --quiet --mp3input -b 128 $i $i.new
	mv $i.new $i
	echo -n .
done
echo

echo
echo "# Size after crunching:"
du -hs gfx
du -hs audio
echo
