function Compile(el, value) {
    this.$vm = value
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
        this.compileElement(this.$el)
    }
}

Compile.prototype.compileElement = function (el) {
    let self = this
    let childNodes = el.childNodes

    ;[].slice.call(childNodes).forEach(node => {
        let text = node.textContent
        let reg = /\{\{((?:.|\n)+?)\}\}/
        // 处理element节点
        if (self.isElementNode(node)) {
            self.compile(node)
        } else if (self.isTextNode(node) && reg.test(text)) { // 处理text节点
            self.compileText(node, RegExp.$1.trim())
        }
        // 解析子节点包含的指令
        if (node.childNodes && node.childNodes.length) {
            self.compileElement(node)
        }
    })
}

Compile.prototype.compile = function (node) {
    let nodeAttrs = node.attributes
    let self = this

    ;[].slice.call(nodeAttrs).forEach(attr => {
        var attrName = attr.name
        if (self.isDirective(attrName)) {
            let exp = attr.value
            let dir = attrName.substring(2)
            if (self.isEventDirective(dir)) {
                compileUtil.eventHandler(node, self.$vm, exp, dir)
            } else {
                compileUtil[dir] && compileUtil[dir](node, self.$vm, exp)
            }
            node.removeAttribute(attrName)
        }
    });
}

Compile.prototype.compileText = function (node, exp) {
    compileUtil.text(node, this.$vm, exp);
}

Compile.prototype.isDirective = function (attr) {
    return attr.indexOf('v-') === 0
}

Compile.prototype.isEventDirective = function (dir) {
    return dir.indexOf('on') === 0;
}

Compile.prototype.isElementNode = function (node) {
    return node.nodeType === 1
}

Compile.prototype.isTextNode = function (node) {
    return node.nodeType === 3
}

// 指令处理集合
var compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },
    html: function (node, vm, exp) {
        this.bind(node, vm, exp, 'html')
    },
    model: function (node, vm, exp) {
        this.bind(node, vm, exp, 'model')

        let self = this, val = this._getVMVal(vm, exp)
        node.addEventListener('input', function (e) {
            var newValue = e.target.value
            if (val === newValue) {
                return
            }
            self._setVMVal(vm, exp, newValue)
            val = newValue
        });
    },
    class: function (node, vm, exp) {
        this.bind(node, vm, exp, 'class')
    },
    bind: function (node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater']
        updaterFn && updaterFn(node, this._getVMVal(vm, exp))
        new Watcher(vm, exp, function (value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue)
        })
    },
    eventHandler: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },
    _getVMVal: function (vm, exp) {
        var val = vm
        exp = exp.split('.')
        exp.forEach(function (k) {
            val = val[k]
        })
        return val
    },
    _setVMVal: function (vm, exp, value) {
        var val = vm;
        exp = exp.split('.')
        exp.forEach(function (k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k]
            } else {
                val[k] = value
            }
        })
    }
}

var updater = {
    textUpdater: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value
    },
    htmlUpdater: function (node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value
    },
    classUpdater: function (node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '')
        var space = className && String(value) ? ' ' : ''
        node.className = className + space + value
    },
    modelUpdater: function (node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value
    }
}