const {src, dest, series,watch}= require (`gulp`);
const imageCompressor= require (`gulp-imagemin`);
const cssCompressor= require (`gulp-uglifycss`);
const htmlCompressor = require(`gulp-htmlmin`);
const jsCompressor = require(`gulp-uglify`);
const jsLinter = require(`gulp-eslint`);//
const cssLinter = require(`gulp-stylelint`);//
const htmlValidator = require(`gulp-html`);
const babel = require(`gulp-babel`);
require(`gulp-cache`);
const del = require(`del`);
const browserSync = require(`browser-sync`);
const reload = browserSync.reload;

let browserChoice = `default`;

async function safari () {
    browserChoice = `safari`;
}

async function firefox () {
    browserChoice = `firefox`;
}

async function chrome () {
    browserChoice = `google chrome`;
}

async function edge () {
    browserChoice = `microsoft-edge`;
}

async function allBrowsers () {
    browserChoice = [
        `safari`,
        `firefox`,
        `google chrome`,
        `microsoft-edge`
    ];
}

// production tasks
let compressImg = () => {
    return src(['img/*.png, img/*.svg'])
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
        .pipe(jsLinter.formatEach('compact'));
};
let validateHTML = () => {
    return src(`*.html`)
        .pipe(htmlValidator(undefined));
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

let serve = () => {
    browserSync({
        notify: true,
        port: 9000,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `./`,
                `css`,
                `js`,
                'img'
            ]
        }
    });

    watch(`js/*.js`,
        series(lintJS, transpileJSForDev)
    ).on(`change`, reload);

    watch(`css/*.css`,
        series(lintCSS)
    ).on(`change`, reload);

    watch(`*.html`,
        series(validateHTML)
    ).on(`change`, reload);
    watch(`img/*.png`, `img/*svg`).on('change',reload);
};

async function clean() {
    let fs = require(`fs`),
        i,
        foldersToDelete = [`dev`, `prod`];

    for (i = 0; i < foldersToDelete.length; i++) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory was found and will be deleted.\n`);
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory does NOT exist or is NOT accessible.\n`);
        }
    }

    process.stdout.write(`\n`);
}

async function listTasks () {
    let exec = require(`child_process`).exec;

    exec(`gulp --tasks`, function (error, stdout, stderr) {
        if (null !== error) {
            process.stdout.write(`An error was likely generated when invoking ` +
                `the “exec” program in the default task.`);
        }

        if (`` !== stderr) {
            process.stdout.write(`Content has been written to the stderr stream ` +
                `when invoking the “exec” program in the default task.`);
        }

        process.stdout.write(`\n\tThis default task does ` +
            `nothing but generate this message. The ` +
            `available tasks are:\n\n${stdout}`);
    });
}
exports.safari = series(safari, serve);
exports.firefox = series(firefox, serve);
exports.chrome = series(chrome, serve);
exports.edge = series(edge, serve);
exports.safari = series(safari, serve);
exports.allBrowsers = series(allBrowsers, serve);
exports.validateHTML = validateHTML;
exports.minifyHTML = minifyHTML;
exports.transpileJSForDev = transpileJSForDev;
exports.minifyJs = minifyJs;
exports.uglifyCss = uglifyCss;
exports.lintJS = lintJS;
exports.lintCSS = lintCSS;
exports.compressImg=compressImg;


// public tasks
exports.build = series( uglifyCss, minifyHTML,minifyJs,compressImg);
exports.serve = series (lintJS, lintCSS,validateHTML, transpileJSForDev,serve );

exports.clean = clean;
exports.default = listTasks;
