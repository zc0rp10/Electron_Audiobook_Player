// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

var audio = new Audio("../audiobooks/audiobook.m4b");
const playButton = document.getElementById("play-audio-btn");
const pauseButton = document.getElementById("pause-audio-btn");
const progressBar = document.getElementById("progress-bar-fill");

playButton.addEventListener("click", () => {
  audio.play();
  console.log("Play Button Pressed");
});

pauseButton.addEventListener("click", () => {
  audio.pause();
  console.log("Pause Button Pressed");
});

const handleProgress = () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
};

audio.addEventListener("timeupdate", handleProgress);
