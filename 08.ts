// 08 | 高级类型：如何快速读懂联合类型和交叉类型的含义？
// 基础类型、字面量类型、函数类型及接口类型等内容，它们都是单一、原子的类型元素。其实，如前边课程中一些稍微复杂、实际编程场景的示例所示，
// 我们还需要通过组合/结合单一、原子类型构造更复杂的类型，以此描述更复杂的数据和结构。这就是这一讲中将介绍的内容——联合和交叉类型
// （Unions and Intersection Types）。

// 联合类型
// 联合类型（Unions）用来表示变量、参数的类型不是单一原子类型，而可能是多种不同的类型的组合。
// 我们主要通过“|”操作符分隔类型的语法来表示联合类型。这里，我们可以把“|”类比为 JavaScript 中的逻辑或 “||”，只不过前者表示可能的类型。
// 举个例子，我们封装了一个将 string 或者 number 类型的输入值转换成 '数字 + "px" 格式的函数，如下代码所示：
/* function formatPX(size: unknown) {
    if (typeof size === 'number') {
        return `${size}px`;
    }
    if (typeof size === 'string') {
        return `${parseInt(size) || 0}px`;
    }
    throw Error(`仅支持 number 或者 string`);
}
formatPX(13);
formatPX('13px'); */
// 说明：在学习联合类型之前，我们可能免不了使用 any 或 unknown 类型来表示参数的类型（为了让大家养成好习惯，推荐使用 unknown）。
// 通过这样的方式带来的问题是，在调用 formatPX 时，我们可以传递任意的值，并且可以通过静态类型检测（使用 any 亦如是），但是运行时还是
// 会抛出一个错误，例如：
/* formatPX(true);
formatPX(null); */
// 这显然不符合我们的预期，因为 size 应该是更明确的，即可能也只可能是 number 或 string 这两种可选类型的类型。
// 所幸有联合类型，我们可以使用一个更明确表示可能是 number 或 string 的联合类型来注解 size 参数，如下代码所示：
function formatPX(size: number | string) {
    if (typeof size === 'number') {
        return `${size}px`;
    }
    if (typeof size === 'string') {
        return `${parseInt(size) || 0}px`;
    }
    throw Error(`仅支持 number 或者 string`);
}
formatPX(13); // ok
formatPX('13px'); // ok
formatPX(true); // ts(2345) 'true' 类型不能赋予 'number | string' 类型
formatPX(null); // ts(2345) 'null' 类型不能赋予 'number | string' 类型
// 我们定义了函数 formatPX 的参数 size 既可以是 number 类型也可以是 string 类型，所以传入数字 13 和字符串 '13px' 都正确，
// 但传入布尔类型的 true 或者 null 类型都会提示一个 ts(2345) 错误。
// 当然，我们可以组合任意个、任意类型来构造更满足我们诉求的类型。比如，我们希望给前边的示例再加一个 unit 参数表示可能单位，这个时候
// 就可以声明一个字符串字面类型组成的联合类型，如下代码所示：
function formatUnit(size: number | string, unit: 'px' | 'em' | 'rem' | '%' = 'px') {
    // ...
}
formatUnit(1, 'em'); // ok
formatUnit('1px', 'rem'); // ok
formatUnit('1px', 'bem'); // ts(2345)
// 我们定义了 formatPX 函数的第二个参数 unit，它的类型是由 'px'、'em'、'rem'、'%' 字符串字面类型组成的类型集合。因此，我们可以
// 传入字符串字面量 'em' 和 'rem' 作为第二个实参。如果我们传入一个不在类型集合中的字符串字面量 'bem' ，就会提示一个 ts(2345) 错误。
// 我们也可以使用类型别名抽离上边的联合类型，然后再将其进一步地联合，如下代码所示：
type ModernUnit = 'vh' | 'vw';
type Unit = 'px' | 'em' | 'rem';
type MessedUp = ModernUnit | Unit; // 类型是 'vh' | 'vw' | 'px' | 'em' | 'rem'
// 这里我们定义了 ModernUnit 别名表示 'vh' 和 'vw' 这两个字面量类型的组合，且定义了 Unit 别名表示 'px' 和 'em' 和 'rem'
// 字面量类型组合，同时又定义了 MessedUp 别名表示 ModernUnit 和 Unit 两个类型别名的组合。
// 我们也可以把接口类型联合起来表示更复杂的结构，如下所示示例（援引官方示例，顺带复习一下类型断言 as）
interface Bird {
    fly(): void;
    layEggs(): void;
}
interface Fish {
    swim(): void;
    layEggs(): void;
}
const getPet: () => Bird | Fish = () => {
    return {
        // ...
    } as Bird | Fish;
};
const Pet = getPet();
Pet.layEggs(); // ok
Pet.fly(); // ts(2339) 'Fish' 没有 'fly' 属性; 'Bird | Fish' 没有 'fly' 属性
// 从上边的示例可以看到，在联合类型中，我们可以直接访问各个接口成员都拥有的属性、方法，且不会提示类型错误。但是，如果是个别成员特有的
// 属性、方法，我们就需要区分对待了，此时又要引入类型守卫来区分不同的成员类型。
// 只不过，在这种情况下，我们还需要使用基于 in 操作符判断的类型守卫，如下代码所示：
if (typeof Pet.fly === 'function') { // ts(2339)
    Pet.fly();
}
if ('fly' in Pet) {
    Pet.fly(); // ok
}
// 因为 Pet 的类型既可能是 Bird 也可能是 Fish，这就意味着在第 79 行可能会通过 Fish 类型获取 fly 属性，但 Fish 类型没有 fly 属性定义，
// 所以会提示一个 ts(2339) 错误。

// 交叉类型
// 前边我们使用了逻辑或“||” 类比联合类型，那是不是还有一个逻辑与“&&”可以类比类型？
// 在 TypeScript 中，确实还存在一种类似逻辑与行为的类型——交叉类型（Intersection Type），它可以把多个类型合并成一个类型，合并后的类型
// 将拥有所有成员类型的特性。
// 在 TypeScript 中，我们可以使用“&”操作符来声明交叉类型，如下代码所示：
type Useless = string & number;
// 很显然，如果我们仅仅把原始类型、字面量类型、函数类型等原子类型合并成交叉类型，是没有任何用处的，因为任何类型都不能满足同时属于多种原子类型，
// 比如既是 string 类型又是 number 类型。因此，在上述的代码中，类型别名 Useless 的类型就是个 never。

// 合并接口类型
// 联合类型真正的用武之地就是将多个接口类型合并成一个类型，从而实现等同接口继承的效果，也就是所谓的合并接口类型，如下代码所示：
type IntersectionType = { id: number; name: string; }
    & { age: number };
const mixed: IntersectionType = {
    id: 1,
    name: 'name',
    age: 18
};
// 在上述示例中，我们通过交叉类型，使得 IntersectionType 同时拥有了 id、name、age 所有属性，这里我们可以试着将合并接口类型理解为求并集。
// 这里，我们来发散思考一下：如果合并的多个接口类型存在同名属性会是什么效果呢？
// 此时，我们可以根据同名属性的类型是否兼容]将这个问题分开来看。
// 如果同名属性的类型不兼容，比如上面示例中两个接口类型同名的 name 属性类型一个是 number，另一个是 string，合并后，name 属性的类型就是
// number 和 string 两个原子类型的交叉类型，即 never，如下代码所示：
/* type IntersectionTypeConfict = { id: number; name: string; }
    & { age: number; name: number; };
const mixedConflict: IntersectionTypeConfict = {
    id: 1,
    name: 2, // ts(2322) 错误，'number' 类型不能赋给 'never' 类型
    age: 2
}; */
// 此时，我们赋予 mixedConflict 任意类型的 name 属性值都会提示类型错误。而如果我们不设置 name 属性，又会提示一个缺少必选的 name 属性的
// 错误。在这种情况下，就意味着上述代码中交叉出来的 IntersectionTypeConfict 类型是一个无用类型。
// 如果同名属性的类型兼容，比如一个是 number，另一个是 number 的子类型、数字字面量类型，合并后 name 属性的类型就是两者中的子类型。
// 如下所示示例中 name 属性的类型就是数字字面量类型 2，因此，我们不能把任何非 2 之外的值赋予 name 属性。
type IntersectionTypeConfict = { id: number; name: 2; }
    & { age: number; name: number; };
let mixedConflict: IntersectionTypeConfict = {
    id: 1,
    name: 2, // ok
    age: 2
};
mixedConflict = {
    id: 1,
    name: 22, // '22' 类型不能赋给 '2' 类型
    age: 2
};

// 合并联合类型
// 另外，我们可以合并联合类型为一个交叉类型，这个交叉类型需要同时满足不同的联合类型限制，也就是提取了所有联合类型的相同类型成员。
// 这里，我们也可以将合并联合类型理解为求交集。
// 在如下示例中，两个联合类型交叉出来的类型 IntersectionUnion 其实等价于 'em' | 'rem'，所以我们只能把 'em' 或者 'rem' 字符串赋值
// 给 IntersectionUnion 类型的变量。
type UnionA = 'px' | 'em' | 'rem' | '%';
type UnionB = 'vh' | 'em' | 'rem' | 'pt';
type IntersectionUnion = UnionA & UnionB;
const intersectionA: IntersectionUnion = 'em'; // ok
const intersectionB: IntersectionUnion = 'rem'; // ok
const intersectionC: IntersectionUnion = 'px'; // ts(2322)
const intersectionD: IntersectionUnion = 'pt'; // ts(2322)
// 既然是求交集，如果多个联合类型中没有相同的类型成员，交叉出来的类型自然就是 never 了，如下代码所示：
type UnionC = 'em' | 'rem';
type UnionD = 'px' | 'pt';
type IntersectionUnionE = UnionC & UnionD;
const intersectionE: IntersectionUnionE = 'any' as any; // ts(2322) 不能赋予 'never' 类型
// 在上述示例中，因为 UnionC 和 UnionD 没有交集，交叉出来的类型 IntersectionUnionE 就是 never，所以我们不能把任何类型的值赋予
// IntersectionUnionE 类型的变量。

// 联合、交叉组合
// 在前面的示例中，我们把一些联合、交叉类型抽离成了类型别名，再把它作为原子类型进行进一步的联合、交叉。其实，联合、交叉类型本身就可以
// 直接组合使用，这就涉及 |、& 操作符的优先级问题。实际上，联合、交叉运算符不仅在行为上表现一致，还在运算的优先级和 JavaScript 的
// 逻辑或 ||、逻辑与 && 运算符上表现一致 。
// 联合操作符 | 的优先级低于交叉操作符 &，同样，我们可以通过使用小括弧 () 来调整操作符的优先级。
type UnionIntersectionA = { id: number; } & { name: string } | { id: string; } & { name: number; }; // 交叉操作符优先级高于联合操作符
type UnionIntersectionB = ('px' | 'em' | 'rem' | '%') | ('vh' | 'em' | 'rem' | 'pt'); // 调整优先级
// 进而，我们也可以把分配率、交换律等基本规则引入类型组合中，然后优化出更简洁、清晰的类型，如下代码所示：
type UnionIntersectionC = ({ id: number; } & { name: string; } | { id: string; }) & { name: number; };
type UnionIntersectionD = { id: number; } & { name: string; } & { name: number; } | { id: string; } & { name: number; }; // 满足分配率
type UnionIntersectionE = ({ id: string; } | { id: number; } & { name: string; }) & { name: number; }; // 满足交换律
// 在上述代码中，第 164 行是在第 163 行的基础上进行展开，说明 & 满足分配率；第 165 行则是在第 163 行的基础上调整了成员的顺序，说明 | 操作满足交换律。

// 类型缩减
// 如果将 string 原始类型和“string字面量类型”组合成联合类型会是什么效果？效果就是类型缩减成 string 了。
// 同样，对于 number、boolean（其实还有枚举类型）也是一样的缩减逻辑，如下所示示例：
type URStr = 'string' | string; // 类型是 string
type URNum = 2 | number; // 类型是 number
type URBoolen = true | boolean; // 类型是 boolean
enum EnumUR {
    ONE,
    TWO
}
type URE = EnumUR.ONE | EnumUR; // 类型是 EnumUR
// TypeScript 对这样的场景做了缩减，它把字面量类型、枚举成员类型缩减掉，只保留原始类型、枚举类型等父类型，这是合理的“优化”。
// 可是这个缩减，却极大地削弱了 IDE 自动提示的能力，如下代码所示：
// type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string; // 类型缩减成 string
// 在上述代码中，我们希望 IDE 能自动提示显示注解的字符串字面量，但是因为类型被缩减成 string，所有的字符串字面量 black、red 等都无法自动提示出来了。
// 不要慌，TypeScript 官方其实还提供了一个黑魔法，它可以让类型缩减被控制。如下代码所示，我们只需要给父类型添加“& {}”即可。
type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string & {}; // 字面类型都被保留
// let color: BorderColor = '';
// 此时，其他字面量类型就不会被缩减掉了，在 IDE 中字符串字面量 black、red 等也就自然地可以自动提示出来了。
// 此外，当联合类型的成员是接口类型，如果满足其中一个接口的属性是另外一个接口属性的子集，这个属性也会类型缩减，如下代码所示：
/* type UnionInterce = | {
    age: '1';
} | ({
    age: '1' | '2';
    [key: string]: string;
}); */
// 这里因为 '1' 是 '1' | '2' 的子集，所以 age 的属性变成 '1' | '2'：
// 利用这个特性，我们来实现 07 讲中埋下的那个伏笔，如何定义如下所示 age 属性是数字类型，而其他不确定的属性是字符串类型的数据结构的对象？
/* {
    age: 1, // 数字类型
    anyProperty: 'str', // 其他不确定的属性都是字符串类型
} */
// 在这里提到这个伏笔，想必你应该明白了，我们肯定要用到两个接口的联合类型及类型缩减，这个问题的核心在于找到一个既是 number 的子类型，
// 这样 age 类型缩减之后的类型就是 number；同时也是 string 的子类型，这样才能满足属性和 string 索引类型的约束关系。
// 哪个类型满足这个条件呢？我们一起回忆一下 02 讲中介绍的特殊类型 never。
// never 有一个特性是它是所有类型的子类型，自然也是 number 和 string 的子类型，所以答案如下代码所示：
type UnionInterce =
| {
    age: number;
}
| ({
    age: never;
    [key: string]: string;
});
const O: UnionInterce = {
    age: 2,
    string: 'string'
};
// 在上述代码中，我们在第 206 行定义了 number 类型的 age 属性，第 209 行定义了 never 类型的 age 属性，等价于 age 属性的类型是
// 由 number 和 never 类型组成的联合类型，所以我们可以把 number 类型的值（比如说数字字面量 1）赋予 age 属性；但是不能把其他任何
// 类型的值（比如说字符串字面量 'string' ）赋予 age。
// 同时，我们在第 208 行~第 211 行定义的接口类型中，还额外定义了 string 类型的字符串索引签名。因为 never 同时又是 string 类型的
// 子类型，所以 age 属性的类型和字符串索引签名类型不冲突。如第 212 行~第 215 行所示，我们可以把一个 age 属性是 2、string 属性是 'string'
// 的对象字面量赋值给 UnionInterce 类型的变量 O。