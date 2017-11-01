var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var del = require('del');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
//var argv = require('yargs').argv;
var useref = require('gulp-useref');


//  The following address can be used to quickly run the application
//  with the 'gulp run' command, and link it to an already running
//  backend instance
//var BACKEND_ENDPOINT = 'http://192.168.99.100:8080';
var BASE_DEST_FOLDER = './release/';

const SOURCE_BOWER_COMPONENTS = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/angular/angular.min.js',
    'bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js'
];

gulp.task('connect', ['clean', 'default'], function () {
    connect.server({
        root: ['./release/'],
        livereload: true,
        port: 8000
    });
});

gulp.task('reloadAll', ['buildOnly'], function () {
    gulp.src(BASE_DEST_FOLDER)
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    return gulp.watch([
        'src/**/*'
    ], ['reloadAll']);
});

gulp.task('run', ['connect', 'watch']);

gulp.task('default', ['buildOnly']);

gulp.task('buildOnly', ['clean'], function () {
    gulp.start([
        'gen-html',
        'gen-js',
        'gen-lib-js',
        'gen-lib-css',
        'gen-css',
        'copy-static',
        'copy-fonts'
    ]);
});

gulp.task('start', function () {
    gulp.start([
        'gen-html',
        'gen-js',
        'gen-lib-js',
        'gen-lib-css',
        'gen-css',
        'copy-static',
        'copy-fonts'
    ]);
});

gulp.task('dev', ['clean', 'default'], function () {
    return gulp.watch([
        'src/**/*'
    ], ['default']);
});

gulp.task('gen-html', function () {
    return gulp.src([
            'src/head/head.html',
            'src/**/!(footer)*.html',
            'src/footer/footer.html'
        ])
        .pipe(concat('index.html'))
        .pipe(gulp.dest(BASE_DEST_FOLDER));
});

gulp.task('gen-js', function () {
    return gulp.src([
            'src/app.js',
            'src/**/*.js'
        ])
        .pipe(concat('app.js'))
        .pipe(gulp.dest(BASE_DEST_FOLDER));
});

gulp.task('gen-lib-js', function () {

    return gulp.src(SOURCE_BOWER_COMPONENTS)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(BASE_DEST_FOLDER));
});

gulp.task('gen-lib-css', function () {
    return gulp.src([
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/angularjs-slider/dist/rzslider.min.css'
        ])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest(BASE_DEST_FOLDER));
});

gulp.task('gen-css', function () {
    return gulp.src([
            'src/global/global.scss',
            'src/**/*.scss'
        ])
        .pipe(concat('app.scss'))
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(BASE_DEST_FOLDER));
});

gulp.task('copy-static', function () {
    return gulp.src([
            'src/static/**/*'
        ])
        .pipe(gulp.dest(BASE_DEST_FOLDER + '/static'));
});

gulp.task('copy-fonts', function () {
    return gulp.src([
            'bower_components/bootstrap/dist/fonts/*'
        ])
        .pipe(gulp.dest(BASE_DEST_FOLDER + '/fonts/'));
});

gulp.task('clean', function (cb) {
    return del([
        BASE_DEST_FOLDER
    ], cb);
});

