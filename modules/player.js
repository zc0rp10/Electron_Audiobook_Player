class Player {
  constructor() {
    this.audioPlayer = new Audio();
    this.isPlaying = false;
    this._selectedBook = false; //TODO: Get last played if there is one, else set to empty
  }

  play() {
    this.audioPlayer.play();
    this.isPlaying = true;
    playPauseBtn.style.webkitMaskImage =
      "url(../assets/icons/pause_circle_outline-24px.svg)";
  }

  pause() {
    this.audioPlayer.pause();
    this.isPlaying = false;
    playPauseBtn.style.webkitMaskImage =
      "url(../assets/icons/play_circle_outline-24px.svg)";
  }

  playPause() {
    if (!this.isPlaying && this._selectedBook) {
      this.play();
    } else {
      this.pause();
    }
  }

  switchBook(newSrc) {
    this._selectedBook = newSrc;
    this.audioPlayer.src = this._selectedBook;
    bookView.update(this._selectedBook);

    //Checks if there's a bookmark for the book
    library.books.map(book =>
      book.filePath === newSrc
        ? (this.audioPlayer.currentTime = book.bookmark)
        : this.audioPlayer.currentTime
    );
    this.play();
  }

  scrubFwd() {
    this.audioPlayer.currentTime = this.audioPlayer.currentTime + 30;
  }

  scrubBwd() {
    this.audioPlayer.currentTime = this.audioPlayer.currentTime - 30;
  }

  updateBar = () => {
    barCurrentTime.innerHTML = secondsToHms(this.audioPlayer.currentTime);
    barTotalTime.innerHTML = secondsToHms(this.audioPlayer.duration);

    progressBarFill.setAttribute("max", this.audioPlayer.duration);
    seekBar.setAttribute("max", this.audioPlayer.duration);

    progressBarFill.setAttribute("value", this.audioPlayer.currentTime);
    seekBar.setAttribute("value", this.audioPlayer.currentTime);
  };

  set selectedBook(value) {
    this._selectedBook = value;
  }

  get selectedBook() {
    return this._selectedBook;
  }
}

module.exports = Player;
