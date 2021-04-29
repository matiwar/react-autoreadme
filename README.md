# React Autoreadme

> Tool to automatically generate `Readme.md` files for React components.

## Installation

```
npm install frontend-react-autoreadme
```

## Usage
Create `react-autoreadme.config.js` file in your app root folder.

```js
module.exports = {
  generate: true, // enable or disable README.md generation.
  componentsDirectories: ['./app/components/'], // components directories
  componentsMatch: '**/*.js', // components pattern
  silent: false, // don't print results
  mode: 'list' // list or table
};
```

Add script to your package.json file:
```js
"scripts": {
  "generate-readme": "react-autoreadme"
}
```

You can use [Husky](https://github.com/typicode/husky) hooks to create your README.md files before commit:

```js
"husky": {
  "hooks": {
    "pre-commit": "react-autoreadme && git add **/readme.md"
  }
},
```

## Examples
- [List mode example](./examples/component-as-list)
- [Table mode example](./examples/component-as-table)