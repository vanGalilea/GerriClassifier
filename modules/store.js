import { action, observable, computed } from 'mobx'

let store = null;

class Store {
    constructor(isServer, lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}

export const initStore = (isServer, lastUpdate = Date.now())=> {
    if (isServer && typeof window === 'undefined') {
        return new Store(isServer, lastUpdate)
    }

    if (store === null) {
        store = new Store(isServer, lastUpdate)
    }
    return store
};