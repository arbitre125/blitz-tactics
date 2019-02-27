import { dispatch, subscribe, subscribeOnce } from '../../../store'
import { formattedTimeSeconds } from '../../../utils'

const updateIntervalMs = 100  // timer updates this frequently
const rewardThreshold = 10    // combo this many moves to gain time
const rewardMs = 7000         // gain this much time at the reward threshold
const comboRewardMs = 3000    // gain this much more time for maintaining combo
const penaltyMs = 30000       // lose this much time per mistake

// Amount of time spent so far
//
export default class Timer {

  get el() {
    return document.querySelector(`.current-progress .timer`)
  }

  constructor() {
    this.initialTimeMs = parseInt(this.el.textContent[0]) * 60 * 1000 + 500
    this.timeModifierMs = 0
    this.comboSize = 0
    this.timerInterval = false
    subscribeOnce('move:try', () => this.startTimer())
    subscribe({
      'move:success': () => this.incrementCombo(),
      'move:fail': () => this.loseTime(),
      'puzzles:complete': () => this.notifyCompletion(),
    })
  }

  timeLeftMilliseconds() {
    return this.initialTimeMs - (Date.now() - this.startTime) + this.timeModifierMs
  }

  incrementCombo() {
    this.comboSize += 1
    this.gainTime()
  }

  // gain time with higher combos
  gainTime() {
    if (this.comboSize % rewardThreshold !== 0) {
      return
    }
    this.timeModifierMs += rewardMs
    this.timeModifierMs += (comboRewardMs * (this.comboSize / rewardThreshold - 1))
    this.el.classList.add(`rewarded`)
    setTimeout(() => this.el.classList.remove(`rewarded`), 250)
  }

  // lose time when making mistakes
  loseTime() {
    this.comboSize = 0
    this.timeModifierMs -= penaltyMs
    this.el.classList.add(`penalized`)
    setTimeout(() => this.el.classList.remove(`penalized`), 250)
  }

  startTimer() {
    this.el.classList.remove(`stopped`)
    this.startTime = Date.now()
    this.timerInterval = setInterval(() => {
      const timeLeft = this.timeLeftMilliseconds()
      if (timeLeft <= 0) {
        this.stopTimer()
        this.notifyCompletion()
      } else {
        this.displayTimeLeft(formattedTimeSeconds(timeLeft))
      }
    }, updateIntervalMs)
  }

  stopTimer() {
    this.el.classList.add(`stopped`)
    clearInterval(this.timerInterval)
    this.displayTimeLeft(`0:00`)
  }

  displayTimeLeft(timeLeftText) {
    this.el.textContent = timeLeftText
  }

  notifyCompletion() {
    dispatch("timer:stopped")
  }
}
