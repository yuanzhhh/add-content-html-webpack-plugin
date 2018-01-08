const fs = require('fs');
const uglifyJs = require("uglify-js").minify;
const babel = require('babel-core');
const path = require('path');

const defaultOpt = {
  filepath: null,
  inject: null,
  uglify: true,
  babelpath: null,
}

function AddContentHtml(options) {
  Object.assign(this, defaultOpt, options);
}

AddContentHtml.prototype.intype = {
  '.js': 'script',
  '.css': 'style'
}

AddContentHtml.prototype.mergeText = (inject, html, content, intype) => {
  const result = new RegExp(`</${inject}>`, 'g');

  return html.replace(result, `<${intype}>${content}</${intype}></${inject}>`);
}

AddContentHtml.prototype.uglifyWith = {
  '.js' (text) {
    const babelCode = babel.transform(text, {
      extends: this.babelpath,
    });

    return uglifyJs(babelCode.code).code;
  },

  '.css' (text) {
    return text;
  },
}

AddContentHtml.prototype.merges = function (html, text) {
  let content = text;

  const extname = path.extname(this.filepath);

  if (this.uglify) {
    content = this.uglifyWith[extname].call(this, text);
  }

  const intype = this.intype[extname];

  return this.mergeText(this.inject, html, content, intype);
};

AddContentHtml.prototype.apply = function (compiler) {
  compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
      fs.readFile(this.filepath, 'utf8', (err, data) => {
        if (err) reject(err);

        htmlPluginData.html = this.merges(htmlPluginData.html, data);

        callback(null, htmlPluginData);
      });
    });
  });
};

module.exports = AddContentHtml;