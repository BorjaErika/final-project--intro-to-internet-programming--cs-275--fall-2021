const {src, dest, series}= require (`gulp`);
const imageCompressor= require (`gulp-imagemin`);
const cssCompressor= require (`gulp-uglifycss`);
const htmlCompressor = require(`gulp-htmlmin`);
const jsCompressor = require(`gulp-uglify`);
const jsLinter = require(`gulp-eslint`);//
const cssLinter = require(`gulp-stylelint`);//
const htmlValidator = require(`gulp-html`);
const babel = require(`gulp-babel`);

// production tasks
let compressImg = () => {
    return src([`images/*`])
        .pipe(dest(`prod/img`));
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
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

// development tasks

let transpileJSForDev = () => {
    return src(`js/*.js`)
        .pipe(babel())
        .pipe(dest(`dev/js`));
};
let lintJS = () => {
    return src(`js/*.js`)
        .pipe(jsLinter())
        .pipe(jsLinter.formatEach());
};
let validateHTML = () => {
    return src([
        `/*.html`,
        `html/**/*.html`])
        .pipe(htmlValidator);
};

let lintCSS = () => {
    return src(`css/*.css`)
        .pipe(cssLinter({
            failAfterError: false,
            reporters: [
                {formatter:  `string`, console: true}
            ]
        }));
};

// public tasks
exports.build = series( uglifyCss, minifyHTML, compressImg,minifyJs);
exports.serve = series (lintJS, transpileJSForDev, validateHTML, lintCSS);
