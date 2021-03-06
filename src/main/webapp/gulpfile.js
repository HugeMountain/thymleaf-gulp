'use strict';

var gulp = require('gulp');
var bowerFiles = require('main-bower-files');  //插入bower文件
var inject = require('gulp-inject');   //文件插入
var es = require('event-stream');   //文件插入
var uglify = require('gulp-uglify');  //js压缩
var concat = require('gulp-concat');  //合并文件
var minifyCSS = require('gulp-minify-css');  //css压缩
var sass = require('gulp-sass');  //scss
var changedInPlace = require('gulp-changed-in-place');//不管修改哪个文件，gulp会简化DEST里的html文件
var minifyHTML = require('gulp-minify-html');  //简化html
var browserSync = require('browser-sync').create(); //自动刷新
var babel = require('gulp-babel'); //支持es6
// var argv = require('yargs').argv; //支持不同环境
var sequence = require('gulp-sequence'); //按照顺序执行
var watch = require('watch');  //监听
var clean = require('gulp-clean');  //监听
var jshint = require('gulp-jshint');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var connect = require('gulp-connect');
var pkg = require('./package.json');

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

var DIST_PATH = 'dist/';

var SRC_PATH = {
    js: 'app/**/*',
    scss: 'static/scss/index.scss',
    css: 'static/css/**/*.css',
    html: '../resources/templates/',
    image: 'static/images/**/*.+(png|jpg|gif|svg)',
    fonts: 'static/fonts/**/*'
};


/**
 * Clean ups ./dist folder
 */
gulp.task('clean', function () {
    return gulp
        .src(DIST_PATH, {read: false})
        .pipe(clean({force: true}))
        .on('error', log);
});

/**
 * JShint all *.js files
 */
gulp.task('lint', function () {
    return gulp.src(SRC_PATH.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * minify js
 */
gulp.task('minifyjs', function () {
    gulp.src(SRC_PATH.js)
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(DIST_PATH + 'static/js'))
});

/**
 * minify css
 */
gulp.task('minifycss', function () {
    gulp.src(SRC_PATH.css)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest(DIST_PATH + 'static/css'));
});

gulp.task('minifyhtml', function(){
    gulp.src(SRC_PATH.html)
        .pipe(changedInPlace({firstPass: true}))
        .pipe(minifyHTML({collapseWhitespace: true}))
        .pipe(gulp.dest(DIST_PATH))
        .pipe(browserSync.stream());
});

//task to optimize images (imagemin)
gulp.task('images', function(){
    return gulp.src(SRC_PATH.image)
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(DIST_PATH + 'static/images'))

});

gulp.task('fonts', function() {
    return gulp.src(SRC_PATH.fonts)
        .pipe(gulp.dest(DIST_PATH + 'fonts'))
});

gulp.task('build', function(callback) {
    runSequence('clean:dist',
        ['minifyjs', 'minifycss', 'images', 'fonts', 'minifyhtml'],
        callback
    )

});


/**
 * Live reload web server of `dist`
 */
gulp.task('connect', function() {
    connect.server({
        root: 'dist',
        livereload: true
    });
});

gulp.task('copyBower', function() {
   return  gulp.src(bowerFiles())
       .pipe(gulp.dest('static/plugin'));
});

gulp.task('inject', function(done) {
    gulp.src(SRC_PATH.html + 'layouts/main.html')
        .pipe(inject(gulp.src('static/plugin/*', {read: false}), {name: 'bower'}))
        .pipe(inject(es.merge(
            gulp.src(SRC_PATH.css, {read: false}),
            gulp.src(SRC_PATH.js, {read: false})
        )))
        .pipe(gulp.dest(SRC_PATH.html + 'layouts'));
    done();
});


gulp.task('scss', function (done) {
    gulp.src('static/scss/index.scss')
        .pipe(sass())
        .pipe(minifyCSS())
        .on('error', function(error){ console.error(error.toString && error.toString());})
        .pipe(gulp.dest('static/css'));
    done()
});

gulp.task('watch', function(){

    gulp.watch(SRC_PATH.scss, ['compileCss']); // CSS

});

gulp.task('default', gulp.series('copyBower', 'scss', 'inject'));
