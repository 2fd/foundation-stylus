var gulp = require('gulp')

  // Pulgins
  , del = require('delete')
  , concat = require('gulp-concat')
  , rename = require('gulp-rename')
  , uglify = require('gulp-uglify')
  , minifyCSS = require('gulp-minify-css')
  , stylus = require('gulp-stylus')
  , nib = require('nib')
  , zip = require('gulp-zip')
  , tar = require('gulp-tar')
  , gzip = require('gulp-gzip')
  , size = require('gulp-size')
  , gulpif = require('gulp-if')
  , replace = require('gulp-replace')

  // Config
  , assets = require('./assets.json')
  , bower = require('./bower.json')

  , isVendorJS = function(file){
    return !/foundation(\.\w+)?\.js$/i.test(file.path);
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

  .task('js', ['clean:js'],function(){
    return gulp.src(assets.js.src)
      .pipe(replace('{{VERSION}}', bower.version))
      .pipe(gulpif(isVendorJS, rename({dirname:'vendor'})))
      .pipe(gulp.dest(assets.js.dest))
      .pipe(uglify())
      .pipe(rename({extname:'.min.js'}))
      .pipe(gulp.dest(assets.js.dest))
      .pipe(size({title:'Scripts: ', showFiles:true}));
  })


  // Copy stylus files
  .task('styl', ['clean:styl'], function(){
    return gulp.src(assets.styl.src)
      .pipe(gulp.dest(assets.styl.dest))
      .pipe(size({title:'Stylesheets: ',showFiles:true}));
  })

  // Parse and minify CSS
  .task('css', ['clean:css'],function(){
    return gulp.src(assets.css.src)
      .pipe(gulpif('*.styl', stylus({ use: nib() }))      )
      .pipe(gulp.dest(assets.css.dest))
      .pipe(minifyCSS())
      .pipe(rename({extname:'.min.css'}))
      .pipe(gulp.dest(assets.css.dest))
      .pipe(size({title:'Stylesheets: ', showFiles:true}));
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
    return gulp.src(assets.pack.src)
      .pipe(tar(assets.pack.name.replace('{version}', bower.version) + '.tar'))
      .pipe(gzip())
      .pipe(gulp.dest(assets.pack.dest));
  })

  .task('pack:zip', function(){
    return gulp.src(assets.pack.src)
      .pipe(zip(assets.pack.name.replace('{version}', bower.version) + '.zip'))
      .pipe(gulp.dest(assets.pack.dest));
  })

  // Watch
  .task('watch', function(){
    gulp.watch(assets.js.foundation, ['js']);
    gulp.watch(assets.js.vendor, ['js']);
    gulp.watch(assets.styl.src, ['styl','css']);
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
