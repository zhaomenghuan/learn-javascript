const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * 观察者构造函数
 * 
 * @param {Array|Object} value
 * @constructor
 */
function Observer(value) {
    this.value = value
    if (Array.isArray(value)) {
        var augment = hasProto
            ? protoAugment
            : copyAugment
        augment(value, arrayMethods, arrayKeys)
        this.observeArray(value)
    } else {
        this.walk(value)
    }
}

/**
 * 递归调用，为对象绑定getter/setter
 * 
 * @param {Object} obj
 */
Observer.prototype.walk = function (obj) {
    var keys = Object.keys(obj)
    for (var i = 0, l = keys.length; i < l; i++) {
        this.convert(keys[i], obj[keys[i]])
    }
}

/**
 * 观察数组的每一项
 *
 * @param {Array} items
 */
Observer.prototype.observeArray = function (items) {
    for (var i = 0, l = items.length; i < l; i++) {
        observe(items[i])
    }
}

/**
 * 将属性转换为getter/setter
 * 
 * @param {String} key
 * @param {*} val
 */
Observer.prototype.convert = function (key, val) {
    defineReactive(this.value, key, val)
}

/**
 * 创建数据观察者实例
 *
 * @param {*} value
 * @param {Vue} [vm]
 * @return {Observer|undefined}
 * @static
 */
function observe(value) {
    if (!value || typeof value !== 'object') {
        return
    }
    return new Observer(value)
}

/**
 * 定义对象属性的getter/setter
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */
function defineReactive(obj, key, val) {
    var dep = new Dep()

    var property = Object.getOwnPropertyDescriptor(obj, key)
    if (property && property.configurable === false) {
        return
    }

    // 保存对象属性预先定义的getter/setter
    var getter = property && property.get
    var setter = property && property.set

    var childOb = observe(val)
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            let value = getter ? getter.call(obj) : val
            console.log("访问：" + key)
            if (Dep.target) {
                dep.depend();
            }
            return value
        },
        set: function reactiveSetter(newVal) {
            var value = getter ? getter.call(obj) : val
            if (newVal === value) {
                return
            }
            if (setter) {
                setter.call(obj, newVal)
            } else {
                val = newVal
            }
            childOb = observe(newVal)
            // 通知订阅者
            dep.notify()
            console.log('更新：' + key + ' = ' + newVal)
        }
    })
}

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 *
 * @param {Object|Array} target
 * @param {Object} src
 */
function protoAugment(target, src) {
    target.__proto__ = src
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 *
 * @param {Object|Array} target
 * @param {Object} proto
 */

function copyAugment(target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i]
        def(target, key, src[key])
    }
}
