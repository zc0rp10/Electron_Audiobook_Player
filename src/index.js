const electron = require("electron");
const { ipcRenderer } = require("electron");
const fsExtra = require("fs-extra");

const mm = require("music-metadata");

const Store = require("../modules/store.js");
const Library = require("../modules/library.js");
const Player = require("../modules/player.js");
const BookView = require("../modules/bookView.js");
const SleepTimer = require("../modules/sleepTimer.js");
require("../modules/kbshortcuts.js");

$ = document.getElementById.bind(document);
const userDataPath = electron.remote.app.getPath("userData");

//All DOM Elements
const playPauseBtn = $("play-pause-audio-btn");
const scrubFwdBtn = $("scrub-forward-btn");
const scrubBwdBtn = $("scrub-backward-btn");
const skipFwdBtn = $("skip-forward-btn");
const skipBwdBtn = $("skip-backward-btn");

const playbackIncreaseBtn = $("increase-speed-btn");
const playbackDecreaseBtn = $("decrease-speed-btn");
const playbackLabel = $("playback-rate");

const sleepTimerBtn = $("sleep-timer-btn");
const sleepTimerView = $("sleep-timer-module");

const addBookBtn = $("add-book-btn");
const addFolderBtn = $("add-folder-btn");
const hamburgerBtn = $("hamburger-btn");

const menu = $("menu");
const summaryBookView = $("book-view-summary");
const summaryTitle = $("summary-title");
const summaryDescription = $("summary-description");
const editBookView = $("book-view-edit");
const settingsView = $("settings");
const libraryView = $("lib-content");
const libraryFilterSelect = $("filter-select");
const librarySortSelect = $("sort-select");
const chapterSelect = $("chapter-select");

const bookViewCover = $("book-view-cover");
const bookViewTitle = $("book-view-title");
const bookViewAuthor = $("book-view-author");
const bookViewNarrator = $("book-view-narrator");
const bookViewChapter = $("book-view-chapter");

const editBookSubmit = $("edit-book-submit");
const inputEditId = $("editId");
const inputEditTitle = $("editTitle");
const inputEditAuthor = $("editAuthor");
const inputEditNarrator = $("editNarrator");

const seekBar = $("seek-bar");
const progressBar = $("progress-bar");
const progressBarFill = $("progress-bar-fill");
const barCurrentTime = $("bar-current-time");
const barTotalTime = $("bar-total-time");

const volumeBar = $("volume-seek-bar");
const volumeBarFill = $("volume-bar-fill");

const toggleSummaryBtn = document.querySelector(".toggle-summary-view");
const toggleEditBtn = document.querySelector(".toggle-edit-view");

const menuBtnLabels = Array.from(document.querySelectorAll(".btn-menu-label"));
const menuBtns = Array.from(document.querySelectorAll(".btn-menu-btn"));
const colorSelectBtns = Array.from(document.querySelectorAll(".color-box"));
const toggleSettingsBtns = Array.from(
  document.querySelectorAll(".toggle-settings")
);
const sleepForBtns = Array.from(document.querySelectorAll(".sleep-time"));

//Helper function to format seconds to Hours and Minutes
function secondsToHms(d, x) {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  let hDisplay = h > 0 ? (h < 10 ? "0" + h : h) : "00";
  let mDisplay = m > 0 ? (m < 10 ? "0" + m : m) : "00";
  let sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";
  if ((x = "long")) {
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  }
  return `${hDisplay}h ${mDisplay}m`;
}

//Iniates Store and loads save user data for settings and library content
const store = new Store({
  configName: "user-library",
  defaults: {
    books: [],
    uiSettings: {
      uiPrimaryColor: "#ffc600"
    },
    playerSettings: {
      volumeLevel: 1
    }
  }
});

//Initiates the library class module that holds all the books and lets us manipulate that content
const library = new Library();
library.render();

//Initiates the Player class module that enable us to play books
const player = new Player();

//Initiates the BookVIew class module responsible for updating book data on right side
const bookView = new BookView();
const sleepTimer = new SleepTimer();

//Eventlisteners for clicks on DOM Elements
addBookBtn.addEventListener("click", () => {
  library.addBook();
});

addFolderBtn.addEventListener("click", () => {
  library.addFolder();
});

playPauseBtn.addEventListener("click", () => {
  player.playPause();
});

scrubFwdBtn.addEventListener("click", () => {
  player.scrubFwd();
});

scrubBwdBtn.addEventListener("click", () => {
  player.scrubBwd();
});

skipFwdBtn.addEventListener("click", () => {
  player.next();
});

skipBwdBtn.addEventListener("click", () => {
  player.previous();
});

player.audioPlayer.addEventListener("timeupdate", () => {
  player.updateBookmark();
  player.updateBar();
});

seekBar.addEventListener("mouseup", e => {
  player.goTo(e);
});

seekBar.addEventListener("input", () => {
  player._isSeeking = true;
  progressBarFill.setAttribute("value", Math.round(seekBar.value));
});

playbackIncreaseBtn.addEventListener("click", e => {
  player.changePlaybackRate(e.target.dataset.rate);
});

playbackDecreaseBtn.addEventListener("click", e => {
  player.changePlaybackRate(e.target.dataset.rate);
});

libraryFilterSelect.addEventListener("change", e => {
  library.filter = e.target.value;
});

librarySortSelect.addEventListener("change", e => {
  library.sortLibrary(e);
});

chapterSelect.addEventListener("change", e => {
  player.goToTrack(e.target.value);
});

volumeBar.addEventListener("input", e => {
  player.adjustVolume(e);
});

player.audioPlayer.addEventListener("volumechange", () => {
  player.adjustVolumeBarFill();
});

hamburgerBtn.addEventListener("click", bookView.toggleMenuOpen);
menuBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    if (bookView.menuOpen) {
      bookView.toggleMenuOpen();
    }
  })
);

toggleSettingsBtns.forEach(btn =>
  btn.addEventListener("click", bookView.toggleSettings)
);

toggleEditBtn.addEventListener("click", bookView.toggleEdit);

editBookSubmit.addEventListener("click", () => {
  bookView.submitBookDetails(inputEditId.value);
});

toggleSummaryBtn.addEventListener("click", bookView.toggleBookSummary);

colorSelectBtns.forEach(btn =>
  btn.addEventListener("click", bookView.changeUIColor)
);

sleepTimerBtn.addEventListener("click", e => {
  bookView.toggleSleepTimerView();
  const adjustTop = sleepTimerView.getBoundingClientRect().height + 20;
  const adjustLeft = sleepTimerView.getBoundingClientRect().width / 2;
  sleepTimerView.style.left = `${e.target.offsetLeft - adjustLeft + 28}px`;
  sleepTimerView.style.top = `${e.target.offsetTop - adjustTop}px`;
  sleepForBtns.forEach(btn => {
    btn.dataset.time === sleepTimer.countdownActive
      ? btn.classList.add("btn-active")
      : btn.classList.remove("btn-active");
  });
});
sleepForBtns.forEach(btn =>
  btn.addEventListener("click", sleepTimer.handleSleep)
);

//Autosaves location is book while playing every 10 secs
setInterval(() => {
  if (player.isPlaying) {
    library.books.forEach(book => {
      if (book.bookId === player.selectedBook.bookId) {
        book = player.selectedBook;
      }
    });
    console.log("Autosave Completed!");
  }
}, 10000);

//Listens for app close event from main.js process and saves users library and settings before quiting app
ipcRenderer.on("app-close", _ => {
  store.set("books", library.books);
  store.set("uiSettings", bookView.uiSettings);
  store.set("playerSettings", player.playerSettings);
  ipcRenderer.send("closed");
});
