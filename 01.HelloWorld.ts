// 01 | 快速搭建 TypeScript 开发环境
// IDE for TypeScript
// vs Code 支持在内置和手动安装版本之间动态切换语言服务，从而实现对不同版本的 TypeScript 的支持。

// Playground
// 官方也提供了一个在线开发 TypeScript 的云环境 —— Playground。
// 基于它，我们无须在本地安装环境，只需要一个浏览器即可随时学习和编写 TypeScript，同时还可以方便地选择 TypeScript 版本、
// 配置 tsconfig，并对 TypeScript 实时静态类型检测、转译输出 JavaScript 和在线执行。

// 安装 TypeScript
// 通过命令行工具使用 npm 全局安装 TypeScript。
// npm i -g typescript
// TypeScript 安装完成后，我们输入如下所示命令即可查看当前安装的 TypeScript 版本。
// tsc -v
// 我们也可以通过安装在 Terminal 命令行中直接支持运行 TypeScript 代码（Node.js 侧代码）的 ts-node 来获得较好的开发体验。
// 通过 npm 全局安装 ts-node
// npm i -g ts-node

// 编写 Hello World
// 我们可以在目录下输入 tsc --init 命令快速创建一个 tsconfig.json 文件，或者在 VS Code 应用窗口新建一个空的 tsconfig.json
// 配置 TypeScript 的行为。tsconfig.json 设置将决定 VS Code 语言服务如何对当前应用下的 TypeScript 代码进行类型检测。
// .ts 文件创建完成后，我们就可以使用 tsc(TypeScript Compiler) 命令将 .ts 文件转译为 .js 文件。
// 注意：指定转译的目标文件后，tsc 将忽略当前应用路径下的 tsconfig.json 配置，因此我们需要通过显式设定如下所示的参数，让 tsc
// 以严格模式检测并转译 TypeScript 代码。
// tsc 01.HelloWorld.ts --strict --alwaysStrict false
// 同时，我们可以给 tsc 设定一个 watch 参数监听文件内容变更，实时进行类型检测和代码转译
// tsc 01.HelloWorld.ts --strict --alwaysStrict false --watch

function say(word: string) {
    console.log(word);
}
say('Hello, World');
// say(1);