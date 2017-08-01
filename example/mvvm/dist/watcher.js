/**
 * 观察者对象
 *
 * @param {Vue} vm
 * @param {String|Function} expOrFn
 * @param {Function} cb
 * @constructor
 */

function Watcher(vm, expOrFn, cb) {
    this.vm = vm
    this.cb = cb
    this.depIds = {}
    if (typeof expOrFn === 'function') {
        this.getter = expOrFn
    } else {
        this.getter = this.parseExpression(expOrFn)
    }
    this.value = this.get()
}

/**
 * 收集依赖
 */

Watcher.prototype.get = function () {
    // 当前订阅者(Watcher)读取被订阅数据的最新更新后的值时，通知订阅者管理员收集当前订阅者
    Dep.target = this
    // 触发getter，将自身添加到dep中
    const value = this.getter.call(this.vm, this.vm)
    // 依赖收集完成，置空，用于下一个Watcher使用
    Dep.target = null
    return value
}

Watcher.prototype.addDep = function (dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
        dep.addSub(this)
        this.depIds[dep.id] = dep
    }
}

/**
 * 依赖变动更新
 *
 * @param {Boolean} shallow
 */

Watcher.prototype.update = function () {
    this.run()
}

Watcher.prototype.run = function () {
    var value = this.get()
    if (value !== this.value) {
        var oldValue = this.value
        this.value = value
        // 将newVal, oldVal挂载到MVVM实例上
        this.cb.call(this.vm, value, oldValue)
    }
}

Watcher.prototype.parseExpression = function (exp) {
    if (/[^\w.$]/.test(exp)) {
        return
    }

    var exps = exp.split('.')
    
    return function(obj) {
        for (var i = 0, len = exps.length; i < len; i++) {
            if (!obj) return
            obj = obj[exps[i]]
        }
        return obj
    }
}