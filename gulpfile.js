var gulp = require('gulp')

  // Pulgins
  , del = require('delete')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , csso = require('gulp-csso')
  , plumber = require('gulp-plumber')
  , stylus = require('gulp-stylus')
  , nib = require('nib')
  , zip = require('gulp-zip')
  , tar = require('gulp-tar')
  , gzip = require('gulp-gzip')
  , size = require('gulp-size')
  , replace = require('gulp-replace')

  // Config
  , assets = require('./assets.json')
  , bower = require('./bower.json')
  , bowerFiles = ['bower.json', '.bowerrc']

  // Pre-Build
  , listFiles = function(title){
    return size({title:title, showFiles:true})
  }
  , setVersion = function(){
    return replace('{{VERSION}}', bower.version)
  }
;

gulp

  // Clen
  .task('clean', ['clean:js', 'clean:styl', 'clean:css', 'clean:pack'])

  .task('clean:js', function(){
    del.sync(assets.js.dest);
  })

  .task('clean:styl', function(){
    del.sync(assets.styl.dest);
  })

  .task('clean:css', function(){
    del.sync(assets.css.dest);
  })

  .task('clean:pack', function(){
    del.sync(assets.pack.dest);
  })

  // Copy js files
  .task('js', ['clean:js'],function(){
    return gulp.src(assets.js.src)

      // Save uncompressed
      .pipe(setVersion())
      .pipe(gulp.dest(assets.js.dest))

      // Save compressed
      .pipe(uglify())
      .pipe(rename({extname:'.min.js'}))
      .pipe(gulp.dest(assets.js.dest))

      // Log
      .pipe(listFiles('Scripts: '));
  })


  // Copy stylus files
  .task('styl', ['clean:styl'], function(){
    return gulp.src(assets.styl.src)
      .pipe(gulp.dest(assets.styl.dest))
      .pipe(listFiles('Stylus: '));
  })

  // Parse and minify CSS
  .task('css', ['clean:css'],function(){
    return gulp.src(assets.css.src)

      // Parse
      .pipe(plumber())
      .pipe(stylus({ use: nib() }))
      .pipe(plumber.stop())

      // Save uncompressed
      .pipe(setVersion())
      .pipe(gulp.dest(assets.css.dest))

      // Save compressed
      .pipe(csso())
      .pipe(rename({extname:'.min.css'}))
      .pipe(gulp.dest(assets.css.dest))

      // Log
      .pipe(listFiles('Stylesheets: '));
  })

  // Copy bower file
  .task('bower', function(){
    return gulp.src(bowerFiles)
      .pipe(gulp.dest(assets.pack.vendor));
  })

  // Generate packs
  .task('pack', ['bower', 'js', 'css', 'styl'], function (){
    return gulp.start(['pack:zip', 'pack:tar.gz']);
  })

  // Generate .tar.gz
  .task('pack:tar.gz', function(){
    return gulp.src(assets.pack.src)
      .pipe(tar(assets.pack.name.replace('{version}', bower.version) + '.tar'))
      .pipe(gzip())
      .pipe(gulp.dest(assets.pack.dest));
  })

  // Generate .zip
  .task('pack:zip', function(){
    return gulp.src(assets.pack.src)
      .pipe(zip(assets.pack.name.replace('{version}', bower.version) + '.zip'))
      .pipe(gulp.dest(assets.pack.dest));
  })

  // Watch
  .task('watch', function(){
    gulp.watch(assets.styl.src, ['css']);
  })

  //
  .task('default', ['bower', 'js', 'css', 'styl'])
  .task('dev', ['default', 'watch'])
  .task('releas', ['clean'],function(){
    gulp.start('pack');
  })
;
