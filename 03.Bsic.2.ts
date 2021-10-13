// 03 | 复杂基础类型

// 数组
// 因为 TypeScript 的数组和元组转译为 JavaScript 后都是数组，所以这里我们把数组和元组这两个类型整合到一起，方便更好地对比学习。

// 数组类型（Array）
// 在 TypeScript 中，我们也可以像 JavaScript 一样定义数组类型，并且指定数组元素的类型。
/** 子元素是数字类型的数组 */
let arrayOfNumber: number[] = [1, 2, 3];
/** 子元素是字符串类型的数组 */
let arrayOfString: string[] = ['x', 'y', 'z'];
// 同样，我们也可以使用 Array 泛型定义数组类型
/** 子元素是数字类型的数组 */
// let arrayOfNumber: Array<number> = [1, 2, 3];
/** 子元素是字符串类型的数组 */
// let arrayOfString: Array<string> = ['x', 'y', 'z'];
// 以上两种定义数组类型的方式虽然本质上没有任何区别，但是更推荐使用[]这种形式来定义。一方面可以避免与 JSX 的语法冲突，另一方面可以
// 减少不少代码量。

// 元组类型（Tuple）
// 元组最终的特性是可以限制数组元素的个数和类型，它特别适合用来实现多值返回。
// 我们熟知的一个使用元组的场景是 React Hooks
// 在 JavaScript 中并没有元组的概念，作为一门动态类型语言，它的优势是天然支持多类型元素数组。
// 下面我们使用所熟知的 React Hooks 来介绍 TypeScript 元组的应用场景。
// 比如 useState 的返回值类型是一个元组类型，如下代码所示：
// (state: State) => [State, SetState]
// 元组相较对象而言，不仅为我们实现解构赋值提供了极大便利，还减少了不少代码量，这可能也是 React 官方如此设计核心 Hooks 的重要原因之一。
// 但事实上，许多第三方的 Hooks 往往会出于扩展性、稳定性等考虑，尤其是需要返回的值的个数超过2个时，会更偏向于使用对象作为返回值。

// 特殊类型
// 1.any
// any 指的是一个任意类型，它是官方提供的一个选择性绕过静态类型检测的作弊方式。
// 我们可以对被注解为 any 类型的变量进行任何操作，包括获取事实上并不存在的属性、方法，并且 TypeScript 还无法检测其属性是否存在、类型
// 是否正确。
// 比如我们可以吧任何类型的值赋值给 any 类型的变量，也可以把 any 类型的值赋值给任意类型（除 never 以外）的变量。
// let anything: any = {};
// anything.doAnything(); // 不会提示错误
// anything = 1; // 不会提示错误
// anything = 'x'; // 不会提示错误
// let num: number = anything; // 不会提示错误
// let str: string = anything; // 不会提示错误
// 如果我们不想花费过高的成本为复杂的数据添加类型注解，或者已经引入了缺少类型注解的第三方组件库，这时就可以把这些值全部注解为 any 类型，
// 并告诉 TypeScript 选择性地忽略静态类型检测。
// 尤其是在将一个基于 JavaScript 的应用改造成 TypeScript 的过程中，我们不得不借助 any 来选择性添加和忽略对某些 JavaScript 模块
// 的静态类型检测，直至逐步替换掉所有的 JavaScript。
// any 类型会在对象的调用链中进行传导，即所有 any 类型的任意属性的类型都是 any，如下代码所示：
let anything: any = {};
let z = anything.x.y.z; // z 类型是 any，不会提示错误
z(); // 不会提示错误
// 这里我们需要明白且记住： Any is Hell (Any 是地狱)。
// 从长远来看，使用 any 绝对是一个坏习惯。如果一个 TypeScript 应用中充满了 any，此时静态类型检测基本起不到任何作用，也就是说与直接使用
// JavaScript 没有任何区别。因此，除非有充足的理由，否则我们应该尽量避免使用 any，并且开启禁用隐式 any 的设置。

// 2.unknown
// unknown 是 TypeScript 3.0 中添加的一个类型，它主要用来描述类型并不确定的变量。
// 比如在多个 if else 条件分支场景下，它可以用来接收不同条件下类型各异的返回值的临时变量，如下代码所示：
/* let result: unknown;
if (x) {
    result = x();
} else if (y) {
    result = y();
}... */
// 在 3.0 以前的版本中，只有使用 any 才能满足这种动态类型场景。
// 与 any 不同的是，unknown 在类型上更安全。比如我们可以将任意类型的值赋值给 unknown，但 unknown 类型的值只能赋值给 unknown 或 any,
// 如下代码所示：
// let result: unknown;
// let num: number = result; // 提示 ts(2322)
// let anything: any = result; // 不会提示错误
// 使用 unknown 后，TypeScript 会对它做类型检测。但是，如果不缩小类型（Type Narrowing），我们对 unknown 执行的任何操作都会出现如下
// 所示错误：
// let result: unknown;
// result.toFixed(); // 提示 ts(2571)
// 而所有的类型缩小手段对 unknown 都有效，如下代码所示：
let result: unknown;
if (typeof result === 'number') {
    result.toFixed(); // 此处 hover result 提示类型是 number，不会提示错误
}

// 3.void、undefined、null
// 依照官方的说法，它们实际上并没有太大的用处，尤其是在强烈推荐并要求的 strict 模式下，它们是名副其实的“废柴”。
// 首先我们来说一下 void 类型，它仅适用于表示没有返回值的函数。即如果该函数没有返回值，那它的类型就是 void。
// 在 strict 模式下，声明一个 void 类型的变量几乎没有任何实际用处，因为我们不能把 void 类型的变量值再赋值给除了 any 和 unknown
// 之外的任何类型变量。
// 然后我们说说 undefined 类型和 null 类型，它们是 TypeScript 值与类型关键字同名的唯二例外。但这并不影响它们被称为“废柴”，因为
// 单纯声明 undefined 或者 null 类型的变量也是无比鸡肋，示例如下所示：
// let undeclared: undefined = undefined; // 鸡肋
// let nullable: null = null; // 鸡肋
// undefined 的最大价值主要体现在接口类型上，它表示一个可缺省、未定义的属性。
// 一个稍微有点费解的设计：我们可以把 undefined 值或类型是 undefined 的变量赋值给 void 类型变量，反过来，类型是 void 但值是 undefined
// 的变量不能赋值给 undefined 类型。
/* const userInfo: {
    id?: number;
} = {};
let undeclared: undefined = undefined;
let unusable: void = undefined;
unusable = undeclared; // ok
undeclared = unusable; // ts(2322) */
// null 的价值主要体现在接口定制上，它表明对象或属性可能是空值。尤其是在前后端交互的接口，比如 Java Restful、Graphql，任何涉及查询的
// 属性、对象都可能是 null 空对象，如下代码所示：
/* const userInfo: {
    name: null | string
} = { name: null }; */
// 除此之外，undefined 和 null 类型还具备警示意义，它们可以提醒我们针对可能操作这两种（类型）值的情况做容错处理。
// 我们需要类型守卫（Type Guard）在操作之前判断值的类型是否支持当前的操作。类型守卫既能通过类型缩小影响 TypeScript 的类型检测，也能
// 保障 JavaScript 运行是的安全性，如下代码所示：
const userInfo: {
    id?: number;
    name?: null | string
} = { id: 1, name: 'Captain' };
if (userInfo.id !== undefined) { // Type Guard
    userInfo.id.toFixed(); // id 的类型缩小成 number
}
// 不建议随意使用非空断言来排除值可能为 null 或 undefined 的情况，因为这样很不安全。
userInfo.id!.toFixed(); // ok，但不建议
userInfo.name!.toLowerCase(); // ok，但不建议
// 而比非空断言更安全、类型守卫更方便的做法是使用单问号（Optional Chain）、双问号（空值合并），我们可以使用它们来保障代码的安全性，
// 如下代码所示：
userInfo.id?.toFixed(); // Optional Chain
const myName = userInfo.name?? `my name is ${userInfo.name}`; // 空值合并

// 4.never
// never 表示永远不会发生值的类型，这里举一个实际的场景进行说明。
// 首先，我们定义一个统一抛出错误的函数，代码示例如下
function ThrowError(msg: string): never {
    throw Error(msg);
}
// 以上函数因为永远不会有返回值，所以它的返回值类型就是 never。
// 同样，如果函数代码中是一个死循环，那么这个函数的返回值类型也是 never，如下代码所示：
function InfiniteLoop(): never {
    while (true) {}
}
// never 是所有类型的子类型，它可以给所有类型赋值，如下代码所示：
/* let Unreachable: never = 1; // ts(2322)
Unreachable = 'string'; // ts(2322)
Unreachable = true; // ts(2322)
let num: number = Unreachable;
let str: string = Unreachable;
let bool: boolean = Unreachable; */
// 但是反过来，除了 never 自身以外，其他类型（包括 any 在内的类型）都不能为 never 类型赋值。
// 在恒为 false 的类型守卫条件判断下，变量的类型将缩小为 never(never 是所有其他类型的子类型，所以是类型缩小为 never，而不是变成 never)。
// 因此，条件判断中的相关操作始终会报无法更正的错误（我们可以把这理解为一种基于类型检测的 Dead Code 检测机制），如下代码所示：
/* const str: string = 'string';
if (typeof str === 'number') {
    str.toLowerCase(); // Property 'toLowerCase' does not exist on type 'never'.ts(2339)
} */
// 基于 never 的特性，我们还可以使用 never 实现一些有意思的功能。比如我们可以把 never 作为接口类型下的属性类型，用来禁止写接口下特定
// 的属性，示例代码如下：
/* const props: {
    id: number,
    name?: never
} = {
    id: 1
}
props.name = null; // ts(2322)
props.name = 'str'; // ts(2322)
props.name = 1; // ts(2322) */
// 此时，无论我们给 props.name 赋什么类型的值，它都会提示类型错误，实际效果等同于 name 只读

// 5.object
// object 类型表示非原始类型的类型，即非 number、string、boolean、bigint、symbol、null、undefined 的类型。然而，它也是个没有
// 什么用武之地的类型，如下所示的一个应用场景是用来表示 Object.create 的类型。
/* declare function create(o: object | null): any;
create({}); // ok
create(() => null); // ok
create(2); // ts(2345)
create('string'); // ts(2345) */

// 类型断言（Type Assertion）
// TypeScript 类型检测无法做到绝对智能，毕竟程序不能像人一样思考。有时会碰到我们比 TypeScript 更清楚实际类型的情况，比如下面的例子：
// const arrayNumber: number[] = [1, 2, 3, 4];
// const greaterThan2: number = arrayNumber.find(num => num > 2); // 提示 ts(2322)
// 其中，greaterThan2 一定是一个数字，因为 arrayNumber 中明显有大于 2 的成员，但静态类型对运行时的逻辑无能为力。
// 在 TypeScript 看来，greaterThan2 的类型既可能是数字，也可能是 undefined，所以上面的示例中提示了一个 ts(2322) 错误，此时我们
// 不能把类型 undefined 分配给类型 number。
// 不过，我们可以使用一种笃定的方式————类型断言（类似仅作用在类型层面的强制类型转换）告诉 TypeScript 按照我们的方式做类型检查。
// 比如，我们可以使用 as 语法做类型断言，如下代码所示：
// const arrayNumber: number[] = [1, 2, 3, 4];
// const greaterThan2: number = arrayNumber.find(num => num > 2) as number;
// 又或者是使用尖括号 + 类型的格式做类型断言，如下代码所示：
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = <number>arrayNumber.find(num => num > 2);
// 以上两种方式虽然没有任何区别，但是尖括号格式会与 JSX 产生语法冲突，因此我们更推荐使用 as 语法。
// 注意：类型断言的操作对象必须满足某些约束关系，否则我们将得到一个 ts(2352) 错误，即从类型“源类型”到类型“目标类型”的转换是错误的，
// 因为这两种类型不能充分重叠。
// 类型断言的约束条件：父子、子父类型之间可以使用类型断言进行转换。
// 另外，any 和 unknown 这两个特殊类型属于万金油，因为它们既可以被断言成任何类型，反过来任何类型也都可以被断言成 any 或 unknown。
// 因此，如果我们想强行“指鹿为马”，就可以先把“鹿”断言为 any 或 unknown，然后再把 any 和 unknown 断言为“马”，比如鹿 as any as 马。
// 我们除了可以把特定类型断言成符合约束添加的其他类型之外，还可以使用“字面量值 + as const”语法结构进行常量断言，具体示例如下所示：
/** str 类型是 '"str"' */
let str = 'str' as const;
/** readOnlyArr 类型是 'readonly [0, 1]' */
const readOnlyArr = [0, 1] as const;
// 此外还有一种特殊非空断言，即在值（变量、属性）的后边添加'!'断言操作符，它可以用来排除值为 null、undefined 的情况，具体示例如下：
// let mayNullOrUndefinedOrString: null | undefined | string;
// mayNullOrUndefinedOrString!.toString(); // ok
// mayNullOrUndefinedOrString.toString(); // ts(2531)
// 对于非空断言来说，我们同样应该把它视作和 any 一样危险的选择。
// 在复杂应用场景中，如果我们使用非空断言，就无法保证之前一定非空的值，比如页面中一定存在 id 为 feedback 的元素，数组中一定有满足
// > 2 条件的数字，这些都不会被其他人改变。而一旦保证被改变，错误只会在运行环境中抛出，而静态类型检测是发现不了这些错误的。
// 所以，我们建议使用类型守卫来代替非空断言，比如如下所示的条件判断：
let mayNullOrUndefinedOrString: null | undefined | string;
if (typeof mayNullOrUndefinedOrString === 'string') {
    mayNullOrUndefinedOrString.toString();
}