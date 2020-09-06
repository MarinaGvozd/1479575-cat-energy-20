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

// Local section
// ------------------------------------------------------
// Styles Local
const stylesLocal = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("styles.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}
exports.stylesLocal = stylesLocal


// Server Local
const serverLocal = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}
exports.serverLocal = serverLocal;

// Watcher
const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

// Images Local
const imagesLocal = () => {
  gulp
    .src('source/img/*.{png,jpg}')
		.pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('source/img'))
    .pipe(sync.stream());
};
exports.imagesLocal = imagesLocal;

// Production section - make a Build
// ------------------------------------------------------------------------
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

// Images
const images = () => {
  gulp
    .src('source/img/*.{png,jpg}')
		.pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'))
    .pipe(sync.stream());
};
exports.images = images;

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


// satrt local environment
exports.default = gulp.series(
  stylesLocal, imagesLocal, watcher, serverLocal
);

// create build directory with all necessary directories/files
// start prod environmetn - make a Build
exports.build = gulp.series(
  clean, copy, styles, images, sprite
);
