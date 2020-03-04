const { ipcRenderer } = require("electron");

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
    ipcRenderer.on("add-book-dialog-reply", (event, arg) => {
      mm.parseFile(arg)
        .then(metadata => {
          this.books.push({
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
          this.render();
        })
        .catch(err => {
          console.error(err.message);
        });
    });
  }
  removeBook(arg) {
    this.books = this.books.filter(book => book.filePath != arg);
    this.render();
  }
}

module.exports = Library;
