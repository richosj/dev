const gulp = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const changed = require('gulp-changed');
const fileSync = require('gulp-file-sync'),
  webpack = require('webpack-stream');

const DefaultFold = '';




const PATH = {
  ROOT: './',
  HTML: './html',
  INC: './html/include',
  ASSETS: {
    ROOT: './src',
    FONTS: './src/fonts',
    IMAGES: './src/images',
    STYLE: './src/style',
    SCRIPT: './src/script',
    SCRIPTMERGE: './src/scriptmerge',
    LIB: './src/lib'
  }
}

const DEST_PATH = {
  HTML: `./dist/${DefaultFold}`,
  INC: `./dist/${DefaultFold}include`,
  ASSETS: {
    FONTS: `./common/fonts`,
    IMAGES: `./common/${DefaultFold}images`,
    STYLE: `./common/${DefaultFold}css`,
    SCRIPT: `./common/${DefaultFold}js`,
    LIB: `./common/libjs`,
  }
}

const fileIncludeOpt = {
  prefix: '@@',
  basepath: '@file',
  context: {
    'webRoot': ".",
    'htmlRoot': '.',
    'contCate': 1,
    'imageRoot': `./common/${DefaultFold}images`,
    'cssRoot': `./common/${DefaultFold}css`,
    'loginis': 'Y'
  }
}

const browsSyncOpt = {
  stream: true,
  // match: "화면목록.html"
}

gulp.task('clear', () => {
  return new Promise(resolve => {
    del.sync(['./common']);
    resolve();
  });
});

gulp.task('librarySync', () => {
  return new Promise(resolve => {
    fileSync(PATH.ASSETS.LIB, DEST_PATH.ASSETS.LIB, {
      recursive: true
    });

    gulp.src(PATH.ASSETS.FONTS + '/*.*')
      .pipe(browserSync.reload(browsSyncOpt));

    resolve();
  });
});

gulp.task('serverCopy', () => {
  return new Promise(resolve => {
    gulp.src([
        './dist/**/*.*',
        '!./dist/fdevjs/*.*'
      ])
      .pipe(gulp.dest(SERVER_PATH));
    resolve();
  });
});

gulp.task('script:copy', () => {
  return new Promise(resolve => {
    gulp.src([
        PATH.ASSETS.SCRIPT + '/**/*.*'
      ])
      .pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
      .pipe(browserSync.reload({
        stream: true
      }));
    resolve();
  });
});

gulp.task('fontsSync', () => {
  return new Promise(resolve => {
    fileSync(PATH.ASSETS.FONTS, DEST_PATH.ASSETS.FONTS, {
      recursive: true
    });

    gulp.src(PATH.ASSETS.FONTS + '/*.*')
      .pipe(browserSync.reload({
        stream: true
      }));

    resolve();
  });
});

gulp.task('imagesSync', () => {
  return new Promise(resolve => {

    fileSync(PATH.ASSETS.IMAGES, DEST_PATH.ASSETS.IMAGES, {
      recursive: true
    });

    gulp.src(PATH.ASSETS.IMAGES + '/**/*.*')
      .pipe(browserSync.reload({
        stream: true
      }));

    resolve();
  });
});

gulp.task('nodemon:start', () => {
  return new Promise(resolve => {
    nodemon({
      script: 'app.js',
      watch: 'app'
    });

    resolve();
  });
});

// script merge
gulp.task('script:bulid', () => {
  return new Promise(resolve => {
    gulp.src([
        // '!' + PATH.ASSETS.SCRIPTMERGE + '/_*.js'
        PATH.ASSETS.SCRIPTMERGE + '/test.js'
      ])
      .pipe(concat('common.js'))
      .pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
      // .pipe( uglify({
      //   mangle: true
      // }) )
      // .pipe( rename('common.min.js') )
      // .pipe( gulp.dest(DEST_PATH.ASSETS.SCRIPT) )
      .pipe(browserSync.reload({
        stream: true
      }));

    resolve();
  });
});

// script pub test js
gulp.task('script:testjs', () => {
  return new Promise(resolve => {
    gulp.src(PATH.ASSETS.SCRIPT + '/**.*')
      .pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
      .pipe(browserSync.reload({
        stream: true
      }));

    resolve();
  });
});

gulp.task('scss:compile', () => {
  return new Promise(resolve => {
    var options = {
      outputStyle: "expanded",
      // indentType: "space",
      // indentWidth: 2
    };

    gulp.src(PATH.ASSETS.STYLE + '/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(scss.sync().on('error', scss.logError))
      .pipe(scss(options))
      .pipe(gulp.dest(DEST_PATH.ASSETS.STYLE))
      .pipe(browserSync.reload({
        stream: true
      }));

    resolve();
  });
});

gulp.task('css:copy', () => {
  return new Promise(resolve => {
    gulp.src(PATH.ASSETS.STYLE + '/**/*.css')
      .pipe(gulp.dest(DEST_PATH.ASSETS.STYLE));
    resolve();
  });
});

gulp.task('scssguide:compile', () => {
  return new Promise(resolve => {
    var options = {
      outputStyle: "compressed",
    };

    gulp.src(PATH.HTML + '/guide/*.scss')
      .pipe(sourcemaps.init())
      .pipe(scss.sync().on('error', scss.logError))
      .pipe(scss(options))
      .pipe(sourcemaps.write('./maps'))
      .pipe(gulp.dest(DEST_PATH.HTML + '/guide'))
      .pipe(browserSync.reload({
        stream: true
      }));

    resolve();
  });
});

//html 초기 컴파일
gulp.task('html', () => {
  return new Promise(resolve => {
    gulp.src([
        PATH.HTML + '/**/*.*',
        '!' + PATH.HTML + '/include/*.*',
        '!' + PATH.HTML + '/popupinc/*.*',
        '!' + PATH.HTML + '/fdevjs/*.*'
      ])
      .pipe(changed(DEST_PATH.HTML))
      .pipe(fileinclude(fileIncludeOpt))
      .pipe(gulp.dest(DEST_PATH.HTML))
    resolve();
  });
});

//html  browserSync 적용 gulp watch에서 사용
gulp.task('htmlSync', () => {
  return new Promise(resolve => {
    gulp.src([
        PATH.HTML + '/**/*.*',
        '!' + PATH.HTML + '/include/*.*',
        '!' + PATH.HTML + '/popupinc/*.*',
      ])
      .pipe(changed(DEST_PATH.HTML))
      .pipe(fileinclude(fileIncludeOpt))
      .pipe(gulp.dest(DEST_PATH.HTML))
      .pipe(browserSync.reload(browsSyncOpt));
    resolve();
  });
});


var getDir = function (pwd) {
  return pwd.replace(/[^\/]*$/, '');
};


var getFilename = function (pwd) {
  return pwd.replace(/\\/gi, '/');
};

gulp.task('watch', () => {
  return new Promise(resolve => {
    gulp.watch(PATH.HTML + '/**/*.*', gulp.series(['htmlSync']));

    gulp.watch(PATH.ASSETS.STYLE + "/**/*.scss", gulp.series(['scss:compile']));
    gulp.watch(PATH.ASSETS.STYLE + "/**/*.css", gulp.series(['css:copy']));
    gulp.watch(PATH.HTML + '/guide/*.scss', gulp.series(['scssguide:compile']));

    gulp.watch(PATH.ASSETS.SCRIPT + "/**/*.js", gulp.series(['script:testjs']));

    gulp.watch(PATH.ASSETS.LIB + "/**/*.*", gulp.series(['librarySync']));
    gulp.watch(PATH.ASSETS.IMAGES + "/**/*.*", gulp.series(['imagesSync']));
    resolve();
  });
});

gulp.task('borwserSync', () => {
  return new Promise(resolve => {
    browserSync.init({
      server: {
        baseDir: './'
      }
    }, {
      proxy: 'http://127.0.0.1:8100',
      port: 8110,
      open: false,
      notify: false,
      ghostMode: false,
    });
    resolve();
  });
});

gulp.task('default', gulp.series([
  'nodemon:start',
  'imagesSync',
  'fontsSync',
  'librarySync',
  'html',
  'script:copy',
  'script:testjs',
  'scss:compile',
  'css:copy',
  'scssguide:compile',
  'borwserSync',
  'watch'
]));