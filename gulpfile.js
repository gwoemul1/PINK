"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require ("gulp-csso");
const rename = require ("gulp-rename");
const server = require("browser-sync").create();
const imagemin = require ("gulp-imagemin");
const del = require("del");
const posthtml = require ("gulp-posthtml");
const include = require("posthtml-include");
const htmlmin = require ("gulp-htmlmin");
const jsmin = require("gulp-jsmin");
const babel = require("gulp-babel");
const svgstore = require("gulp-svgstore");
const gulpImport = require('gulp-html-import');

gulp.task("sprite", function () {
  return gulp.src("source/img/icon/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", () => gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ])));

gulp.task("css", () => gulp.src("source/sass/style.scss")
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer()
  ]))
  .pipe(csso())
  .pipe(rename("style.min.css"))
  .pipe(sourcemap.write("."))
  .pipe(gulp.dest("build/css"))
  .pipe(server.stream()));

gulp.task("copy", () => gulp.src([
  "source/fonts/**/*.{woff,woff2}",
  "source/img/**",
  "source/*.ico"
], {
  base: "source"
})
  .pipe(gulp.dest("build")));

gulp.task ("html", () => gulp.src("source/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("build")));

gulp.task("compress", () => gulp.src("source/js/*.js")
  .pipe(babel({
    presets: ["@babel/env"]
  }))
  .pipe(jsmin())
  .pipe(rename({suffix: ".min"}))
  .pipe(gulp.dest("build/js")));

gulp.task("clean", () => del("build"));

// gulp.task("import", function () {
//   gulp.src('./source/*.html')
//       .pipe(gulpImport('./source/components/'))
//       .pipe(gulp.dest('build')); 
// });

gulp.task("server", () => {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.task("refresh", done => {
    server.reload();
    done();
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "html",
  "compress"
));

gulp.task("start", gulp.series("build", "server"));