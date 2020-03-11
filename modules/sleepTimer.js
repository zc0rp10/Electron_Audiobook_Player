class SleepTimer {
  constructor() {
    this.countdown;
    this._pauseAtChapterEnd = false;
    this.countdownActive = false;
  }

  handleSleep(e) {
    const input = e.target.dataset.time;
    if (input == "off") {
      clearInterval(sleepTimer.countdown);
      sleepTimer.countdownActive = false;
      sleepTimer.pauseAtChapterEnd = false;
      sleepTimerBtn.classList.add("btn-disabled");
    } else if (input == "end") {
      clearInterval(sleepTimer.countdown);
      sleepTimer.pauseAtChapterEnd = true;
      sleepTimerBtn.classList.remove("btn-disabled");
      sleepTimer.countdownActive = input;
    } else {
      if (
        sleepTimer.countdownActive == false ||
        sleepTimer.countdownActive == "end"
      ) {
        sleepTimer.timer(input);
        sleepTimer.countdownActive = input;
        sleepTimer.pauseAtChapterEnd = false;
        sleepTimerBtn.classList.remove("btn-disabled");
      }
    }
    bookView.toggleSleepTimerView();
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
    console.log({ seconds });
  }

  set pauseAtChapterEnd(value) {
    this._pauseAtChapterEnd = value;
  }

  get pauseAtChapterEnd() {
    return this._pauseAtChapterEnd;
  }
}

module.exports = SleepTimer;
