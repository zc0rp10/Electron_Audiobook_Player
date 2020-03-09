class BookView {
  constructor() {
    this._title = String;
    this._author = String;
    this._narrator = String;
    this._cover = String;
    this._chapter = String;
    this.editBookOpen = false;
  }

  toggleSettings() {
    settingsView.classList.toggle("hidden");
  }

  toggleMoreMenu(element) {
    element.classList.toggle("book-reveal-open");
  }

  update() {
    const chapterName =
      player.selectedBook.playlist[player.playlistIndex].trackTitle;
    const chapterNbr =
      player.playlistIndex + 1 + " / " + player.selectedBook.playlistLength;
    this._title = player.selectedBook.title;
    this._author = player.selectedBook.author;
    this._narrator = player.selectedBook.narrator;
    this._cover = player.selectedBook.cover;
    this._chapter =
      player.selectedBook.playlistLength !== 1
        ? chapterNbr + " - " + chapterName
        : "";
    this.render();
  }

  render() {
    bookViewTitle.textContent = this._title;
    bookViewAuthor.textContent = `By ${this._author}`;
    bookViewNarrator.textContent = `Narrated by ${this._narrator}`;
    bookViewCover.src = this._cover;
    bookViewChapter.textContent = this._chapter;
  }

  //Access directly by close btn in the Edit View. The book cards access it via editBookDetails() (so it only opens if not alreay)
  toggleEdit() {
    bookView.editBookOpen = bookView.editBookOpen ? false : true;
    editBookView.classList.toggle("hidden");
  }

  editBookDetails(idOfBook) {
    library.books.forEach(book => {
      if (book.bookId === idOfBook) {
        inputEditId.value = book.bookId;
        inputEditTitle.value = book.title;
        inputEditAuthor.value = book.author;
        inputEditNarrator.value = book.narrator;
        if (!this.editBookOpen) {
          this.toggleEdit();
        }
      }
    });
  }

  submitBookDetails(idOfBook) {
    library.books.forEach(book => {
      if (book.bookId === idOfBook) {
        book.title = inputEditTitle.value.toString();
        book.author = inputEditAuthor.value.toString();
        book.narrator = inputEditNarrator.value.toString();
        editBookView.classList.toggle("hidden");

        if (player.selectedBook.bookId === idOfBook) {
          player.selectedBook.title = inputEditTitle.value.toString();
          player.selectedBook.author = inputEditAuthor.value.toString();
          player.selectedBook.narrator = inputEditNarrator.value.toString();
          this.update();
          this.render();
        }
        library.render();
      }
    });
  }
}

module.exports = BookView;
