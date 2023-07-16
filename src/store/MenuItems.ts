import { makeObservable, observable, computed, action, toJS } from 'mobx'
import { createContext } from 'react'
class MenuItems {
  sourceData = observable.array<Menu>([])

  constructor() {
    makeObservable(this, {
      sourceData: observable,
      value: computed,
      update: action,
    })
  }
  get value() {
    return toJS(this.sourceData)
  }
  update(value: Menu[]) {
    this.sourceData.clear()
    for (const item of value) {
      this.sourceData.push(item)
    }
  }
}

export const menuItems = new MenuItems()
export const MenuContext = createContext<MenuItems>(menuItems)
