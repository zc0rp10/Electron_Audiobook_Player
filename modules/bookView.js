class BookView {
  constructor() {
    this._title = String;
    this._author = String;
    this._narrator = String;
    this._cover = String;
    this._chapter = String;
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
    this._chapter = chapterNbr + " - " + chapterName;
    this.render();
  }

  render() {
    bookViewTitle.textContent = this._title;
    bookViewAuthor.textContent = `By ${this._author}`;
    bookViewNarrator.textContent = `Narrated by ${this._narrator}`;
    bookViewCover.src = this._cover;
    bookViewChapter.textContent = this._chapter;
  }
}

module.exports = BookView;
