import Backbone from 'backbone'

import d from '../../dispatcher'

const perfectTiming = 2500
const greatTiming = 5000

// Encouragement when successful, 
// discouragement when making a wrong move
//
export default class MoveStatus extends Backbone.View {

  get el() {
    return ".move-status"
  }

  initialize() {
    this.timeSinceSuccess = Date.now()
    this.listenForEvents()
  }

  listenForEvents() {
    this.listenTo(d, "move:success", () => this.renderSuccess())
    this.listenTo(d, "move:fail", () => this.renderFailure())
    this.listenTo(d, "move:almost", () => this.renderAlmost())
  }

  renderSuccess() {
    let time = Date.now()
    let tDiff = time - this.timeSinceSuccess
    if (tDiff < perfectTiming) {
      this.renderPerfect()
    } else if (tDiff < greatTiming) {
      this.renderGreat()
    } else {
      this.renderGood()
    }
    this.timeSinceSuccess = time
  }

  renderFailure() {
    this.renderFadingMessage('<div class="fail">Try Again</div>')
  }

  renderAlmost() {
    this.renderFadingMessage('<div class="almost">Almost</div>')
  }

  renderPerfect() {
    this.renderFadingMessage('<div class="perfect">Perfect!</div>')
  }

  renderGreat() {
    this.renderFadingMessage('<div class="great">Great!</div>')
  }

  renderGood() {
    this.renderFadingMessage('<div class="good">Good!</div>')
  }

  renderFadingMessage(html) {
    this.$el.removeClass("fade-out")
    this.$el.html(html)
    setTimeout(() => this.$el.addClass("fade-out"), 50)
  }
}
