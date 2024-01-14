const {
    src,
    dest,
    watch,
    series
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create();

// Path to files
const paths = {
    scss: {
        src: './scss/**/*.scss',
        dest: './dist/css',
    },
    js: {
        src: './js/**/*.js',
        dest: './dist/js',
    },
    html: {
        src: './*.html',
        dest: './dist'
    },
    img: {
        src: './images/**/*.*',
        dest: './dist/images'
    }
}

// Styles file proccessing

function styleTask() {
    console.log('style')
    return src(paths.scss.src, { sourcemaps: true })
        .pipe(concat('style.css'))
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(dest(paths.scss.dest, { sourcemaps: '.' }))
        .pipe(browserSync.stream())

}

// JavaScript files proccessing

function jsTask() {
    return src(paths.js.src, { sourcemaps: true })
        .pipe(concat('all.js'))
        .pipe(terser())
        .pipe(dest(paths.js.dest, { sourcemaps: '.' }))
        .pipe(browserSync.stream())
}
// HTML files proccessing

function htmlTask() {
    return src(paths.html.src)
        .pipe(dest(paths.html.dest))
}

// Image files proccessing

function imageTask() {
    return src(paths.img.src)
        .pipe(imagemin())
        .pipe(dest(paths.img.dest))
}

// Changes detection

function watchTask() {
    // Initialize browser sync
    browserSync.init(({
        server: {
            baseDir: './dist'
        }
    }));

    // Watching for changes
    watch(paths.html.src, htmlTask).on('change', browserSync.reload);
    watch(paths.img.src, imageTask);
    watch([paths.scss.src, paths.js.src], series(styleTask, jsTask));
}

// Export default task
exports.default = series(
    styleTask,
    jsTask,
    imageTask,
    htmlTask,
    watchTask
);