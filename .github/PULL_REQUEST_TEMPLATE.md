# problem statement

<!--
- X behaves this way, which breaks Y
-->

# solution

<!--
- decouple X & Y
- make Y a standalone component, etc
-->

# discussion

<!--
e.g.:
- "here's a GIF of X revamped"
- "considered this, considered that, yada yada"
-->

<!--
// UI PR?
// here's a handy bash function to load into your shell profile so you can convert
// screen recordings to animated GIFs!
// movToGif my-screen-recording.mov ==> my-screen-recording.mov.gif
function movToGif() {
  `ffmpeg -i $1 -pix_fmt rgb24 -r 5 -f gif - | gifsicle --optimize=4 --delay=20 > $1.gif`;
}
-->
