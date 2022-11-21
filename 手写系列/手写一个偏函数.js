/**
B站：算法猫叔
在计算机科学中，局部应用是指固定一个函数的一些参数，然后产生另一个更小元的函数。

什么是元？元是指函数参数的个数，比如一个带有两个参数的函数被称为二元函数

function add(a, b) {
    return a + b;
}

// 执行 add 函数，一次传入两个参数即可
add(1, 2) // 3

// 假设有一个 partial 函数可以做到局部应用
var addOne = partial(add, 1);

addOne(2) // 3
 */
const partial = (fn, ...restArgs) => {
 return (...args) => fn(...restArgs, ...args);
};

function add(a, b, c) {
 return a + b + c;
};

// 测试
console.log(add(1,2,3)); // 6

// 使用偏函数
var addOne = partial(add, 1);
console.log(addOne(2,3)); // 6