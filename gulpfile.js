var gulp = require('gulp')

  // Pulgins
  , del = require('delete')
  , nib = require('nib')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , minifyCSS = require('gulp-minify-css')
  , watch = require('gulp-watch')
  , stylus = require('gulp-stylus')
  , zip = require('gulp-zip')
  , tar = require('gulp-tar')
  , gzip = require('gulp-gzip')
  , size = require('gulp-size')

  // Config
  , assets = require('./assets.json')
  , bower = require('./bower.json')
;

gulp

  // Clen
  .task('clean', ['clean:js', 'clean:styl', 'clean:css', 'clean:pack'])

  .task('clean:scripts', ['clean:js'])
  .task('clean:js', function(){
    del.sync(assets.js.dest);
  })

  .task('clean:stylus', ['clean:styl'])
  .task('clean:styl', function(){
    del.sync(assets.styl.dest);
  })

  .task('clean:stylesheets', ['clean:css'])
  .task('clean:css', function(){
    del.sync(assets.css.dest);
  })

  .task('clean:pack', function(){
    del.sync(assets.pack.dest);
  })

  // Scripts
  .task('scripts', ['js'])
  .task('js', ['clean:js', 'js:foundation', 'js:vendor'], function(){
    return gulp.src(assets.js.orig)
      .pipe(gulp.dest(assets.js.dest))
      .pipe(uglify())
      .pipe(rename({extname:'.min.js'}))
      .pipe(gulp.dest(assets.js.dest))
      .pipe(size({showFiles:true}));
  })

  .task('js:foundation', function(){
    return gulp.src(assets.js.foundation)
      .pipe(rename({dirname:'foundation'}))
      .pipe(gulp.dest(assets.js.dest))
      .pipe(uglify())
      .pipe(rename({extname:'.min.js'}))
      .pipe(gulp.dest(assets.js.dest))
      .pipe(size({showFiles:true}));
  })

  .task('js:vendor', function(){
    return gulp.src(assets.js.vendor)
      .pipe(rename({dirname:'vendor'}))
      .pipe(gulp.dest(assets.js.dest))
      .pipe(uglify())
      .pipe(rename({extname:'.min.js'}))
      .pipe(gulp.dest(assets.js.dest))
      .pipe(size({showFiles:true}));
  })

  // Copy stylus files
  .task('stylus', ['styl'])
  .task('styl', ['clean:styl'], function(){
    return gulp.src(assets.styl.orig)
      .pipe(gulp.dest(assets.styl.dest))
      .pipe(size({showFiles:true}));
  })

  // Parse and minify CSS
  .task('stylesheets', ['css'])
  .task('css', function(){
    return gulp.src(assets.css.styl)
      .pipe(stylus({ use: nib() }))
      .pipe(gulp.src(assets.css.vendor))
      .pipe(gulp.dest(assets.css.dest))
      .pipe(minifyCSS())
      .pipe(rename({extname:'.min.css'}))
      .pipe(size({title:'Stylesheets: ', showFiles:true}))
      .pipe(gulp.dest(assets.css.dest));
  })

  // Copy bower file
  .task('bower', function(){
    return gulp.src('bower.json')
      .pipe(gulp.dest(assets.pack.vendor));
  })

  // Generate packs
  .task('pack', ['bower', 'js', 'css', 'styl'], function (){
    return gulp.start(['pack:zip', 'pack:tar.gz']);
  })

  .task('pack:tar.gz', function(){
    return gulp.src(assets.pack.orig)
      .pipe(tar(assets.pack.name.replace('{version}', bower.version) + '.tar'))
      .pipe(gzip())
      .pipe(gulp.dest(assets.pack.dest));
  })

  .task('pack:zip', function(){
    return gulp.src(assets.pack.orig)
      .pipe(zip(assets.pack.name.replace('{version}', bower.version) + '.zip'))
      .pipe(gulp.dest(assets.pack.dest));
  })

  // Watch
  .task('watch', function(){
    gulp.watch(assets.js.foundation, ['js']);
    gulp.watch(assets.js.vendor, ['js']);
    gulp.watch(assets.styl.orig, ['styl','css']);
    gulp.watch(assets.css.vendor, ['css']);
    gulp.watch('bower.json', ['bower']);
  })

  //
  .task('default', ['bower', 'js', 'css', 'styl'])
  .task('dev', ['default', 'watch'])
  .task('releas', ['clean'],function(){
    gulp.start('pack');
  })
;
