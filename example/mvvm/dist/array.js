const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

/**
 * 数组的变异方法
 */
;[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
.forEach(function (method) {
    // 缓存数组原始方法
    var original = arrayProto[method]
    def(arrayMethods, method, function mutator() {
        var i = arguments.length
        var args = new Array(i)
        while (i--) {
            args[i] = arguments[i]
        }
        console.log('数组变动')
        return original.apply(this, args)
    })
})