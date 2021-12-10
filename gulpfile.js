const {src, dest, series, watch }= require (`gulp`);
const imageCompressor= require ('gulp-imagemin');
const cssCompressor= require (`gulp-uglifycss`);
const htmlCompressor = require(`gulp-htmlmin`);
const jsCompressor = require(`gulp-uglify`);
const jsLinyter
// production tasks
let compressImg = () => {
    return src(['images/*'])
        .pipe(imageCompressor())
        .pipe(dest('prod/img'))
};

let uglifyCss = () => {
    return src([`css/*.css`,`css/**/*.css`])
        .pipe(cssCompressor())
        .pipe(dest(`prod/css`));
};

let minifyHTML = () => {
    return src([`*.html`])
        .pipe(htmlCompressor({collapseWhitespace: `true`}))
        .pipe(dest(`prod`));
};

let minifyJs = () => {
    return src(`js/*.js`)
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};
// development tasks



// public tasks
exports.build = series( uglifyCss, minifyHTML, compressImg, minifyJs);
exports.serve = series (lintJS, transpileJSForDev, validateHTML, lintCSS, serve);
