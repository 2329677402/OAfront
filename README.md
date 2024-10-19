[toc]

# oafront

## 1. ref && reactive

> 在 Vue 3 中，`ref`和`reactive`的使用场景有所不同，主要取决于你需要处理的数据类型和复杂度。以下是它们的使用场景和区别：

### `ref`的使用场景

1. **基本类型**：

   - 当你需要创建一个响应式的基本类型（如字符串、数字、布尔值）时，使用`ref`。
   - 例如，计数器、单个输入框的值等。

   ```javascript
   import { ref } from "vue";

   const count = ref(0); // 创建一个响应式的基本类型
   const message = ref("Hello, Vue 3!"); // 创建一个响应式的字符串
   ```

2. **单个对象或数组**：

   - 当你需要创建一个响应式的单个对象或数组时，也可以使用`ref`。
   - 例如，单个表单对象或列表。

   ```javascript
   import { ref } from "vue";

   const form = ref({
     title: "",
     content: "",
   }); // 创建一个响应式的对象

   const items = ref([]); // 创建一个响应式的数组
   ```

3. **DOM 引用**：

   - 当你需要引用 DOM 元素时，使用`ref`。

   ```javascript
   import { ref, onMounted } from "vue";

   const inputRef = ref(null);

   onMounted(() => {
     inputRef.value.focus(); // 访问DOM元素
   });
   ```

### `reactive`的使用场景

1. **复杂对象**：

   - 当你需要创建一个包含多个属性的复杂对象时，使用`reactive`。
   - 例如，包含多个字段的表单对象。

   ```javascript
   import { reactive } from "vue";

   const form = reactive({
     title: "",
     content: "",
     date: new Date(),
   }); // 创建一个响应式的复杂对象
   ```

2. **嵌套对象**：

   - 当你需要处理嵌套对象时，使用`reactive`。

   ```javascript
   import { reactive } from "vue";

   const user = reactive({
     name: "John Doe",
     address: {
       city: "New York",
       zip: "10001",
     },
   }); // 创建一个响应式的嵌套对象
   ```

### 总结

- 使用`ref`来处理单个基本类型或对象，并通过`.value`来访问和修改值。
- 使用`reactive`来处理包含多个属性的复杂对象，直接访问和修改对象的属性。

## 2. var、let、const

> 在 JavaScript 中，`var`、[`let`](vscode-file://vscode-app/d:/Develop/IDE/VS Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)和`const`是用于声明变量的关键字，它们之间有一些重要的区别：

### `var`

1. **作用域**：

   - `var`声明的变量是函数作用域或全局作用域。
   - 如果在函数内部声明，则变量在整个函数内都可以访问。
   - 如果在函数外部声明，则变量在整个全局范围内都可以访问。

2. **变量提升**：

   - `var`声明的变量会被提升到其作用域的顶部，但不会初始化。
   - 这意味着你可以在声明之前使用变量，但值为`undefined`。

3. **重复声明**：

   - 允许在同一作用域内重复声明同一个变量。

   示例：

   ```javascript
   console.log(a); // undefined
   var a = 10;
   console.log(a); // 10

   function test() {
     var b = 20;
     if (true) {
       var b = 30; // 重新声明并覆盖
       console.log(b); // 30
     }
     console.log(b); // 30
   }
   test();
   ```

### `let`

1.  **作用域**：

    - `let`声明的变量是块作用域。
    - 变量只能在声明它的块内访问。

2.  **变量提升**：

    - `let`声明的变量也会被提升，但不会初始化。
    - 在变量声明之前访问会导致`ReferenceError`。

3.  **重复声明**：

    - 不允许在同一作用域内重复声明同一个变量。

    示例：

    ```javascript
    // console.log(x); // ReferenceError: Cannot access 'x' before initialization
    let x = 10;
    console.log(x); // 10

    function test() {
      let y = 20;
      if (true) {
        let y = 30; // 不同的变量
        console.log(y); // 30
      }
      console.log(y); // 20
    }
    test();
    ```

### `const`

1. **作用域**：

   - `const`声明的变量是块作用域。
   - 变量只能在声明它的块内访问。

2. **变量提升**：

   - `const`声明的变量也会被提升，但不会初始化。
   - 在变量声明之前访问会导致`ReferenceError`。

3. **重复声明**：

   - 不允许在同一作用域内重复声明同一个变量。

4. **常量**：

   - `const`声明的变量必须在声明时初始化，且不能重新赋值。
   - 对于对象和数组，`const`只保证变量引用的地址不变，内容仍然可以改变。

   示例：

   ```javascript
   // console.log(z); // ReferenceError: Cannot access 'z' before initialization
   const z = 10;
   console.log(z); // 10
   // z = 20; // TypeError: Assignment to constant variable.

   const obj = { a: 1 };
   obj.a = 2; // 允许修改对象的属性
   console.log(obj.a); // 2

   const arr = [1, 2, 3];
   arr.push(4); // 允许修改数组的内容
   console.log(arr); // [1, 2, 3, 4]
   ```

### 总结

- **`var`**：函数作用域，变量提升，允许重复声明。
- **[`let`](vscode-file://vscode-app/d:/Develop/IDE/VS Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)**：块作用域，变量提升但不初始化，不允许重复声明。
- **`const`**：块作用域，变量提升但不初始化，不允许重复声明，声明时必须初始化且不能重新赋值（但对象和数组的内容可以改变）。

## 3. defineProps && defineModel

> `defineProps`和 `defineModel` 是 Vue 3 中的两个不同的组合式 API，用于处理组件的属性和模型。

### `defineProps`

`defineProps`是 Vue 3 中用于定义组件属性（props）的组合式 API。它允许你在组合式 API setup 函数中声明组件的属性。属性是父组件传递给子组件的数据。

示例：

```vue
<script setup>
import { defineProps } from "vue";

const props = defineProps({
  title: String,
  count: Number,
});
</script>

<template>
  <div>
    <h1>{{ props.title }}</h1>
    <p>{{ props.count }}</p>
  </div>
</template>
```

在这个示例中，`defineProps` 用于声明 `title` 和 `count` 两个属性，这些属性可以从父组件传递到子组件。

### `defineModel`

`defineModel` 是 Vue 3.3 引入的一个新 API，用于简化双向绑定模型的定义。它允许你在组合式 API setup 函数中声明一个模型属性，并自动处理 `v-model` 的绑定。

示例：

```vue
<script setup>
import { defineModel } from "vue";

const modelValue = defineModel("modelValue", String);
</script>

<template>
  <input v-model="modelValue" />
</template>
```

在这个示例中，`defineModel` 用于声明一个 `modelValue` 模型属性，这个属性可以通过 `v-model` 进行双向绑定。

### 总结

- `defineProps` 用于定义组件的==属性==（props），这些属性是从父组件传递过来的。
- `defineModel` 用于定义组件的==模型属性==，简化了 `v-model` 的双向绑定。

## 4. route && router

> 在 Vue.js 中，`route`和`router`是与路由相关的两个不同概念，它们有不同的使用场景和作用：

### route

`route`是当前激活的路由对象，包含了当前路由的所有信息。你可以通过`this.$route`在组件中访问它。[`route`](vscode-file://vscode-app/d:/Develop/IDE/VS Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)对象包含以下信息：

- **`path`**：当前路由的路径。
- **`params`**：动态路由参数。
- **`query`**：查询参数。
- **[`name`](vscode-file://vscode-app/d:/Develop/IDE/VS Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)**：路由的名称。
- **`meta`**：路由的元信息。
- **`fullPath`**：完整的路径。
- **`hash`**：URL 中的哈希值。
- **`matched`**：匹配到的路由记录。

#### 使用场景

1. **获取当前路由信息**：在组件中获取当前路由的路径、参数、查询等信息。
2. **条件渲染**：根据当前路由信息进行条件渲染。

示例：

```vue
<template>
  <div>
    <p>当前路径: {{ $route.path }}</p>
    <p>查询参数: {{ $route.query }}</p>
  </div>
</template>

<script>
export default {
  computed: {
    currentRoute() {
      return this.$route;
    },
  },
};
</script>
```

### router

`router`是 Vue Router 的实例，包含了导航的方法和全局的路由配置。你可以通过`this.$router`在组件中访问它。`router`对象包含以下方法：

- **`push`**：导航到一个新的 URL。
- **`replace`**：导航到一个新的 URL，但不会在历史记录中留下记录。
- **`go`**：在浏览历史中前进或后退。
- **`back`**：后退一步。
- **`forward`**：前进一步。

#### 使用场景

1. **编程式导航**：在代码中使用方法进行路由跳转。
2. **全局路由配置**：设置全局的路由守卫、动态添加路由等。

示例：

```vue
<template>
  <div>
    <button @click="goToHome">回到首页</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$router.push({ name: "home" });
    },
  },
};
</script>
```

### 总结

- **`route`**：用于获取当前路由的信息，适用于需要访问当前路由路径、参数、查询等信息的场景。
- **`router`**：用于进行编程式导航和全局路由配置，适用于需要在代码中进行路由跳转或设置全局路由守卫的场景。
