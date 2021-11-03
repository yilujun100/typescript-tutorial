// 10 | 泛型：如何正确使用泛型约束类型变量？
// 如今，TypeScript 可谓是前端必须掌握的基本技能之一，而泛型则是 TypeScript 中非常基本、非常精华（有挑战）的特性，属于 TypeScript 入门
// （重在基础知识）和进阶（重在应用实践）之间衔接和升华的内容。

// 什么是泛型？
// 关于什么是泛型这个问题不是太好回答，比如在面试中，如果有候选人反过来问我这个问题，可能我也给不出一个特别标准的答案。
// 不过，我们可以借用 Java 中泛型的释义来回答这个问题：泛型指的是类型参数化，即将原来某种具体的类型进行参数化。和定义函数参数一样，我们可以
// 给泛型定义若干个类型参数，并在调用时给泛型传入明确的类型参数。设计泛型的目的在于有效约束类型成员之间的关系，比如函数参数和返回值、类或者
// 接口成员和方法之间的关系。

// 泛型类型参数
// 泛型最常用的场景是用来约束函数参数的类型，我们可以给函数定义若干个被调用时才会传入明确类型的参数。
// 比如以下定义的一个 reflect 函数 ，它可以接收一个任意类型的参数，并原封不动地返回参数的值和类型，那我们该如何描述这个函数呢？好像得用上
// unknown 了（其实我想说的是 any，因为 any is 魔鬼，所以还是用 unknown 吧）。
/* function reflect(param: unknown) {
    return param;
}
const str = reflect('string'); // str 类型是 unknown
const num = reflect(1); // num 类型 unknown */
// 此时，reflect 函数虽然可以接收一个任意类型的参数并原封不动地返回参数的值，不过返回值类型不符合我们的预期。因为我们希望返回值类型与入参
// 类型一一对应（比如 number 对 number、string 对 string），而不是无论入参是什么类型，返回值一律是 unknown。
// 此时，泛型正好可以满足这样的诉求，那如何定义一个泛型参数呢？首先，我们把参数 param 的类型定义为一个（类型层面的）参数、变量，而不是一个
// 明确的类型，等到函数调用时再传入明确的类型。
// 比如我们可以通过尖括号 <> 语法给函数定义一个泛型参数 P，并指定 param 参数的类型为 P ，如下代码所示：
/* function reflect<P>(param: P) {
    return param;
} */
// 这里我们可以看到，尖括号中的 P 表示泛型参数的定义，param 后的 P 表示参数的类型是泛型 P（即类型受 P 约束）。
// 我们也可以使用泛型显式地注解返回值的类型，虽然没有这个必要（因为返回值的类型可以基于上下文推断出来）。比如调用如下所示的 reflect 时，
// 我们可以通过尖括号 <> 语法给泛型参数 P 显式地传入一个明确的类型。
function reflect<P>(param: P): P {
    return param;
}
// 然后在调用函数时，我们也通过 <> 语法指定了如下所示的 string、number 类型入参，相应地，reflectStr 的类型是 string，reflectNum 的
// 类型是 number。
const reflectStr = reflect<string>('string'); // str 类型是 string
const reflectNum = reflect<number>(1); // num 类型 number
// 另外，如果调用泛型函数时受泛型约束的参数有传值，泛型参数的入参可以从参数的类型中进行推断，而无须再显式指定类型（可缺省），因此上边的示例
// 可以简写为如下示例：
const reflectStr2 = reflect('string'); // str 类型是 string
const reflectNum2 = reflect(1); // num 类型 number
// 泛型不仅可以约束函数整个参数的类型，还可以约束参数属性、成员的类型，比如参数的类型可以是数组、对象，如下示例：
function reflectArray<P>(param: P[]) {
    return param;
}
const reflectArr = reflectArray([1, '1']); // reflectArr 是 (string | number)[]
// 这里我们约束了 param 的类型是数组，数组的元素类型是泛型入参。
// 通过泛型，我们可以约束函数参数和返回值的类型关系。举一个我们比较熟悉的实际场景 React Hooks useState 为例，如下示例中，第 51 行 return
// 的元组（因为 useState 返回的是长度为 2、元素类型固定的数组）的第一个元素的类型就是泛型 S，第二个函数类型元素的参数类型也是泛型 S。
function useState<S>(state: S, initialValue?: S) {
    return [state, (s: S) => void 0] as unknown as [S, (s: S) => void];
}
// 注意：函数的泛型入参必须和参数/参数成员建立有效的约束关系才有实际意义。比如在下面示例中，我们定义了一个仅约束返回值类型的泛型，它是没有
// 任何意义的。
function uselessGenerics<P>(): P {
    return void 0 as unknown as P;
}
// 我们可以给函数定义任何个数的泛型入参，如下代码所示：
function reflectExtraParams<P, Q>(p1: P, p2: Q): [P, Q] {
    return [p1, p2];
}
// 在上述代码中，我们定义了一个拥有两个泛型入参（P 和 Q）的函数 reflectExtraParams，并通过 P 和 Q 约束函数参数 p1、p2 和返回值的类型。

// 泛型类
// 在类的定义中，我们还可以使用泛型用来约束构造函数、属性、方法的类型，如下代码所示：
class Memory<S> {
    store: S;
    constructor(store: S) {
        this.store = store;
    }
    set(store: S) {
        this.store = store;
    }
    get() {
        return this.store;
    }
}
const numMemory = new Memory<number>(1); // <number> 可缺省
const getNumMemory = numMemory.get(); // 类型是 number
numMemory.set(2); // 只能写入 number 类型
const strMemory = new Memory(''); // 缺省 <string>
const getStrMemory = strMemory.get(); // 类型是 string
strMemory.set('string'); // 只能写入 string 类型
// 首先，我们定义了一个支持读写的寄存器类 Memory，并使用泛型约束了 Memory 类的构造器函数、set 和 get 方法形参的类型，最后实例化了泛型入参
// 分别是 number 和 string 类型的两种寄存器。
// 泛型类和泛型函数类似的地方在于，在创建类实例时，如果受泛型约束的参数传入了明确值，则泛型入参（确切地说是传入的类型）可缺省，比如<number>、
// <string> 泛型入参就是可以缺省的。
// 小贴士：对于 React 开发者而言，组件也支持泛型，如下代码所示。
/* function GenericCom<P>(props: { prop1: string }) {
    return <></>;
}
<GenericCom<{ name: string; }> prop1="1" .../> */
// 我们定义了一个泛型组件 GenericCom，它接收了一个类型入参 P。在第 92 行，通过 JSX 语法创建组件元素的同时，我们还显式指定了接口类型
// { name: string } 作为入参。

// 泛型类型
// 我们可以使用 Array<类型> 的语法来定义数组类型，这里的 Array 本身就是一种类型。
// 在 TypeScript 中，类型本身就可以被定义为拥有不明确的类型参数的泛型，并且可以接收明确类型作为入参，从而衍生出更具体的类型，如下代码所示：
const reflectFn: <P>(param: P) => P = reflect; // ok
// 这里我们为变量 reflectFn 显式添加了泛型类型注解，并将 reflect 函数作为值赋给了它。
// 我们也可以把 reflectFn 的类型注解提取为一个能被复用的类型别名或者接口，如下代码所示：
type ReflectFunction = <P>(param: P) => P;
interface IReflectFunction {
    <P>(param: P): P
}
const reflectFn2: ReflectFunction = reflect;
const reflectFn3: IReflectFunction = reflect;
// 将类型入参的定义移动到类型别名或接口名称后，此时定义的一个接收具体类型入参后返回一个新类型的类型就是泛型类型。
// 如下示例中，我们定义了两个可以接收入参 P 的泛型类型（GenericReflectFunction 和 IGenericReflectFunction ）。
type GenericReflectFunction<P> = (param: P) => P;
interface IGenericReflectFunction<P> {
    (param: P): P;
}
const reflectFn4: GenericReflectFunction<string> = reflect; // 具象化泛型
const reflectFn5: IGenericReflectFunction<number> = reflect; // 具象化泛型
const reflectFn3Return = reflectFn4('string'); // 入参和返回值都必须是 string 类型
const reflectFn4Return = reflectFn5(1); // 入参和返回值都必须是 number 类型
// 在泛型定义中，我们甚至可以使用一些类型操作符进行运算表达，使得泛型可以根据入参的类型衍生出各异的类型，如下代码所示：
type StringOrNumberArray<E> = E extends string | number ? E[] : E;
type StringArray = StringOrNumberArray<string>; // 类型是 string[]
type NumberArray = StringOrNumberArray<number>; // 类型是 number[]
type NeverGot = StringOrNumberArray<boolean>; // 类型是 boolean
// 这里我们定义了一个泛型，如果入参是 number | string 就会生成一个数组类型，否则就生成入参类型。而且，我们还使用了与 JavaScript 三元表达式
// 完全一致的语法来表达类型运算的逻辑关系。
// 如果我们给上面这个泛型传入了一个 string | boolean 联合类型作为入参，将会得到什么类型呢？且看如下所示示例：
type BooleanOrString = string | boolean;
type WhatIsThis = StringOrNumberArray<BooleanOrString>;
type BooleanOrStringGot = BooleanOrString extends string | number ? BooleanOrString[] : BooleanOrString;
// 如果你使用 VS Code 尝试了这个示例，并 hover 类型别名 WhatIsThis ，那么你会发现显示的类型将是 boolean | string[]。
// BooleanOrStringGot 和 WhatIsThis 这两个类型别名的类型居然不一样，这是什么逻辑？这个就是所谓的分配条件类型（Distributive Conditional Types）。
// 关于分配条件类型这个概念，官方的释义：在条件类型判断的情况下（比如上边示例中出现的 extends），如果入参是联合类型，则会被拆解成一个个独立的
// （原子）类型（成员）进行类型运算。
// 比如上边示例中的 string | boolean 入参，先被拆解成 string 和 boolean 这两个独立类型，再分别判断是否是 string | number 类型的子集。
// 因为 string 是子集而 boolean 不是，所以最终我们得到的 WhatIsThis 的类型是 boolean | string[]。
// 能接受入参的泛型类型和函数一样，都可以对入参类型进行计算并返回新的类型，像是在做类型运算。
// 利用泛型，我们可以抽象封装出很多有用、复杂的类型约束。比如在 Redux Model 中约束 State 和 Reducers 的类型定义关系，我们可以通过如下
// 所示代码定义了一个既能接受 State 类型入参，又包含 state 和 reducers 这两个属性的接口类型泛型，并通过 State 入参约束了泛型的 state
// 属性和 reducers 属性下 action 索引属性的类型关系。
interface ReduxModel<State> {
    state: State,
    reducers: {
        [action: string]: (state: State, action: any) => State
    }
}
// 然后根据实际需要，我们传入了一个具体的 State 类型具象化 ReduxModel，并约束了一个实际的 model，如下代码所示：
type ModelInterface = { id: number; name: string };
const model: ReduxModel<ModelInterface> = {
    state: { id: 1, name: 'yilujun100' }, //  ok 类型必须是 ModelInterface
    reducers: {
        setId: (state, action: { payload: number }) => ({
            ...state,
            id: action.payload // ok must be number
        }),
        setName: (state, action: { payload: string }) => ({
            ...state,
            name: action.payload // ok must be string
        })
    }
}
// 在上述示例中，model 对象的 state 属性、reducers 属性的 setId、setName 方法的第一个参数 state 的类型都受到 ReduxModel 泛型入参
// ModelInterface 的约束。
// 注意：枚举类型不支持泛型。

// 泛型约束
// 前面提到了泛型就像是类型的函数，它可以抽象、封装并接收（类型）入参，而泛型的入参也拥有类似函数入参的特性。因此，我们可以把泛型入参限定在
// 一个相对更明确的集合内，以便对入参进行约束。
// 比如最前边提到的原封不动返回参数的 reflect 函数，我们希望把接收参数的类型限定在几种原始类型的集合中，此时就可以使用“泛型入参名 extends
// 类型”语法达到这个目的，如下代码所示：
function reflectSpecifield<P extends number | string | boolean>(param: P):P {
    return param;
}
reflectSpecifield('string'); // ok
reflectSpecifield(1); // ok
reflectSpecifield(true); // ok
reflectSpecifield(null); // ts(2345) 'null' 不能赋予类型 'number | string | boolean'
// 在上述示例中，我们限定了泛型入参只能是 number | string | boolean 的子集。
// 同样，我们也可以把接口泛型入参约束在特定的范围内，如下代码所示：
interface ReduxModelSpecified<State extends { id: number; name: string }> {
    state: State
}
type ComputedReduxModel1 = ReduxModelSpecified<{ id: number; name: string; }>; // ok
type ComputedReduxModel2 = ReduxModelSpecified<{ id: number; name: string; age: number; }>; // ok
type ComputedReduxModel3 = ReduxModelSpecified<{ id: string; name: number; }>; // ts(2344)
type ComputedReduxModel4 = ReduxModelSpecified<{ id: number; }>; // ts(2344)
// 在上述示例中，ReduxModelSpecified 泛型仅接收 { id: number; name: string } 接口类型的子类型作为入参。
// 我们还可以在多个不同的泛型入参之间设置约束关系，如下代码所示：
interface ObjSetter {
    <O extends {}, K extends keyof O, V extends O[K]>(obj: O, key: K, value: V): V;
}
const setValueOfObj: ObjSetter = (obj, key, value) => (obj[key] = value);
setValueOfObj({ id: 1, name: 'name' }, 'id', 2); // ok
setValueOfObj({ id: 1, name: 'name' }, 'name', 'new name'); // ok
setValueOfObj({ id: 1, name: 'name' }, 'age', 2); // ts(2345)
setValueOfObj({ id: 1, name: 'name' }, 'id', '2'); // ts(2345)
// 在设置对象属性值的函数类型时，它拥有 3 个泛型入参：第 1 个是对象，第 2 个是第 1 个入参属性名集合的子集，第 3 个是指定属性类型的子类型。
// 另外，泛型入参与函数入参还有一个相似的地方在于，它也可以给泛型入参指定默认值（默认类型），且语法和指定函数默认参数完全一致，如下代码所示：
interface ReduxModelSpecified2<State = { id: number; name: string }> {
    state: State
}
type ComputedReduxModel5 = ReduxModelSpecified2; // ok
type ComputedReduxModel6 = ReduxModelSpecified2<{ id: number; name: string; }>; // ok
type ComputedReduxModel7 = ReduxModelSpecified; // ts(2314) 缺少一个类型参数
// 在上述示例中，我们定义了入参有默认类型的泛型 ReduxModelSpecified2，因此使用 ReduxModelSpecified2 时类型入参可缺省。而
// ReduxModelSpecified 的入参没有默认值，所以缺省入参时会提示一个类型错误。
// 泛型入参的约束与默认值还可以组合使用，如下代码所示：
interface ReduxModelMixed<State extends {} = { id: number; name: string }> {
    state: State
}
// 这里我们限定了泛型 ReduxModelMixed 入参 State 必须是 {} 类型的子类型，同时也指定了入参缺省时的默认类型是接口类型 { id: number; name: string; }。
// 我们可以试着将泛型理解为类型中的函数，并通过抽象、封装类型运算逻辑实现类型可复用，以便更好地掌握泛型。