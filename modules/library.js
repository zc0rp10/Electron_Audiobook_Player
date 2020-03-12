const { ipcRenderer } = require("electron");
const path = require("path");

class Library {
  constructor(args) {
    this.books = store.get("books");
    this._filter = "all";
    this.render();
  }

  set filter(value) {
    this._filter = value;
    this.render();
  }

  get filter() {
    return this._filter;
  }

  addBook() {
    ipcRenderer.send("add-book-dialog");
  }

  addFolder() {
    ipcRenderer.send("add-folder-dialog");
  }

  removeBook(idOfBook) {
    this.books = this.books.filter(book => book.bookId != idOfBook);
    this.render();
  }

  removeFinishTag(idOfBook) {
    this.books.forEach(book => {
      if (book.bookId === idOfBook) {
        book.bookStatus = "not started";
      }
    });
  }

  render() {
    libraryView.innerHTML = "";
    //Instead do something like, let booksFormated = this.books if filter and filter not equal to what's passed in, then filter,
    //followed by if this.sortOrder not equal to whats passed in, sort array.
    this.books.forEach(book => {
      if (this.filter === "all" || book.bookStatus === this.filter) {
        let timeLeft;
        if (book.playlistLength === 1) {
          timeLeft = secondsToHms(book.duration - book.bookmark.location);
        } else {
          let elapsedTime = book.bookmark.location;
          book.playlist.forEach(track => {
            if (track.index < book.bookmark.index) {
              elapsedTime = elapsedTime + track.trackDuration;
            }
            timeLeft = secondsToHms(book.duration - elapsedTime);
          });
        }

        if (book.bookStatus === "finished") {
          libraryView.insertAdjacentHTML(
            "beforeend",
            `<div class="book" id="${book.bookId}" data-src="${book.filePath}">
            <div class="book-inner">
        <div class="book-image">
          <img class="pointer" src="${book.cover}" />
        </div>
        <div class="book-content">
          <span class="book-title pointer"
            >${book.title}</span
          >
          <span class="book-author pointer">By ${book.author}</span>
          <span class="book-narrator pointer">Narrated by ${book.narrator}</span>
          <span class="book-stats pointer">${timeLeft} left</span>
          <button class="btn more-vert-btn right"></button>
        </div>
        </div>
        <div class="book-reveal">
        <span class="menu-title">Menu</span>
        <button class="btn book-menu-close-btn right"></button>
        <p class="pointer dlt-book-btn">Remove Book</p>
        <p class="pointer edit-book-btn">Edit Book Details</p>
        <p class="pointer summary-book-btn">View Book Summary</p>
        <p class="pointer remove-ftag-btn">Remove Finished Tag</p>
        </div>
      </div>`
          );
        } else {
          libraryView.insertAdjacentHTML(
            "beforeend",
            `<div class="book" id="${book.bookId}" data-src="${book.filePath}">
          <div class="book-inner">
      <div class="book-image">
        <img class="pointer" src="${book.cover}" />
      </div>
      <div class="book-content">
        <span class="book-title pointer"
          >${book.title}</span
        >
        <span class="book-author pointer">By ${book.author}</span>
        <span class="book-narrator pointer">Narrated by ${book.narrator}</span>
        <span class="book-stats pointer">${timeLeft} left</span>
        <button class="btn more-vert-btn right"></button>
      </div>
      </div>
      <div class="book-reveal">
      <span class="menu-title">Menu</span>
      <button class="btn book-menu-close-btn right"></button>
      <p class="pointer dlt-book-btn">Remove Book</p>
      <p class="pointer edit-book-btn">Edit Book Details</p>
      <p class="pointer summary-book-btn">View Book Summary</p>
      </div>
    </div>`
          );
        }
      }
    });

    //Reapply Listeners after library is drawn
    //Click to switch and play book
    const booksInLibrary = Array.from(document.querySelectorAll(".book"));
    booksInLibrary.forEach(book =>
      book.addEventListener("click", () => {
        player.switchBook(book.id);
      })
    );

    //Reveal More Menu
    const moreBtns = Array.from(document.querySelectorAll(".more-vert-btn"));
    moreBtns.forEach(more =>
      more.addEventListener("click", e => {
        e.stopPropagation();
        bookView.toggleMoreMenu(e.path[3].lastElementChild);
      })
    );

    //Hide More Menu
    const lessBtns = Array.from(
      document.querySelectorAll(".book-menu-close-btn")
    );
    lessBtns.forEach(less =>
      less.addEventListener("click", e => {
        e.stopPropagation();
        bookView.toggleMoreMenu(e.path[2].lastElementChild);
      })
    );

    //Remove Book
    const dltBtns = Array.from(document.querySelectorAll(".dlt-book-btn"));
    dltBtns.forEach(dltBtn =>
      dltBtn.addEventListener("click", e => {
        e.stopPropagation();
        this.removeBook(e.path[2].id);
      })
    );

    //Remove Finish Tag
    const rmTagBtns = Array.from(document.querySelectorAll(".remove-ftag-btn"));
    rmTagBtns.forEach(rmTagBtn =>
      rmTagBtn.addEventListener("click", e => {
        e.stopPropagation();
        this.removeFinishTag(e.path[2].id);
        bookView.toggleMoreMenu(e.path[2].lastElementChild);
      })
    );

    //Edit Book Details
    const editBtns = Array.from(document.querySelectorAll(".edit-book-btn"));
    editBtns.forEach(editBtn =>
      editBtn.addEventListener("click", e => {
        e.stopPropagation();
        bookView.toggleMoreMenu(e.path[2].lastElementChild);
        bookView.editBookDetails(e.path[2].id);
      })
    );

    //View Book Summary
    const summaryBtns = Array.from(
      document.querySelectorAll(".summary-book-btn")
    );
    summaryBtns.forEach(summaryBtn =>
      summaryBtn.addEventListener("click", e => {
        e.stopPropagation();
        bookView.toggleMoreMenu(e.path[2].lastElementChild);
        bookView.toggleBookSummary(e.path[2].id);
      })
    );
  }

  sortLibrary(e) {
    let sortBy = e.target.value;

    if (sortBy != "length") {
      this.books.sort(function(a, b) {
        var nameA = a[sortBy].toUpperCase();
        var nameB = b[sortBy].toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    } else {
      this.books.sort(function(a, b) {
        return a.duration - b.duration;
      });
    }

    this.render();
  }
}

//Turns the base64 data from audiofile metadata intp a png and saves it to user folder
async function baseDataToImageFile(coverMetaString, imgFilePath) {
  try {
    // strip off the data: url prefix to get just the base64-encoded bytes
    let data = coverMetaString.replace(/^data:image\/\w+;base64,/, "");
    let buf = new Buffer(data, "base64");
    await fsExtra.outputFile(imgFilePath, buf);
    setTimeout(() => {
      store.set("books", library.books);
      library.render();
    }, 150);
  } catch (err) {
    console.error(err);
  }
}

//Add Folder
ipcRenderer.on("add-folder-dialog-reply", (event, bookObject) => {
  let isDuplicate = false;
  mm.parseFile(bookObject.playlist[0].filePath)
    .then(metadata => {
      let book = metadata.common;

      let imgFilePath = path.join(
        `${userDataPath}`,
        "bookcovers",
        `${book.title}.png`
      );
      let coverMetaString = `data:${
        book.picture[0].format
      };base64,${book.picture[0].data.toString("base64")}`;

      const metaDescription = book.description
        ? `${book.description}`
        : "Unfortunately no summary was included with the audio file.";

      bookObject.bookId = `${book.title}`;
      bookObject.cover = `${imgFilePath}`;
      bookObject.title = `${book.title}`;
      bookObject.author = `${book.artist}`;
      bookObject.narrator = `${book.composer}`;
      bookObject.description = metaDescription;
      baseDataToImageFile(coverMetaString, imgFilePath);
      return bookObject;
    })
    .then(bookObject => {
      library.books.forEach(book => {
        if (book.title === bookObject.bookId) {
          isDuplicate = true;
        }
      });
      return bookObject;
    })
    .then(bookObject => {
      for (let i = 0; i < bookObject.playlist.length; i++) {
        const element = bookObject.playlist[i];
        mm.parseFile(element.filePath).then(metadata => {
          bookObject.duration = bookObject.duration + metadata.format.duration;
          element.trackDuration = metadata.format.duration;
        });
      }
      return bookObject;
    })
    .then(bookObject => {
      if (isDuplicate === false) {
        library.books.push(bookObject);
      } else {
        alert(
          "A book with this name already exist in your library. If you still want to add it, please remove the old version and then try again."
        );
      }
    })
    .catch(err => {
      console.error(err.message);
    });
});

module.exports = Library;
