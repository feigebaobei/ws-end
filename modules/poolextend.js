let poolextend = (target, source, flag) => {
    for (let k in source) {
        if (source.hasOwnProperty(k)) {
            flag ? (target[k] = source[k]) : (target[k] === void 0 && (target[k] = source[k]))
        }
    }
    return target
}
module.exports = poolextend