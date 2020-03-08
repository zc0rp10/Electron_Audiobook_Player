class BookView {
  constructor() {
    this._title = String;
    this._author = String;
    this._narrator = String;
    this._cover = String;
  }
  render() {
    bookViewTitle.textContent = this._title;
    bookViewAuthor.textContent = `By ${this._author}`;
    bookViewNarrator.textContent = `Narrated by ${this._narrator}`;
    bookViewCover.src = this._cover;
  }

  update(src) {
    library.books.map(book => {
      if (book.bookId === src) {
        this._title = book.title;
        this._author = book.author;
        this._narrator = book.narrator;
        this._cover = book.cover;
        this.render();
      }
    });
  }
}

module.exports = BookView;
