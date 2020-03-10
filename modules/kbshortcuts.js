function doc_keyUp(e) {
  if (bookView.editBookOpen === false) {
    switch (e.key) {
      case " ":
        player.playPause();
    }
    switch (e.key) {
      case "ArrowRight":
        player.scrubFwd();
    }
    switch (e.key) {
      case "ArrowLeft":
        player.scrubBwd();
    }
    switch (e.key) {
      case "ArrowUp":
        player.audioPlayer.volume =
          Math.round((player.audioPlayer.volume + 0.1) * 10) / 10;
        volumeBar.setAttribute("value", player.audioPlayer.volume);
    }
    switch (e.key) {
      case "ArrowDown":
        player.audioPlayer.volume =
          Math.round((player.audioPlayer.volume - 0.1) * 10) / 10;
        volumeBar.setAttribute("value", player.audioPlayer.volume);
    }
    switch (e.key) {
      case "+":
        player.changePlaybackRate(playbackIncreaseBtn.dataset.rate);
    }
    switch (e.key) {
      case "-":
        player.changePlaybackRate(playbackDecreaseBtn.dataset.rate);
    }
  }
}

window.addEventListener("keyup", doc_keyUp, true);
