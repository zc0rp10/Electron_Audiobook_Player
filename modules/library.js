const { ipcRenderer } = require("electron");
const fsExtra = require("fs-extra");
const path = require("path");

class Library {
  constructor(args) {
    this.books = store.get("books");
    this._filter = "all";
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

  removeBook(bookFilePath) {
    this.books = this.books.filter(book => book.filePath != bookFilePath);
    this.render();
  }

  render() {
    libraryView.innerHTML = "";
    //Instead do something like, let booksFormated = this.books if filter and filter not equal to what's passed in, then filter,
    //followed by if this.sortOrder not equal to whats passed in, sort array.
    this.books.forEach(book => {
      if (this.filter === "all" || book.bookStatus === this.filter) {
        let timeLeft = secondsToHms(book.duration - book.bookmark);
        libraryView.insertAdjacentHTML(
          "beforeend",
          `<div class="book" id="${book.bookId}" data-src="${book.filePath}">
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
    </div>`
        );
      }
    });

    //Reapply Listeners after library is drawn
    const booksInLibrary = Array.from(document.querySelectorAll(".book"));
    booksInLibrary.forEach(book =>
      book.addEventListener("click", () => {
        player.switchBook(book.dataset.src.toString());
      })
    );

    const deleteBtns = Array.from(document.querySelectorAll(".more-vert-btn"));
    deleteBtns.forEach(dltBtn =>
      dltBtn.addEventListener("click", e => {
        e.stopPropagation();
        this.removeBook(event.path[2].dataset.src.toString());
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
    library.render();
  } catch (err) {
    console.error(err);
  }
}

//Awaits the response to add book dialog, TODO: Find out why I can't add it inside class. When i had it together with the sending function it adde multiple eventlistners
ipcRenderer.on("add-book-dialog-reply", (event, arg) => {
  mm.parseFile(arg)
    .then(metadata => {
      console.log(metadata);
      let book = metadata.common;
      let imgFilePath = path.join(
        `${userDataPath}`,
        "bookcovers",
        `${book.title}.png`
      );
      let coverMetaString = `data:${
        book.picture[0].format
      };base64,${book.picture[0].data.toString("base64")}`;
      baseDataToImageFile(coverMetaString, imgFilePath);

      library.books.push({
        bookId: `${book.title}`,
        filePath: arg,
        cover: imgFilePath,
        title: `${book.title}`,
        author: `${book.artist}`,
        narrator: `${book.composer}`,
        duration: Math.round(metadata.format.duration),
        bookmark: 0,
        bookStatus: "not started"
      });
    })
    .catch(err => {
      console.error(err.message);
    });
});

module.exports = Library;
