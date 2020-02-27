// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { ipcRenderer } = require("electron");

$ = document.getElementById.bind(document);
let currentBook;
let audioPlayer = $("audio-player");
const playBtn = $("play-audio-btn");
const pauseBtn = $("pause-audio-btn");
const scrubFwdBtn = $("skip-forward-btn");
const scrubBwdBtn = $("skip-backward-btn");
const addBookBtn = $("add-bolder-btn");
const progressBar = $("progress-bar-fill");
const barCurrentTime = $("bar-current-time");
const barTotalTime = $("bar-total-time");

const switchBook = newSrc => {
  currentBook = newSrc;
  audioPlayer.src = currentBook;
  playBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";
  audioPlayer.addEventListener("timeupdate", handleProgress);
};

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
  if (currentBook) {
    audioPlayer.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    console.log("Play Btn Pressed");
  }
});

pauseBtn.addEventListener("click", () => {
  audioPlayer.pause();
  pauseBtn.style.display = "none";
  playBtn.style.display = "inline-block";
  console.log("Pause Button Pressed");
});

scrubFwdBtn.addEventListener("click", () => {
  audioPlayer.currentTime = audioPlayer.currentTime + 30;
});

scrubBwdBtn.addEventListener("click", () => {
  audioPlayer.currentTime = audioPlayer.currentTime - 30;
});

//Library Button Events
addBookBtn.addEventListener("click", () => {
  ipcRenderer.send("add-book-dialog");
});

ipcRenderer.on("add-book-dialog-reply", (event, arg) => {
  switchBook(arg);
});

// Progressbar & Timestamp Updates
const handleProgress = () => {
  const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
  barCurrentTime.innerHTML = secondsToHms(audioPlayer.currentTime);
  barTotalTime.innerHTML = secondsToHms(audioPlayer.duration);
};
