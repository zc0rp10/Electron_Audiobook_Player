class Player {
  constructor() {
    this.audioPlayer = new Audio();
    this.isPlaying = false;
    this.selectedBook; //TODO: Get last played if there is one, else set to empty
  }

  play() {
    this.audioPlayer.src = this.selectedBook;
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
}

module.exports = Player;
