class Player {
  constructor() {
    this.audioPlayer = new Audio();
    this.isPlaying = false;
    this._selectedBook = false; //TODO: Get last played if there is one, else set to empty
    this._isSeeking = false;
    this.playlistIndex = Number;
    this.playerSettings = store.get("playerSettings");
    this.adjustVolume();
  }

  adjustVolume(e) {
    if (e) {
      this.audioPlayer.volume = e.target.value;
      this.playerSettings = e.target.value;
    } else {
      this.audioPlayer.volume = this.playerSettings;
    }
  }

  adjustVolumeBarFill() {
    volumeBarFill.setAttribute("value", player.audioPlayer.volume);
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
    if (!this.isPlaying && this.selectedBook) {
      this.play();
    } else {
      this.pause();
    }
  }

  next() {
    this.audioPlayer.src = this.selectedBook.playlist[
      this.playlistIndex + 1
    ].filePath;
    this.playlistIndex++;
    this.play();
    bookView.update();
  }

  previous() {
    this.audioPlayer.src = this.selectedBook.playlist[
      this.playlistIndex - 1
    ].filePath;
    this.playlistIndex--;
    this.play();
    bookView.update();
  }

  goToTrack(value) {
    this.audioPlayer.src = this.selectedBook.playlist[value].filePath;
    this.playlistIndex = value;
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
        this.selectedBook = book; // used to be file src
        this.selectedBook.playlist = this.selectedBook.playlist;
        this.playlistIndex = this.selectedBook.bookmark.index;
        this.audioPlayer.src = this.selectedBook.playlist[
          this.playlistIndex
        ].filePath;
        this.audioPlayer.currentTime = this.selectedBook.bookmark.location;
        if (this.selectedBook.bookStatus !== "finished") {
          this.selectedBook.bookStatus = "started";
        }
        bookView.update();
        this.play();
      }
    });
  }

  trackEnded() {
    if (this.playlistIndex + 1 == this.selectedBook.playlistLength) {
      this.selectedBook.bookStatus = "finished";
    } else {
      this.next();
    }
  }

  changePlaybackRate = e => {
    let step = parseFloat(e);
    let player = this.audioPlayer;

    player.playbackRate = player.playbackRate + step;
    if (player.playbackRate < 0.5) {
      player.playbackRate = 0.5;
    } else if (player.playbackRate > 2.5) {
      player.playbackRate = 2.5;
    }
    playbackLabel.textContent = player.playbackRate.toFixed(2).toString() + "X";
  };

  updateBookmark() {
    this.selectedBook.bookmark.index = this.playlistIndex;
    this.selectedBook.bookmark.location = Math.round(
      this.audioPlayer.currentTime
    );
  }

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
