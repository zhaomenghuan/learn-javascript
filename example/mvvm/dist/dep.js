let uid = 0

function Dep() {
    this.id = uid++
    this.subs = []
}

Dep.target = null

/**
 * 添加一个订阅者
 *
 * @param {Directive} sub
 */
Dep.prototype.addSub = function (sub) {
    this.subs.push(sub)
}

/**
 * 移除一个订阅者
 *
 * @param {Directive} sub
 */
Dep.prototype.removeSub = function (sub) {
    let index = this.subs.indexOf(sub);
    if (index !== -1) {
        this.subs.splice(index, 1);
    }
}

/**
 * 将自身作为依赖添加到目标watcher
 */
Dep.prototype.depend = function () {
    Dep.target.addDep(this)
}

/**
 * 通知数据变更
 */
Dep.prototype.notify = function () {
    var subs = toArray(this.subs)
    // stablize the subscriber list first
    for (var i = 0, l = subs.length; i < l; i++) {
        // 执行订阅者的update更新函数
        subs[i].update()
    }
}