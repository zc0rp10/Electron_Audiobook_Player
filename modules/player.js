class Player {
  constructor() {
    this.audioPlayer = new Audio();
    this.isPlaying = false;
    this._selectedBook = String; //TODO: Get last played if there is one, else set to empty
  }

  play() {
    this.audioPlayer.src = this._selectedBook;
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
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  scrubFwd() {
    this.audioPlayer.currentTime = this.audioPlayer.currentTime + 30;
  }

  scrubBwd() {
    this.audioPlayer.currentTime = this.audioPlayer.currentTime - 30;
  }

  set selectedBook(value) {
    this._selectedBook = value;
  }

  get selectedBook() {
    return this._selectedBook;
  }
}

module.exports = Player;
