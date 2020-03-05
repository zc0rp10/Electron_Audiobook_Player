const electron = require("electron");
const { ipcRenderer } = require("electron");

const mm = require("music-metadata");

const Store = require("../modules/store.js");
const Library = require("../modules/library.js");
const Player = require("../modules/player.js");
const BookView = require("../modules/bookView.js");

$ = document.getElementById.bind(document);
const userDataPath = electron.remote.app.getPath("userData");

//All DOM Elements
const playPauseBtn = $("play-pause-audio-btn");
const scrubFwdBtn = $("scrub-forward-btn");
const scrubBwdBtn = $("scrub-backward-btn");

const addBookBtn = $("add-book-btn");
const libraryView = $("lib-content");

const bookViewCover = $("book-view-cover");
const bookViewTitle = $("book-view-title");
const bookViewAuthor = $("book-view-author");
const bookViewNarrator = $("book-view-narrator");

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
  configName: "test-user-library",
  defaults: {
    books: []
  }
});

//Initiates the library class module that holds all the books and lets us manipulate that content
const library = new Library();
library.render();

//Initiates the Player class module that enable us to play books
const player = new Player();

//Initiates the BookVIew class module responsible for updating book data on right side
const bookView = new BookView();

//Eventlisteners for clicks on DOM Elements
addBookBtn.addEventListener("click", () => {
  library.addBook();
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

//Autosaves location is book while playing every 10 secs
setInterval(() => {
  if (player.isPlaying) {
    library.books = library.books.map(book =>
      book.filePath === player._selectedBook
        ? { ...book, bookmark: Math.round(player.audioPlayer.currentTime) }
        : book
    );
    console.log("Autosave Completed!");
  }
}, 10000);

//Listens for app close event from main.js process and saves users library and settings before quiting app
ipcRenderer.on("app-close", _ => {
  store.set("books", library.books);
  ipcRenderer.send("closed");
});
