import store from 'store'

export default {
    save:(key,data)=>{
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(key,data)
    },
    get:(key)=>{
        // return JSON.parse(localStorage.getItem(USER_KEY)||'{}')
        return store.get(key)||{}
    },
    remove:(key)=>{
        // localStorage.removeItem(USER_KEY)
        store.remove(key)
    }
}
export const key={
    TOKEN:'TOKEN'
}