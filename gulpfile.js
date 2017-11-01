/**
 * Created by munveergill on 18/01/2017.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var del = require('del');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var useref = require('gulp-useref');
var mongodbData = require('gulp-mongodb-data');
var mocha = require('gulp-mocha');



//  The following address can be used to quickly run the application
//  with the 'gulp run' command, and link it to an already running
//  backend instance
var BASE_DEST_FOLDER = 'public/release/';

const SOURCE_BOWER_COMPONENTS = [
    'public/bower_components/jquery/dist/jquery.min.js',
    'public/bower_components/angular/angular.min.js',
    'public/bower_components/angular-ui-router/release/angular-ui-router.min.js',
    'public/bower_components/angular-bootstrap/ui-bootstrap.min.js',
    'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'public/bower_components/bootstrap/dist/js/bootstrap.min.js',
    'public/bower_components/masonry/dist/masonry.pkgd.min.js',
    'public/bower_components/jquery-bridget/jquery-bridget.js',
    'public/bower_components/ev-emitter/ev-emitter.js',
    'public/bower_components/desandro-matches-selector/matches-selector.js',
    'public/bower_components/desandro-matches-selector/matches-selector.js',
    'public/bower_components/get-size/get-size.js',
    'public/bower_components/outlayer/item.js',
    'public/bower_components/outlayer/outlayer.js',
    'public/bower_components/masonry/masonry.js',
    'public/bower_components/imagesloaded/imagesloaded.js',
    'public/bower_components/angular-cookies/angular-cookies.min.js',
    'public/bower_components/angular-material/angular-material.min.js',
    'public/bower_components/angular-animate/angular-animate.min.js',
    'public/bower_components/angular-aria/angular-aria.min.js',
    'public/bower_components/moment/min/moment.min.js',
    'public/bower_components/moment/min/moment-with-locales.min.js'
];

gulp.task('connect', ['clean', 'default'], function () {
    connect.server({
        root: ['public/release/'],
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
        'public/src/**/*'
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
            'public/src/head/head.html',
            'public/src/**/!(footer)*.html',
            'public/src/footer/footer.html'
        ])
        .pipe(concat('index.html'))
        .pipe(gulp.dest(BASE_DEST_FOLDER));
});

gulp.task('gen-js', function () {
    return gulp.src([
            'public/src/app.js',
            'public/src/**/*.js'
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
            'public/bower_components/bootstrap/dist/css/bootstrap.min.css',
            'public/bower_components/angularjs-slider/dist/rzslider.min.css',
            'public/bower_components/angular-material/angular-material.min.css'
        ])
        .pipe(concat('lib.css'))
        .pipe(gulp.dest(BASE_DEST_FOLDER));
});

gulp.task('gen-css', function () {
    return gulp.src([
            'public/src/global/global.scss',
            'public/src/**/*.scss'
        ])
        .pipe(concat('app.scss'))
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest(BASE_DEST_FOLDER));
});

gulp.task('copy-static', function () {
    return gulp.src([
            'public/src/static/**/*'
        ])
        .pipe(gulp.dest(BASE_DEST_FOLDER + '/static'));
});

gulp.task('copy-fonts', function () {
    return gulp.src([
            'public/bower_components/bootstrap/dist/fonts/*'
        ])
        .pipe(gulp.dest(BASE_DEST_FOLDER + '/fonts/'));
});

gulp.task('clean', function (cb) {
    return del([
        BASE_DEST_FOLDER
    ], cb);
});

gulp.task('backend-unit-tests', function () {
    gulp.src('./server/tests/*.js')
        .pipe(mocha({
            reporter: 'list', //can change this to 'list' to see details of tests.
            clearRequireCache: true,
            ignoreLeaks: true
        }));
});

gulp.task('load-recipes-data', function () {
    loadDataIntoDataBase('./web-scraper/recipes.json', 'recipes');
});
gulp.task('load-user-data', function () {
    loadDataIntoDataBase('./web-scraper/users.json', 'users');
});
gulp.task('load-data', ['load-recipes-data', 'load-user-data']);

var loadDataIntoDataBase = function loadData(source, collectionName) {
    gulp.src(source)
        .pipe(mongodbData({
            mongoUrl: 'mongodb://localhost/foodie',
            collectionName: collectionName,
            dropCollection: true
        }))
        .on('error', function (e) {
            throw e;
        });
};