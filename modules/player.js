class Player {
  constructor() {
    this.audioPlayer = new Audio();
    this.isPlaying = false;
    this._selectedBook = false; //TODO: Get last played if there is one, else set to empty
    this._isSeeking = false;
    this.activePlaylist = [];
    this.playlistIndex = Number;
  }

  adjustVolume(e) {
    this.audioPlayer.volume = e.target.value;
    volumeBarFill.setAttribute("value", e.target.value);
    console.log(e.target.value);
  }

  play() {
    this.audioPlayer.onended = () => this.bookEnded();
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

  scrubFwd() {
    this.audioPlayer.currentTime = this.audioPlayer.currentTime + 30;
  }

  scrubBwd() {
    this.audioPlayer.currentTime = this.audioPlayer.currentTime - 30;
  }

  goTo(e) {
    this._isSeeking = false;
    this.audioPlayer.currentTime =
      (e.offsetX / progressBar.offsetWidth) * this.audioPlayer.duration;
  }

  switchBook(idOfBook) {
    library.books.map(book => {
      if (book.bookId == idOfBook) {
        this._selectedBook = book.bookId; // used to be file src
        this.activePlaylist = book.playlist;
        this.playlistIndex = 0;
        this.audioPlayer.src = this.activePlaylist[this.playlistIndex].filePath;
      }
    });
    bookView.update(this._selectedBook);

    //Checks if there's a bookmark for the book // TODO: Regressed with the switch to a playlist driven player
    // library.books.map(book => {
    //   book.filePath === newSrc
    //     ? (this.audioPlayer.currentTime = book.bookmark)
    //     : this.audioPlayer.currentTime;

    //   if (book.filePath === newSrc && book.bookStatus !== "finished") {
    //     book.bookStatus = "started";
    //   }
    // });
    this.play();
  }

  bookEnded() {
    console.log("End of book.");
    library.books.map(book => {
      if (book.filePath == this.selectedBook) {
        book.bookStatus = "finished";
      }
    });
  }

  changePlaybackRate = e => {
    let step = parseFloat(e.target.dataset.rate);
    let player = this.audioPlayer;

    player.playbackRate = player.playbackRate + step;
    if (player.playbackRate < 0.5) {
      player.playbackRate = 0.5;
    } else if (player.playbackRate > 2.5) {
      player.playbackRate = 2.5;
    }
    playbackLabel.textContent = player.playbackRate.toFixed(2).toString() + "X";
  };

  updateBar = () => {
    barCurrentTime.textContent = secondsToHms(this.audioPlayer.currentTime);
    barTotalTime.textContent = secondsToHms(this.audioPlayer.duration);

    progressBarFill.setAttribute("max", this.audioPlayer.duration);
    seekBar.setAttribute("max", this.audioPlayer.duration);

    if (!this._isSeeking) {
      progressBarFill.setAttribute("value", this.audioPlayer.currentTime);
      seekBar.setAttribute("value", this.audioPlayer.currentTime);
    }
  };

  set selectedBook(value) {
    this._selectedBook = value;
  }

  get selectedBook() {
    return this._selectedBook;
  }
}

module.exports = Player;
