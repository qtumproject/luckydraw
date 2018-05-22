import store from 'store'

window.store = store

export default class LuckyDraw {
  static get KEY_PREFIX() {
    return 'luckyDraw_'
  }
  static get ALL_NAMES_KEY() {
    return LuckyDraw.KEY_PREFIX + 'all'
  }
  constructor(names) {
    this.allNames = names || []
    this.names = []
    this.drawnNames = []
    if (this.allNames.length === 0) {
      this.allNames = store.get(LuckyDraw.ALL_NAMES_KEY) || []
    } else {
      store.set(LuckyDraw.ALL_NAMES_KEY, LuckyDraw.allNames)
    }
    this.allNames.forEach(name => {
      if (store.get(LuckyDraw.KEY_PREFIX + name)) {
        this.drawnNames.push(name)
      } else {
        this.names.push(name)
      }
    })
  }
  next() {
    const index = Math.random() * this.names.length | 0
    const name = this.names[index]
    if (!name) {
      return false
    }
    this.names.splice(index, 1)
    this.drawnNames.push(name)
    store.set(LuckyDraw.KEY_PREFIX + name, name)
    return {
      index,
      name
    }
  }
  reset() {
    this.names = this.allNames.slice()
    this.drawnNames = []
    store.each((name, key) => {
      if (key.indexOf(LuckyDraw.KEY_PREFIX) > -1) {
        store.remove(key)
      }
    })
    store.set(LuckyDraw.ALL_NAMES_KEY, this.allNames)
  }
  update(names) {
    this.allNames = names
    this.reset()
  }
  getRemained() {
    return this.names
  }
  getDrawn() {
    return this.drawnNames
  }
  getAll() {
    return this.allNames
  }
}
