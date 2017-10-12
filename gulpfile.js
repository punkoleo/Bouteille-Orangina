var gulp = require('gulp'); 
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps'); 
var ts = require('gulp-typescript');

var paths = { 
    tsSrc: '*.ts',
    tsDist: 'game/'
}  

gulp.task('typescript-dev', function () {
    return gulp.src(paths.tsSrc)
        .pipe(sourcemaps.init())
        .pipe(ts({
            noImplicitAny: true,
            target: 'ES5'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.tsDist));
});

gulp.task('typescript', function () {
    return gulp.src(paths.tsSrc)
        .pipe(ts({
            noImplicitAny: true,
            target: 'ES5',
            sortOutput: true
        }))
        .pipe(gulp.dest(paths.tsDist));
});

gulp.task('default', ['typescript-dev']);
gulp.task('production', ['typescript']);

gulp.task('watch', function() {
	livereload.listen();
    gulp.watch(['*.php', '*.html', '*.js']).on('change', livereload.changed);
    gulp.watch('scripts/*.ts', ['typescript-dev']);
});   