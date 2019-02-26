import _ from 'underscore'
import Backbone from 'backbone'

interface EventMap {
  [event: string]: Backbone.EventHandler
}

const dispatcher = _.clone(Backbone.Events)
const listener = _.clone(Backbone.Events)

const dispatch = (eventName: string, ...data) => {
  dispatcher.trigger(eventName, ...data)
}

const subscribe = (eventMap: EventMap) => {
  Object.entries(eventMap).forEach(row => {
    const eventName: string = row[0]
    const handler: Backbone.EventHandler = row[1]
    listener.listenTo(dispatcher, eventName, handler)
  })
}

const subscribeOnce = (eventName: string, callback: Function) => {
  listener.listenToOnce(dispatcher, eventName, callback)
}

export {
  dispatch,
  subscribe,
  subscribeOnce,
}
