class BookView {
  constructor() {
    this._title = String;
    this._author = String;
    this._narrator = String;
    this._cover = String;
    this._chapter = String;
    this.editBookOpen = false;
    this.summaryBookOpen = false;
    this.settings = store.get("settings");
    this.changeUIColor();
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

  toggleBookSummary(idOfBook) {
    //If it's a string user is asking to see the summary. Otherwise they've pressed the close btn of the summary view, or opening edit.
    if (typeof idOfBook == "string") {
      library.books.forEach(book => {
        //Pulls the summary details from the library of books
        if (book.bookId === idOfBook) {
          summaryTitle.textContent = book.title;
          summaryDescription.textContent = book.description;
          //Checks if summary view is already opened from viewing other summary, if so it will prevent it from being closed.
          if (!this.summaryBookOpen) {
            summaryBookView.classList.toggle("hidden");
            bookView.summaryBookOpen = bookView.summaryBookOpen ? false : true;
            //Closes Edit View if open.
            if (this.editBookOpen) {
              this.toggleEdit();
            }
          }
        }
      });
    } else {
      //Only triggers if user has pressed the close btn in the summary view
      summaryBookView.classList.toggle("hidden");
      bookView.summaryBookOpen = bookView.summaryBookOpen ? false : true;
    }
  }

  editBookDetails(idOfBook) {
    if (this.summaryBookOpen) {
      this.toggleBookSummary();
    }
    library.books.forEach(book => {
      if (book.bookId === idOfBook) {
        inputEditId.value = book.bookId;
        inputEditTitle.value = book.title;
        inputEditAuthor.value = book.author;
        inputEditNarrator.value = book.narrator;
        //Closes Summary View if open.
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

  changeUIColor(e) {
    const root = document.documentElement;
    //If e is true it means user picked color by clicking on box in settings.
    if (e) {
      const color = window
        .getComputedStyle(e.target)
        .getPropertyValue("background-color");
      bookView.settings.uiPrimaryColor = color;
      root.style.setProperty(
        "--ui-highlight-color",
        bookView.settings.uiPrimaryColor
      );
      //Otherwise it was iniated by the new BookView being initiated when app starts, and last used color is loaded
    } else {
      root.style.setProperty(
        "--ui-highlight-color",
        this.settings.uiPrimaryColor
      );
    }
  }
}

module.exports = BookView;
