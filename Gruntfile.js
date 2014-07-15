module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vendor: grunt.file.readJSON('.bowerrc').directory,

    foundation: {
      js: ['js/foundation/foundation.js', 'js/foundation/foundation.*.js'],
      styl: ['styl/foundation.styl']
    },

    stylus: {
      compile: {
        options: {
          compress: false
        },
        files: {
          'dist/assets/css/foundation.css': '<%= foundation.styl %>',
          'dist/assets/css/normalize.css': 'styl/normalize.styl',
        }
      }
    },

    concat: {
      dist: {
        files: {
          'dist/assets/js/foundation.js': '<%= foundation.js %>'
        }
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      dist: {
        files: {
          'dist/assets/js/foundation.min.js': ['<%= foundation.js %>']
        }
      },
      vendor: {
        files: {
          'dist/assets/js/vendor/placeholder.js': '<%= vendor %>/jquery-placeholder/jquery.placeholder.js',
          'dist/assets/js/vendor/fastclick.js': '<%= vendor %>/fastclick/lib/fastclick.js',
          'dist/assets/js/vendor/jquery.cookie.js': '<%= vendor %>/jquery.cookie/jquery.cookie.js',
          'dist/assets/js/vendor/jquery.js': '<%= vendor %>/jquery/dist/jquery.js',
          'dist/assets/js/vendor/modernizr.js': '<%= vendor %>/modernizr/modernizr.js'
        }
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/assets/css/',
        src: ['normalize.css', 'foundation.css'],
        dest: 'dist/assets/css/',
        ext: '.min.css'
      }
    },

    copy: {
      dist: {
        files: [
          {expand:true, cwd: 'js/', src: ['foundation/*.js'], dest: 'dist/assets/js', filter: 'isFile'},
          {src: 'bower.json', dest: 'dist/assets/'}
        ]
      }
    },

    clean: ['dist/'],

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dist/'
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js',
        runnerPort: 9999,
      },
      continuous: {
        singleRun: true,
        browsers: ['TinyPhantomJS', 'SmallPhantomJS']
      },
      dev: {
        singleRun: true,
        browsers: ['TinyPhantomJS', 'SmallPhantomJS', 'TinyChrome', 'Firefox'],
        reporters: 'dots'
      },
      dev_watch: {
        background: true,
        browsers: ['TinyPhantomJS', 'SmallPhantomJS', 'TinyChrome', 'Firefox']
      },
      mac: {
        singleRun: true,
        browsers: ['TinyPhantomJS', 'SmallPhantomJS', 'TinyChrome', 'Firefox', 'Safari'],
        reporters: 'dots'
      },
      win: {
        singleRun: true,
        browsers: ['TinyPhantomJS', 'SmallPhantomJS', 'TinyChrome', 'Firefox', 'IE'],
        reporters: 'dots'
      }
    },

    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: ['Gruntfile.js']
      },
      karma: {
        files: [
          'dist/assets/js/*.js',
          'spec/**/*.js',
          'dist/assets/css/*.css'
        ],
        tasks: ['karma:dev_watch:run']
      },
      styl: {
        files: ['styl/**/*.styl'],
        tasks: ['styl','cssmin'],
        options: {
          livereload:true
        }
      },
      js: {
        files: ['js/**/*.js', 'doc/assets/js/**/*.js'],
        tasks: ['copy', 'concat', 'uglify'],
        options: {livereload:true}
      },
    }
  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-newer');;

  grunt.task.registerTask('watch_start', ['karma:dev_watch:start', 'watch']);
  grunt.registerTask('build:assets', ['clean', 'stylus', 'cssmin', 'concat', 'uglify', 'copy']);
  grunt.registerTask('build', ['build:assets']);
  grunt.registerTask('travis', ['build', 'karma:continuous']);
  //grunt.registerTask('travis', ['build']);
  grunt.registerTask('develop', ['travis', 'watch_start']);
  grunt.registerTask('deploy', ['build', 'rsync:dist']);
  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('server', ['connect:server:keepalive']);
};
