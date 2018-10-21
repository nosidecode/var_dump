
# var_dump
PHP's var_dump function for JavaScript.

```js
var_dump({
    str: "hello",
    arr: ["world!"],
    obj: {
        arr2: [1, 2]
    },
    num: 102,
    func: function () {},
    html: document.createElement("div")
});
```
will return...
```
object(6) {
    ["str"] => string(5) "hello"
    ["arr"] => array(1) {
        [0] => string(6) "world!"
    }
    ["obj"] => object(1) {
        ["arr2"] => array(2) {
            [0] => number(1)
            [1] => number(2)
        }
    }
    ["num"] => number(102)
    ["func"] => function {
        [name] => func
    }
    ["html"] => HTMLElement(DIV)
}
```
