/**
 * @class 双向绑定类 MVVM
 * @param {[type]} options [description]
 */
function MVVM(options) {
    this.$options = options || {}
    // 简化了对data的处理
    let data = this._data = this.$options.data
    // 将所有data最外层属性代理到Vue实例上
    Object.keys(data).forEach(key => this._proxy(key))
    // 监听数据
    observe(data)
    new Compile(options.el || document.body, this)
}

MVVM.prototype.$watch = function (expOrFn, cb) {
    new Watcher(this, expOrFn, cb)
}

MVVM.prototype._proxy = function (key) {
    Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get: () => this._data[key],
        set: (val) => {
            this._data[key] = val
        }
    })
}