// 05 | 函数类型：返回值类型和参数类型到底如何定义？
// 在 JavaScript 中，函数是构建应用的一块基石，我们可以使用函数抽离可复用的逻辑、抽象模型、封装过程。在 TypeScript 中，虽然
// 有类、命名空间、模块，但是函数同样是最基本、最重要的元素之一。
// 在 TypeScript 里，我们可以通过 function 字面量和箭头函数的形式定义函数，示例如下：
// function add() {}
// const add = () => {}
// 我们还可以显式指定函数参数和返回值的类型，示例如下：
/* const add = (a: number, b: number): number => {
    return a + b;
} */
// 如上述示例中，参数名后的':number'表示参数类型都是数字类型，圆括号后的 ':number' 则表示返回值类型也是数字类型。

// 返回值类型
// 在 JavaScript 中，我们知道一个函数可以没有显式 return，此时函数的返回值应该是 undefined:
/* function fn() {
    // TODO
}
console.log(fn()); // undefined */
// 需要注意的是，在 TypeScript 中，如果我们显式声明函数的返回值类型为 undefined，将会得到如下所示的错误提醒。
/* function fn(): undefined { // ts(2355) A function whose declared type is neither 'void' nor 'any' must return a value.
    // TODO
} */
// 此时，正确的做法是使用 void 类型来表示函数没有返回值的类型（这是“废柴” void 类型唯一有用的场景），示例如下：
/* function fn1(): void {
}
fn1().doSomething(); // ts(2339) Property 'doSomething' does not exist on type 'void'. */
// 我们可以使用类似定义箭头函数的语法来表示函数类型的参数和返回值类型，此时=> 类型仅仅用来定义一个函数类型而不用实现这个函数。
// 需要注意的是，这里的=>与 ES6 中箭头函数的=>有所不同。TypeScript 函数类型中的=>用来表示函数的定义，其左侧是函数的参数类型，
// 右侧是函数的返回值类型；而 ES6 中的=>是函数的实现。
// 如下示例中，我们定义了一个函数类型（这里我们使用了类型别名 type），并且使用箭头函数实现了这个类型。
type Adder = (a: number, b: number) => number; // TypeScript 函数类型定义
const add: Adder = (a, b) => a + b; // ES6 箭头函数
// 这里请注意：右侧的箭头函数并没有显式声明类型注解，不过可以根据上下文类型进行推断。
// 在对象（即接口类型）中，除了使用这种声明语法，我们还可以使用类似对象属性的简写语法来声明函数类型的属性，如下代码所示：
interface Entity {
    add: (a: number, b: number) => number;
    del(a: number, b: number): number;
}
const entity: Entity = {
    add: (a, b) => a + b,
    del(a, b) {
        return a - b;
    }
};
// 在某种意义上来说，这两种形式都是等价的。但是很多时候，我们不必或者不能显式地指明返回值的类型，这就涉及可缺省和可推断的返回值类型

// 可缺省和可推断的返回值类型
// 幸运的是，函数返回值的类型可以在 TypeScript 中被推断出来，即可缺省。
// 函数内是一个相对独立的上下文环境，我们可以根据入参对值加工计算，并返回新的值。从类型层面看，我们也可以通过类型推断加工计算入参的类型，
// 并返回新的类型，示例如下：
function computeTypes(one: string, two: number) {
    const nums = [two];
    const strs = [one];
    return {
        nums,
        strs
    }; // 返回 { nums: number[]; strs: string[] } 的类型
}
// 请记住：这是一个很重要也很有意思的特性，函数返回值的类型推断结合泛型可以实现特别复杂的类型计算（本质是复杂的类型推断，这里称之为计算
// 是为了表明其复杂性），比如 Redux Model 中 State、Reducer、Effect 类型的关联。
// 一般情况下，TypeScript 中的函数返回值类型是可以缺省和推断出来的，但是有些特例需要我们显式声明返回值类型，比如 Generator 函数的返回值。

// Generator 函数的返回值
// ES6 中新增的 Generator 函数在 TypeScript 中也有对应的类型定义。
// Generator 函数返回的是一个 Iterator 迭代器对象，我们可以使用 Generator 的同名接口泛型或者 Iterator 的同名接口泛型表示返回值
// 的类型（Generator 类型继承了 Iterator 类型），示例如下：
type AnyType = boolean;
type AnyReturnType = string;
type AnyNextType = number;
function *gen(): Generator<AnyType, AnyReturnType, AnyNextType> {
    const nextValue = yield true; // nextValue 类型是 number，yield 后必须是 boolean 类型
    return `${nextValue}`; // 必须返回 string 类型
}
// 注意：TypeScript 3.6 之前的版本不支持指定 next、return 的类型，所以在某些有点历史的代码中，我们可能会看到 Generator 和 Iterator
// 类型不一样的表述。

// 参数类型
// 了解了定义函数的基本语法以及返回值类型后，我们再来详细看一下可选参数、默认参数、剩余参数的几个特性。

// 可选参数和默认参数
// 在实际工作中，我们可能经常碰到函数参数可传可不传的情况，当然 TypeScript 也支持这种函数类型表达，如下代码所示：
/* function log(x?: string) {
    return x;
}
log(); // => undefined
log('hello world'); // => hello world */
// 在上述代码中，我们在类型标注的:前添加?表示log函数的参数 x 就是可缺省的。
// 也就是说参数 x 的类型可能是 undefined(调用 log 时不传入实参)类型或者是 string 类型（调用 log 传入 'hello world'实参），那是不是
// 意味着可缺省和类型是 undefined 等价呢？我们来看看以下的示例：
/* function log(x?: string) {
    console.log(x);
}
function log1(x: string | undefined) {
    console.log(x);
}
log();
log(undefined);
log1(); // ts(2554) Expected 1 arguments, but got 0
log1(undefined); */
// 答案显而易见：这里的?:表示参数可以缺省、可以不传，也就是说调用函数时，我们可以不显式传入参数。但是，如果我们声明了参数类型为 xxx | undefined
// （这里使用了联合类型），就表示函数参数是不可缺省且类型必须是 xxx 或者 undefined。
// 因此，在上述代码中，log1 函数如果不显式传入函数的参数，TypeScript 就会报一个 ts(2554) 的错误，即函数需要1个参数，但是我们只传入了
// 0个参数。
// 在 ES6 中支持函数默认参数的功能，而 TypeScript 会根据函数的默认参数的类型来推断函数参数的类型，示例如下：
/* function log(x = 'hello') {
    console.log(x);
}
log(); // => 'hello'
log('hi'); // => 'hi'
log(1); // ts(2345) Argument of type '1' is not assignable to parameter of type 'string | undefined' */
// 在上述示例中，根据函数的默认参数 'hello' ，TypeScript 推断出了 x 的类型为 string | undefined。
// 当然，对于默认参数，TypeScript 也可以显式声明参数的类型（一般默认参数的类型是参数类型的子集时，我们才需要这么做）。不过，
// 此时的默认参数只起到参数默认值的作用，如下代码所示：
/* function log1(x: string = 'hello') {
    console.log(x);
}
// ts(2322) Type 'string' is not assignable to type 'number'
function log2(x: number = 'hello') {
    console.log(x);
}
log2();
log2(1);
log2('1'); // ts(2345) Argument of type '"1"' is not assignable to parameter of type 'number | undefined' */
// 上例函数 log2 中，我们显式声明了函数参数 x 的类型为 number，表示函数参数 x 的类型可以不传或者是 number 类型。因此，如果我们
// 将默认值设置为字符串类型，编译器就会抛出一个 ts(2322) 的错误。
// 同理，如果我们将函数的参数传入了字符串类型，编译器也会抛出一个 ts(2345) 的错误。
// 这里请注意：函数的默认参数类型必须是参数类型的子类型，下面我们看一下如下具体示例：
function log3(x: number | string = 'hello') {
    console.log(x);
}
// 在上述代码中，函数 log3 的函数参数 x 的类型为可选的联合类型 number | string，但是因为默认参数字符串类型是联合类型 number | string
// 的子类型，所以 TypeScript 也会检查通过。

// 剩余参数
// 在 ES6 中，JavaScript 支持函数参数的剩余参数，它可以吧多个参数收集到一个变量中。同样，在 TypeScript 中也支持这样的参数类型定义，
// 如下代码所示：
/* function sum(...nums: number[]) {
    return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2); // => 3
sum(1, 2, 3); // => 6
sum(1, '2'); // ts(2345) Argument of type 'string' is not assignable to parameter of type 'number' */
// 在上述代码中，sum 是一个求和的函数，...nums 将函数的所有参数收集到了变量 nums 中，而 nums 的类型应该是 number[]，表示所有被求和
// 的参数是数字类型。因此，sum(1, '2')抛出了一个 ts(2345) 的错误，因为参数 '2' 并不是 number 类型。
// 如果我们将函数参数 nums 聚合的类型定义为 (number | string)[]，如下代码所示：
function sum(...nums: (number | string)[]): number {
    return nums.reduce<number>((a, b) => a + Number(b), 0);
}
sum(1, '2', 3); // 6
// 那么，函数的每一个参数的类型就是联合类型 number | string，因此 sum(1, '2', 3)的类型检查也就通过了。
// 介绍完函数的参数，我们再来了解一下函数中另外一个重要的知识点 this。

// this
// 众所周知，在 JavaScript 中，函数 this 的指向一直是一个令人头痛的问题。因为 this 的值需要等到函数被调用时才能被确定，更别说通过一些
// 方法还可以改变 this 的指向。也就是说 this 的类型不固定，它取决于执行时的上下文。
// 但是，使用了 TypeScript 后，我们就不用担心这个问题了。通过指定 this 的类型（严格模式下，必须显式指定 this 的类型），当我们错误使用
// 了 this，TypeScript 就会提示我们，如下代码所示：
/* function say() {
    console.log(this.name); // ts(2683) 'this' implicitly has type 'any' because it does not have a type annotation
}
say(); */
// 在上述代码中，如果我们直接调用 say 函数，this 应该指向全局 window 或 global（Node 中）。但是，在 strict 模式下的 TypeScript 中，
// 它会提示 this 的类型是 any，此时就需要我们手动显式指定类型了。
// 那么，在 TypeScript 中，我们应该如何声明 this 的类型呢？
// 在 TypeScript 中，我们只需要在函数的第一个参数中声明 this 指代的对象（即函数被调用的方式）即可，比如最简单的作为对象的方法的 this
// 指向，如下代码所示：
function say(this: Window, name: string) {
    console.log(this.name);
}
window.say = say;
window.say('hi');
const obj = {
    say
};
obj.say('hi'); // ts(2684) The 'this' context of type '{ say: (this: Window, name: string) => void; }' is not assignable to method's 'this' of type 'Window'.
// 在上述代码中，我们在 window 对象上增加 say 的属性为函数 say。那么调用 window.say() 时，this 指向即为 window 对象。
// 调用 obj.say() 后，此时 TypeScript 检测到 this 的指向不是 window，于是抛出了如下所示的一个 ts(2684) 错误。
say('captain'); // ts(2684) The 'this' context of type 'void' is not assignable to method's 'this' of type 'Window'
// 需要注意的是，如果我们直接调用 say()，this 实际上应该指向全局变量 window，但是因为 TypeScript 无法确定 say 函数被谁调用，所以
// 将 this 的指向默认为 void，也就提示了一个 ts(2684)错误。
// 此时，我们可以通过调用 window.say() 来避免这个错误，这也是一个安全的设计。因为在 JavaScript 的严格模式下，全局作用域函数中 this 的
// 指向是 undefined。
// 同样，定义对象的函数属性时，只要实际调用中 this 的指向与指定的 this 指向不同，TypeScript 就能发现 this 指向的错误，示例代码如下：
interface Person {
    name: string;
    say(this: Person): void;
}
const person: Person = {
    name: 'captain',
    say() {
        console.log(this.name);
    }
};
const fn = person.say;
fn(); // ts(2684) The 'this' context of type 'void' is not assignable to method's 'this' of type 'Person'.
// 注意：显式注解函数中的 this 类型，它表面上占据了第一个形参的位置，但并不意味着函数真的多了一个参数，因为 TypeScript 转译为 JavaScript
// 后，“伪形参” this 会被抹掉，这算是 TypeScript 为数不多的特有语法。
// 当然，初次接触这个特性时让人费解，这就需要我们把它铭记于心。前边的 say 函数转译为 JavaScript 后，this 就会被抹掉，如下代码所示：
/* function say(name) {
    console.log(this.name)
} */
// 同样，我们也可以显式限定类函数属性中的 this 类型，TypeScript 也能检查出错误的使用方式，如下代码所示：
class Component {
    onClick(this: Component) {}
}
const component = new Component();
interface UI {
    addClickListener(onClick: (this: void) => void): void;
}
const ui: UI = {
    addClickListener() {}
};
ui.addClickListener(new Component().onClick); // ts(2345)
// 上面示例中，我们定义的 Component 类的 onClick 函数属性（方法）显式指定了 this 类型是 Component，在作为入参传递给 ui 的 addClickListener
// 方法中，它指定的 this 类型是 void，两个 this 类型不匹配，所以抛出了一个 ts(2345) 错误。
// 此外，在链式调用风格的库中，使用 this 也可以很方便地表达出其类型，如下代码所示：
class Container {
    private val: number;
    constructor(val: number) {
        this.val = val;
    }
    map(cb: (x: number) => number): this {
        this.val = cb(this.val);
        return this;
    }
    log(): this {
        console.log(this.val);
        return this;
    }
}
const instance = new Container(1)
    .map((x) => x + 1)
    .log() // => 2
    .map((x) => x * 3)
    .log(); // => 6
// 因为 Container 类中 map、log 等函数属性（方法）未显式指定 this 类型，默认类型是 Container，所以以上方法在被调用时返回的类型
// 也是 Container，this 指向一直是类的实例，它可以一直无限地被链式调用。
// 介绍完函数中 this 的指向和类型后，再来了解一下它的另外一个特性函数多态（函数重载）。

// 函数重载
// JavaScript 是一门动态语言，针对同一个函数，它可以有多种不同类型的参数与返回值，这就是函数的多态。
// 而在 TypeScript 中，也可以相应地表达不同类型的参数和返回值的函数，如下代码所示：
/* function convert(x: string | number | null): string | number | -1 {
    if (typeof x === 'string') {
        return Number(x);
    }
    if (typeof x === 'number') {
        return String(x);
    }
    return -1;
}
const x1 = convert('1'); // => string | number
const x2 = convert(1); // => string | number
const x3 = convert(null); // => string | number */
// 在上述代码中，我们把 convert 函数的 string 类型的值转换为 number 类型，number 类型转换为 string 类型，而将 null 类型转换为数字
// -1。此时，x1、x2、x3 的返回值类型都会被推断成 string | number。
// 那么，有没有一种办法可以更精确地描述参数与返回值类型约束关系的函数类型呢？有，这就是函数重载（Function Overload），如下实例中1~3行
// 定义了三种各部相同的函数类型列表，并描述了不同的参数类型对应不同的返回值类型，而从第4行开始才是函数的实现。
/* function convert(x: string): number;
function convert(x: number): string;
function convert(x: null): -1;
function convert(x: string | number | null): any {
    if (typeof x === 'string') {
        return Number(x);
    }
    if (typeof x === 'number') {
        return String(x);
    }
    return -1;
}
const x1 = convert('1'); // => number
const x2 = convert(1); // => string
const x3 = convert(null); // -1 */
// 注意：函数重载列表的各个成员（即示例中的 1 ~ 3 行）必须是函数实现（即示例中的第 4 行）的子集，例如
// “function convert(x: string): number”是“function convert(x: string | number | null): any”的子集。
// 在 convert 函数被调用时，TypeScript 会从上到下查找函数重载列表中与入参类型匹配的类型，并优先使用第一个匹配的重载定义。因此，我们需要
// 把最精确的函数重载放到前面。例如我们在第 14 行传入了字符串 '1'，查找到第 1 行即匹配，而第 15 行传入了数字 1，则查找到第 2 行匹配。
interface P1 {
    name: string;
}
interface P2 extends P1 {
    age: number;
}
/* function convert(x: P1): number;
function convert(x: P2): string;
function convert(x: P1 | P2): any {}
const x1 = convert({ name: '' } as P1); // => number
const x2 = convert({ name: '', age: 18 } as P2); //  => number */
// 因为 P2 继承自 P1，所以类型为 P2 的参数会和类型为 P1 的参数一样匹配到第一个函数重载，此时 x1、x2 的返回值都是 number。
function convert(x: P2): string;
function convert(x: P1): number;
function convert(x: P1 | P2): any {}
const x1 = convert({ name: '' } as P1); // => number
const x2 = convert({ name: '', age: 18 } as P2); // => string
// 而我们只需要将函数重载列表的顺序调换一下，类型为 P2 和 P1 的参数就可以分别匹配到正确的函数重载了

// 类型谓词（is）
// 在 TypeScript 中，函数还支持另外一种特殊的类型描述，如下示例 ：
function isString(s: unknown): s is string { // 类型谓词
    return typeof s === 'string';
}
function isNumber(n: number) {
    return typeof n === 'number';
}
function operator(x: unknown) {
    if (isString(x)) { // ok x 类型缩小为 string
    }
    if (isNumber(x)) { // ts(2345) unknown 不能赋值给 number
    }
}
// 在上述代码中，在添加返回值类型的地方，我们通过“参数名 + is + 类型”的格式明确表明了参数的类型，进而引起类型缩小，
// 所以类型谓词函数的一个重要的应用场景是实现自定义类型守卫。

// 函数是 JavaScript 和 TypeScript 中极其重要的基础部分，无论是面向过程，还是面向对象编程，都离不开函数的抽象、封装。
// 静态类型的加持，使得 TypeScript 中的函数相较于 JavaScript 来说，变得更加稳定、精确、安全。