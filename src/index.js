// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const mm = require("music-metadata");
const { ipcRenderer } = require("electron");
const Store = require("../modules/store.js");

$ = document.getElementById.bind(document);
let currentlyPlaying;
let audioPlayer = $("audio-player");

const playBtn = $("play-audio-btn");
const pauseBtn = $("pause-audio-btn");
const scrubFwdBtn = $("skip-forward-btn");
const scrubBwdBtn = $("skip-backward-btn");
const addBookBtn = $("add-bolder-btn");
const progressBar = $("progress-bar-fill");
const barCurrentTime = $("bar-current-time");
const barTotalTime = $("bar-total-time");

const libraryView = $("lib-content");

const playerCover = $("player-cover");
const playerTitle = $("player-title");
const playerAuthor = $("player-author");
const playerNarrator = $("player-narrator");

//Create store object with library
const store = new Store({
  configName: "user-library",
  defaults: {
    books: []
  }
});

const booksArray = store.get("books");

const updateUserLibrary = updatedLibrary => {
  store.set("books", updatedLibrary);
};

const renderLibrary = books => {
  libraryView.innerHTML = "";
  books.forEach(book => {
    libraryView.insertAdjacentHTML(
      "beforeend",
      `<div class="book" id="${book.bookId}" data-src="${book.filePath}">
      <div class="book-image">
        <img class="pointer" src="data:${book.imageSrc}" />
      </div>
      <div class="book-content">
        <span class="book-title pointer"
          >${book.title}</span
        >
        <span class="book-author pointer">By ${book.author}</span>
        <span class="book-narrator pointer">Narrated by ${book.narrator}</span>
        <span class="book-stats pointer">54h 23m left</span>
      </div>
    </div>`
    );
  });

  const libraryBooks = Array.from(document.querySelectorAll(".book"));

  libraryBooks.forEach(libraryBook =>
    libraryBook.addEventListener("click", () => {
      switchBook(libraryBook.dataset.src.toString());
      console.log("Test 1");
    })
  );
};

const addBook = arg => {
  mm.parseFile(arg)
    .then(metadata => {
      console.log(metadata);
      booksArray.push({
        bookId: metadata.common.title,
        filePath: arg,
        imageSrc: `data:${
          metadata.common.picture[0].format
        };base64,${metadata.common.picture[0].data.toString("base64")}`,
        title: metadata.common.title,
        author: metadata.common.artist,
        narrator: metadata.common.composer
      });
      renderLibrary(booksArray);
      updateUserLibrary(booksArray);
    })
    .catch(err => {
      console.error(err.message);
    });
};

const switchBook = newSrc => {
  currentlyPlaying = newSrc;
  audioPlayer.src = newSrc;
  playBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";
  audioPlayer.addEventListener("timeupdate", handleProgress);

  mm.parseFile(newSrc)
    .then(metadata => {
      console.log(metadata);
      playerTitle.innerHTML = metadata.common.title;
      playerAuthor.innerHTML = `By ${metadata.common.artist}`;
      playerNarrator.innerHTML = `Narrated by ${metadata.common.composer}`;

      let picture = metadata.common.picture[0];
      playerCover.src = `data:${picture.format};base64,${picture.data.toString(
        "base64"
      )}`;
    })
    .catch(err => {
      console.error(err.message);
    });
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
  if (currentlyPlaying) {
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
  addBook(arg);
});

// Progressbar & Timestamp Updates
const handleProgress = () => {
  const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
  barCurrentTime.innerHTML = secondsToHms(audioPlayer.currentTime);
  barTotalTime.innerHTML = secondsToHms(audioPlayer.duration);
};

//Load Books and Settings on start
renderLibrary(booksArray);
