class SleepTimer {
  constructor() {
    this.countdown;
    this._pauseAtChapterEnd = false;
    this.countdownActive = false;
  }

  handleSleep(e) {
    const input = e.target.dataset.time;
    bookView.toggleSleepTimerView();
    clearInterval(sleepTimer.countdown);
    sleepTimer.countdownActive = false;
    if (input == "off") {
      sleepTimer.pauseAtChapterEnd = false;
      sleepTimerBtn.classList.add("btn-disabled");
    } else if (input == "end") {
      sleepTimer.pauseAtChapterEnd = true;
      sleepTimerBtn.classList.remove("btn-disabled");
      sleepTimer.countdownActive = input;
    } else {
      sleepTimer.timer(input);
      sleepTimer.countdownActive = input;
      sleepTimerBtn.classList.remove("btn-disabled");
    }
  }

  timer(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;
    this.displayTimeLeft(seconds);

    this.countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      if (secondsLeft < 0) {
        player.pause();
        sleepTimerBtn.classList.toggle("btn-disabled");
        this.countdownActive = false;
        clearInterval(this.countdown);
        return;
      }
      this.displayTimeLeft(secondsLeft);
    }, 1000);
  }

  displayTimeLeft(seconds) {
    console.log(seconds);
  }

  set pauseAtChapterEnd(value) {
    this._pauseAtChapterEnd = value;
  }

  get pauseAtChapterEnd() {
    return this._pauseAtChapterEnd;
  }
}

module.exports = SleepTimer;
