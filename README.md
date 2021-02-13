
# var_dump
PHP's var_dump function for JavaScript.

```js
var_dump({
    aString: "hello",
    anArray: ["world!"],
    anObject: {
        anotherArray: [1, 2]
    },
    aNumber: 102,
    aBigNumber: 102n,
    aFunction: function (a, b, c) {},
    aHtmlValue: document.createElement("div")
});
```
will print...
```
object(Object) (7) {
    ["aString"] => string(5) "hello"
    ["anArray"] => array(1) {
        [0] => string(6) "world!"
    }
    ["anObject"] => object(Object) (1) {
        ["anotherArray"] => array(2) {
            [0] => number(1)
            [1] => number(2)
        }
    }
    ["aNumber"] => number(102)
    ["aBigNumber"] => bigint(102)
    ["aFunction"] => function {
        [name] => aFunction
        [parameters] => array(3) {
            [0] => string(1) "a"
            [1] => string(1) "b"
            [2] => string(1) "c"
        }
    }
    ["aHtmlValue"] => HTMLElement(DIV)
} debugger eval code:6:21

```
