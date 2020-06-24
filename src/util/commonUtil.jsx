
export const getStrDataFromJson=(value)=>{
    if (value === null || value === '') {
        return null
    }
    try {
        return JSON.stringify(value)
    } catch (e) {
        return value
    }
}

export const getJsonDataFromStr=(value)=>{
    if (value === null) {
        return null
    }
    try {
        return JSON.parse(value)
    } catch (e) {
        return value
    }
}

export const getProjectIdByPath=(path)=>{
    const regExp = /^\/project\/(.+?)\/\w+/
    if(regExp.test(path)){
        return path.match(regExp)[1]
    }else{
        return null
    }
}