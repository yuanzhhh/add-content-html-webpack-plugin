## Usage
```
# install
npm install add-content-html-webpack-plugin (or yarn)

# usage
const AddContentHtml = require('add-content-html-webpack-plugin');

# plugins config array for Webpack
new AddContentHtml({
    filepath: // file path
    inject: 'head', // head、body、html
    babelpath: // babel path
});
```