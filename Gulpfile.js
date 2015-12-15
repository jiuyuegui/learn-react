var gulp = require('gulp');

var jshint = require('gulp-jshint'),	
    concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel');

//检查脚本
gulp.task('lint', function() {		//lint任务检查js/目录下js有没有报错或警告，双星号表示0~多个文件夹
	return gulp.src('./src/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//合并，压缩文件
gulp.task('test', function() {
	return gulp.src('./src/js/home/index.js')
		.pipe(babel())
		.pipe(gulp.dest('./dist'));	//输出到dest目录
		// .pipe(rename('index.min.js'))	//重命名为all.min.js
		// .pipe(uglify())				//压缩打包
		// .pipe(gulp.dest('./dist'));
});


//合并，压缩文件
gulp.task('scripts', function() {
	return gulp.src('./src/js/**/*.js')
		.pipe(concat('all.js'))		//合并所有js文件为all.js
		.pipe(babel())
		.pipe(gulp.dest('./dist'))	//输出到dest目录
		.pipe(rename('all.min.js'))	//重命名为all.min.js
		.pipe(uglify())				//压缩打包
		.pipe(gulp.dest('./dist'));
});

//默认任务是基于其他任务的
gulp.task('default', function() {
	gulp.run('lint', 'scripts');	//关联并运行已定义的任务

	//监听文件变化
	gulp.watch('./src/js/**/*.js', function() {
		gulp.run('lint', 'scripts');
	});
});

//task, run, watch, src, dest是gulp的五个基本方法