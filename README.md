
Nodejs does not support ES6 imports yet by default. 
1. Install Babel
npm install @babel/core @babel/register @babel/preset-env --save-dev
https://timonweb.com/javascript/how-to-enable-es6-imports-in-nodejs/

2. Create .babelrc file for async await
npm install --save @babel/runtime 
npm install --save-dev @babel/plugin-transform-runtime
And, in .babelrc, add:

{
    "presets": ["@babel/preset-env"],
    "plugins": [
        ["@babel/transform-runtime"]
    ]
}
https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined

