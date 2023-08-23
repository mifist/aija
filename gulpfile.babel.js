'use strict';

//import plugins       from 'gulp-load-plugins';
import yargs         from 'yargs';
import { hideBin }         from 'yargs/helpers';
import browser       from 'browser-sync';
import gulp          from 'gulp';
import rimraf        from 'rimraf';
import yaml          from 'js-yaml';
import fs            from 'fs';
import webpackStream from 'webpack-stream';
import webpack2      from 'webpack';
import named         from 'vinyl-named';
import log           from 'fancy-log';
import colors from 'ansi-colors';
import imagemin from 'gulp-imagemin';
import gulpIf       from 'gulp-if';
import fileinclude from 'gulp-file-include';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import gulpSass from "gulp-sass";
import cleanCss from "gulp-clean-css";
import autoPrefixer from "gulp-autoprefixer";
import rev from "gulp-rev";
import nodeSass from "node-sass";
    
const sass = gulpSass(nodeSass);

// Load all Gulp plugins into one variable
//const $ = plugins();

const argv = yargs(hideBin(process.argv)).argv;

console.log({argv})

// Check for --production flag
const PRODUCTION = !!(argv.production);

// Check for --development flag unminified with sourcemaps
const DEV = !!(argv.development);

// Load settings from settings.yml
const { BROWSERSYNC, COMPATIBILITY, REVISIONING, PATHS } = loadConfig();

// Check if file exists synchronously
function checkFileExists(filepath) {
  let flag = true;
  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch(e) {
    flag = false;
  }
  return flag;
}

// Load default or custom YML config file
function loadConfig() {
  log('Loading config file...');

  if (checkFileExists('config.yml')) {
    // config.yml exists, load it
    log(colors.bold(colors.cyan('config.yml')), 'exists, loading', colors.bold(colors.cyan('config.yml')));
    let ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);

  } else if(checkFileExists('config-default.yml')) {
    // config-default.yml exists, load it
    log(colors.bold(colors.cyan('config.yml')), 'does not exist, loading', colors.bold(colors.cyan('config-default.yml')));
    let ymlFile = fs.readFileSync('config-default.yml', 'utf8');
    return yaml.load(ymlFile);

  } else {
    // Exit if config.yml & config-default.yml do not exist
    log('Exiting process, no config file exists.');
    log('Error Code:', err.code);
    process.exit(1);
  }
}

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
  log( 'Folder ', colors.bold(colors.cyan('/dist')), 'is DELETED...' );
}

// Copy files out of the assets folder
// This task skips over the "images", "js", and "scss" folders, which are parsed separately
function copy() {
  return gulp.src(PATHS.assets)
    .pipe(gulp.dest(PATHS.dist + '/assets'));
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sassCompile() {
  return gulp.src([
    'src/assets/scss/main.scss',
   // 'src/assets/scss/admin.scss',
   // 'src/assets/scss/editor.scss'
  ])
    .pipe(sourcemaps.init()) 
    .pipe(
      sass.sync({
        outputStyle: 'compressed'
      })
        .on('error', sass.logError)
    ) 
    // .pipe(sourcemaps.write())
    .pipe(
      sass({
        includePaths: PATHS.sass
      })
        .on('error', sass.logError)
    )
    .pipe(autoPrefixer({
      overrideBrowserslist: COMPATIBILITY,
      flexbox: "no-2009",
      grid: "autoplace"
    }))

    .pipe(gulpIf(PRODUCTION, cleanCss({ compatibility: 'ie9' })))
    .pipe(gulpIf(!PRODUCTION, sourcemaps.write()))
    .pipe(gulpIf(REVISIONING && PRODUCTION || REVISIONING && DEV, rev()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
    .pipe(gulpIf(REVISIONING && PRODUCTION || REVISIONING && DEV, rev.manifest()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
    .pipe(browser.reload({ stream: true }));
}

// Compile HTML template part file to one file
function compileHtml() {
  return gulp
    .src(PATHS.htmlAssets)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(PATHS.dist))
    .pipe(browser.reload({ stream: true }));
}

// Combine JavaScript into one file
// In production, the file is minified
const webpack = {
  config: {
    mode: (gulpIf(PRODUCTION,  'production', 'development') ),
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules(?![\\\/]foundation-sites)/,
        },
      ],
    },
    externals: {
      jquery: 'jQuery',
    },
  },

  changeHandler(err, stats) {
    log('[webpack]', stats.toString({
      colors: true,
    }));

    //browser.reload();
  },

  build() {
    return gulp.src(PATHS.entries)
      .pipe(named())
      .pipe(webpackStream(webpack.config, webpack2)
        .on('error', (err) => {
          log('[webpack:error]', err.toString({
            colors: true,
          }));
        }),
      )
      .pipe(gulpIf(PRODUCTION, uglify().on('error', e => { console.log(e); }), ))
      .pipe(gulpIf(REVISIONING && PRODUCTION || REVISIONING && DEV,rev()))
      .pipe(gulp.dest(PATHS.dist + '/assets/js'))
      .pipe(gulpIf(REVISIONING && PRODUCTION || REVISIONING && DEV, rev.manifest()))
      .pipe(gulp.dest(PATHS.dist + '/assets/js'));
  },

  watch() {
    const watchConfig = Object.assign(webpack.config, {
      watch: true, // TODO: [DEP_WEBPACK_WATCH_WITHOUT_CALLBACK]
      devtool: 'inline-source-map',
      watchOptions: {
        ignored: ["node_modules/**"],
      },
    });

    return gulp.src(PATHS.entries)
      .pipe(named())
      .pipe(webpackStream(watchConfig, webpack2, webpack.changeHandler)
        .on('error', (err) => {
          log('[webpack:error]', err.toString({
            colors: true,
          }));
        }),
      )
      .pipe(gulp.dest(PATHS.dist + '/assets/js'));
  },
};

gulp.task('webpack:build', webpack.build);
gulp.task('webpack:watch', webpack.watch);

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src('src/assets/images/**/*')
    .pipe(
      gulpIf(PRODUCTION,
        imagemin()
      )
    )
    .pipe(gulp.dest(PATHS.dist + '/assets/images'));
}


// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  gulp.watch(PATHS.assets, copy);
  gulp.watch('src/assets/scss/**/*.scss', sassCompile)
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));
  gulp.watch('**/*.php')
    .on('change', path => log('File ' + colors.bold(colors.magenta(path)) + ' changed.'))
    .on('unlink', path => log('File ' + colors.bold(colors.magenta(path)) + ' was removed.'));
  //gulp.watch('**/*.html', compileHtml);
  gulp.watch('src/assets/images/**/*', gulp.series(images));
}

function watchHtml() {
  gulp.watch('src/pages/**/*.html', compileHtml);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build', gulp.series(clean, gulp.parallel(sassCompile, compileHtml, 'webpack:build', images, copy)));

// Build the site, run the server, and watch for file changes
gulp.task('html', gulp.series(gulp.parallel(watchHtml)));

// Build the site, run the server, and watch for file changes
gulp.task('default', gulp.series('build', gulp.parallel('webpack:watch', watch, watchHtml)));
