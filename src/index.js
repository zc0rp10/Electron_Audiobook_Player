// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

$ = document.getElementById.bind(document);
let audio = new Audio("../audiobooks/audiobook.m4b");
const playBtn = $("play-audio-btn");
const pauseBtn = $("pause-audio-btn");
const scrubFwdBtn = $("skip-forward-btn");
const scrubBwdBtn = $("skip-backward-btn");
const progressBar = $("progress-bar-fill");
const barCurrentTime = $("bar-current-time");
const barTotalTime = $("bar-total-time");

function secondsToHms(d) {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  let hDisplay = h > 0 ? (h < 10 ? "0" + h : h) : "00";
  let mDisplay = m > 0 ? (m < 10 ? "0" + m : m) : "00";
  let sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";
  return `${hDisplay}:${mDisplay}:${sDisplay}`;
}

// Player Btn Events
playBtn.addEventListener("click", () => {
  audio.play();
  playBtn.style.display = "none";
  pauseBtn.style.display = "inline-block";
  console.log("Play Btn Pressed");
});

pauseBtn.addEventListener("click", () => {
  audio.pause();
  pauseBtn.style.display = "none";
  playBtn.style.display = "inline-block";
  console.log("Pause Button Pressed");
});

scrubFwdBtn.addEventListener("click", () => {
  audio.currentTime = audio.currentTime + 30;
});

scrubBwdBtn.addEventListener("click", () => {
  audio.currentTime = audio.currentTime - 30;
});

// Progressbar & Timestamp Updates
const handleProgress = () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
  barCurrentTime.innerHTML = secondsToHms(audio.currentTime);
  barTotalTime.innerHTML = secondsToHms(audio.duration);
};

audio.addEventListener("timeupdate", handleProgress);
