const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const webp = require('gulp-webp');
const del = require('del');
const csso = require('gulp-csso');

// Styles
const styles = () => {
  return gulp.src("build/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher
const watcher = () => {
  gulp.watch("build/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("build/*.html").on("change", sync.reload);
}

// Images
const images = () => {
  gulp
    .src('source/img/*.{png,jpg}')
		.pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'))
    .pipe(sync.stream());
};
exports.images = images;

exports.default = gulp.series(
  styles, server, images, watcher
);

// sprites

const sprite = () => {
  return gulp
    .src("source/img/**/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}
exports.sprite = sprite;

// copy files to build directory
const copy = () => {
  return gulp
    .src([
      "source/fonts/**/*.{woff,woff2}",
      "source/img/**",
      "source/js/**",
      "source/sass/**",
      "source/*.ico",
      "source/*.html",
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"))
}
exports.copy = copy;


// clean build directory
const clean = () => {
  return del("build")
}
exports.clean = clean;

// create build directory with all necessary directories/files
exports.build = gulp.series(
  clean, copy, server, styles, sprite
);
