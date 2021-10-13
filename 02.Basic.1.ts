// 02 | 简单基础类型
// TypeScript 简介
// TypeScript 其实就是类型化的 JavaScript，它不仅支持 JavaScript 的所有特性，还在 JavaScript 的基础上添加了静态类型注解扩展。
// 这里我们举个例子来说明一下，比如 JavaScript 中虽然提供了原始数据类型 string、number，但是它无法检测我们是不是按照约定的类型对
// 变量赋值，而 TypeScript 会对赋值及其他所有操作默认做静态类型检测。
// 因此，从某种意义上来说，TypeScript 其实就是 JavaScript 的超集。
// 在 TypeScript 中，我们不仅可以轻易复用 JavaScript 的代码、最新特性，还能使用可选的静态类型进行检查报错，使得编写的代码更健壮、
// 更易于维护。比如在开发阶段，我们通过 TypeScript 代码转译器就能快速消除很多低级错误。

// 原始类型
// 在 JavaScript 中，原始类型指的是非对象且没有方法的数据类型，它包括 string、number、bingint、boolean、undefined 和 symbol
// 这六种（null 是一个伪原始类型，它在 JavaScript 中实际上是一个对象，且所有的结构化类型都是通过 null 原型链派生而来）。

// 字符串 string
let firstname: string = 'Captain'; // 字符串字面量
let familyname: string = String('S'); // 显式类型转换
let fullname: string = `my name is ${firstname}.${familyname}`; // 模板字符串

// 数字 number
/** 十进制整数 */
let integer: number = 6;
/** 十进制整数 */
let integer2: number = Number(42);
/** 十进制浮点数 */
let decimal: number = 3.14;
/** 二进制整数 */
let binary: number = 0b1010;
/** 八进制整数 */
let octal: number = 0o744;
/** 十六进制整数 */
let hex: number = 0xf00d;

// 如果使用较少的大整数，那么我们可以使用 bigint 类型来表示
let big: bigint = 100n;
// 请注意：虽然 number 和 bigint 都表示数字，但是这两个类型不兼容。

// 布尔值 boolean
/** TypeScript 真香 为 真 */
let TypeScriptIsGreat: boolean = true;
/** TypeScript 太糟糕了 为 否 */
let TypeScriptIsBad: boolean = false;

// Symbol
// 自 ECMAScript 6 起，TypeScript 开始支持新的 Symbol 原始类型，即我们可以通过 Symbol 构造函数，创建一个独一无二的标记；
// 同时，还可以使用 symbol 表示如下代码所示的类型。
let sym1: symbol = Symbol();
let sym2: symbol = Symbol('42');
// 当然，TypeScript 还包含 Number、String、Boolean、Symbol 等类型（注意区分大小写）。
// 特殊说明：请你千万别将它们和小写格式对应的 number、string、boolean、symbol 进行等价。
// 实际上，我们压根使用不到 Number、String、Boolean、Symbol 类型，因为它们并没有什么特殊的用途。这就像我们不必使用 JavaScript
// Number、String、Boolean 等构造函数 new 一个相应的实例一样。

// 静态类型检测
// 在编译时期，静态类型的编程语言即可准确地发现类型错误，这就是静态类型检测的优势。
// 在编译（转译）时期，TypeScript 编译器将通过对比检测变量接收值的类型与我们显式注解的类型，从而检测类型是否存在错误。如果两个类型
// 完全一致，显示检测通过；如果两个类型不一致，它就会抛出一个编译期错误，告知我们编码错误
const trueNum: number = 42;
// const fakeNum: number = '42' // ts(2322) Type 'string' is not assignable to type 'number'

// TypeScript 的语言服务可以和 VS Code 完美集成。因此，在编写代码的同时，我们可以同步进行静态类型检测（无须等到编译后再做检测），
// 极大提升了开发体验和效率。