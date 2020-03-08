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
    this.audioPlayer.onended = () => this.trackEnded();
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

  next() {
    this.audioPlayer.src = this.activePlaylist[this.playlistIndex + 1].filePath;
    this.playlistIndex++;
    console.log("Next " + this.playlistIndex);
    this.play();
  }

  previous() {
    this.audioPlayer.src = this.activePlaylist[this.playlistIndex - 1].filePath;
    this.playlistIndex--;
    console.log("Prev. " + this.playlistIndex);
    this.play();
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
        this._selectedBook = book; // used to be file src
        this.activePlaylist = this._selectedBook.playlist;
        this.playlistIndex = this._selectedBook.bookmark.index;
        this.audioPlayer.src = this.activePlaylist[this.playlistIndex].filePath;
        this.audioPlayer.currentTime = this._selectedBook.bookmark.location;
        if (this._selectedBook.bookStatus !== "finished") {
          this._selectedBook.bookStatus = "started";
        }
      }
    });
    bookView.update(this._selectedBook);
    this.play();
  }

  trackEnded() {
    if (this.playlistIndex + 1 == this._selectedBook.playlistLength) {
      console.log("book has ended");
      this._selectedBook.bookStatus = "finished";
    } else {
      this.next();
    }
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
