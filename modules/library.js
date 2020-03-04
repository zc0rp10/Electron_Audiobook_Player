const { ipcRenderer } = require("electron");
const fsExtra = require("fs-extra");
const path = require("path");

class Library {
  constructor(args) {
    this.books = store.get("books");
    this.filter = "";
    this.sortOrder = "";
  }
  render() {
    libraryView.innerHTML = "";
    //Instead do something like, let booksFormated = this.books if filter and filter not equal to what's passed in, then filter,
    //followed by if this.sortOrder not equal to whats passed in, sort array.
    this.books.forEach(book => {
      let timeLeft = secondsToHms(book.duration - book.bookmark);
      libraryView.insertAdjacentHTML(
        "beforeend",
        `<div class="book" id="${book.bookId}" data-src="${book.filePath}">
      <div class="book-image">
        <img class="pointer" src="${book.imageSrc}" />
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
    });
  }

  addBook() {
    ipcRenderer.send("add-book-dialog");
  }
  removeBook(arg) {
    this.books = this.books.filter(book => book.filePath != arg);
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
        bookId: book.title,
        filePath: arg,
        imageSrc: imgFilePath,
        title: book.title,
        author: book.artist,
        narrator: book.composer,
        duration: Math.round(metadata.format.duration),
        bookmark: 0
      });
    })
    .catch(err => {
      console.error(err.message);
    });
});

module.exports = Library;
