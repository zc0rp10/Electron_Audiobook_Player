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
let bookSelected;
let isCurrentlyPlaying;
let audioPlayer = $("audio-player");

const playBtn = $("play-audio-btn");
const pauseBtn = $("pause-audio-btn");
const seekBar = $("seek-bar");
const scrubFwdBtn = $("skip-forward-btn");
const scrubBwdBtn = $("skip-backward-btn");
const playbackIncreaseBtn = $("increase-speed-btn");
const playbackDecreaseBtn = $("decrease-speed-btn");
const playbackLabel = $("playback-rate");
const addBookBtn = $("add-folder-btn");
const progressBar = $("progress-bar");
const progressBarFill = $("progress-bar-fill");
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

let booksArray = store.get("books");

const updateUserLibrary = updatedLibrary => {
  store.set("books", updatedLibrary);
};

const renderLibrary = books => {
  libraryView.innerHTML = "";
  books.forEach(book => {
    let timeLeft = secondsToHms(book.duration - book.bookmark, "x");
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
        <span class="book-stats pointer">${timeLeft} left</span>
        <button class="btn delete-btn right"></button>
      </div>
    </div>`
    );
    console.log(book);
  });

  //Selects book to player on click in library
  const libraryBooks = Array.from(document.querySelectorAll(".book"));
  libraryBooks.forEach(libraryBook =>
    libraryBook.addEventListener("click", () => {
      selectBook(libraryBook.dataset.src.toString());
    })
  );
  const deleteBtns = Array.from(document.querySelectorAll(".delete-btn"));
  deleteBtns.forEach(dltBtn =>
    dltBtn.addEventListener("click", () => {
      removeBook(event.path[2].dataset.src.toString());
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
        narrator: metadata.common.composer,
        duration: Math.round(metadata.format.duration),
        bookmark: 0
      });
      renderLibrary(booksArray);
    })
    .catch(err => {
      console.error(err.message);
    });
};

let testArray = [
  { name: "smultron", value: 12 },
  { name: "ägg", value: 12 },
  { name: "kaviar", value: 12 }
];
function testFunction() {
  testArray = testArray.filter(word => word.name != "smultron");
}

const removeBook = arg => {
  booksArray = booksArray.filter(book => book.filePath != arg);
  renderLibrary(booksArray);
};

const selectBook = newSrc => {
  bookSelected = true;
  isCurrentlyPlaying = false;
  audioPlayer.src = newSrc;
  audioPlayer.dataset.bookid = newSrc;
  playBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";
  audioPlayer.addEventListener("timeupdate", handleProgress);

  //Checks if there's a bookmark for the book
  booksArray.map(book =>
    book.filePath === newSrc
      ? (audioPlayer.currentTime = book.bookmark)
      : audioPlayer.currentTime
  );

  //Updates the player on the right side with all the metadata
  mm.parseFile(newSrc)
    .then(metadata => {
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

function secondsToHms(d, x) {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  let hDisplay = h > 0 ? (h < 10 ? "0" + h : h) : "00";
  let mDisplay = m > 0 ? (m < 10 ? "0" + m : m) : "00";
  let sDisplay = s > 0 ? (s < 10 ? "0" + s : s) : "00";
  if (!x) {
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  }
  return `${hDisplay}h ${mDisplay}m`;
}

// Player Btn Events
playBtn.addEventListener("click", () => {
  if (bookSelected) {
    isCurrentlyPlaying = true;
    audioPlayer.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
    console.log("Play Btn Pressed");
  }
});

pauseBtn.addEventListener("click", () => {
  isCurrentlyPlaying = false;
  audioPlayer.pause();
  pauseBtn.style.display = "none";
  playBtn.style.display = "inline-block";
  console.log("Pause Button Pressed");
});

//Event Listners for Skipping & Scrubbing

scrubFwdBtn.addEventListener("click", () => {
  audioPlayer.currentTime = audioPlayer.currentTime + 30;
});

scrubBwdBtn.addEventListener("click", () => {
  audioPlayer.currentTime = audioPlayer.currentTime - 30;
});

const scrub = e => {
  scrubTime = (e.offsetX / progressBar.offsetWidth) * audioPlayer.duration;
  audioPlayer.currentTime = scrubTime;
  console.log(e);
};

seekBar.oninput = function() {
  progressBarFill.setAttribute("value", Math.round(seekBar.value));
};

seekBar.addEventListener("mouseup", scrub);

//Adjust Playback Rate
const changePlaybackRate = e => {
  let step = parseFloat(e.target.dataset.rate);

  audioPlayer.playbackRate = audioPlayer.playbackRate + step;
  if (audioPlayer.playbackRate < 0.5) {
    audioPlayer.playbackRate = 0.5;
  } else if (audioPlayer.playbackRate > 2.5) {
    audioPlayer.playbackRate = 2.5;
  }
  playbackLabel.innerHTML =
    audioPlayer.playbackRate.toFixed(2).toString() + "X";
};

playbackIncreaseBtn.addEventListener("click", changePlaybackRate);
playbackDecreaseBtn.addEventListener("click", changePlaybackRate);

//Library Button Events
addBookBtn.addEventListener("click", () => {
  ipcRenderer.send("add-book-dialog");
});

ipcRenderer.on("add-book-dialog-reply", (event, arg) => {
  addBook(arg);
});

// Progress Bar Fill & Timestamp Updates
const handleProgress = () => {
  barCurrentTime.innerHTML = secondsToHms(audioPlayer.currentTime);
  barTotalTime.innerHTML = secondsToHms(audioPlayer.duration);

  progressBarFill.setAttribute("max", audioPlayer.duration);
  seekBar.setAttribute("max", audioPlayer.duration);

  progressBarFill.setAttribute("value", audioPlayer.currentTime);
  seekBar.setAttribute("value", audioPlayer.currentTime);
};

//Autobookmark the users listening process every 10 secs if playing
setInterval(function() {
  if (isCurrentlyPlaying) {
    booksArray = booksArray.map(book =>
      book.filePath === audioPlayer.dataset.bookid
        ? { ...book, bookmark: Math.round(audioPlayer.currentTime) }
        : book
    );
    console.log("Autosave Complete!");
  }
}, 10000);

//Listens for app close event from main.js process
ipcRenderer.on("app-close", _ => {
  updateUserLibrary(booksArray);

  ipcRenderer.send("closed");
});

//Load Books and Settings on start
renderLibrary(booksArray);
