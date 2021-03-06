/* global module, require */
(function() {
  'use strict';

  var path = require('path');
  var projectConfig = require('./lib/build/configurator')(require('./config'));
  var copyAssets = require('./lib/build/copy-assets');

  module.exports = function(grunt) {
    var demoPort = grunt.option('port') || 8000;

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      stylus: {
        compile: {
          options: {
            compress: true
          },
          files: {
            'lib/compiled/css/style.css': ['lib/src/styl/**/*.styl']
          }
        }
      },
      ngtemplates: {
        tenthousandthings: {
          cwd: 'lib/partials',
          src: '**/*.html',
          dest: '.tmp/ngtemplates.js'
        }
      },
      uglify: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources: true
        },
        scripts: {
          options: {
            sourceMapName: 'lib/compiled/js/scripts.map'
          },
          files: {
            'lib/compiled/js/scripts.js': [
              'lib/src/js/init.js',
              'lib/src/js/**/*[!bootstrap]*.js',
              '<%= ngtemplates.tenthousandthings.dest %>',
              'lib/src/js/bootstrap.js'
            ]
          }
        },
        vendor: {
          options: {
            sourceMapName: 'lib/compiled/js/vendor.map'
          },
          files: {
            'lib/compiled/js/vendor.js': [
              'bower_components/jquery/dist/jquery.js',
              'bower_components/angular/angular.js',
              'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js'
            ]
          }
        }
      },
      watch: {
        options: {
          atBegin: true,
          livereload: true
        },
        configuration: {
          options: {
            reload: true
          },
          files: [
            'Gruntfile.js',
            'config.json'
          ],
          tasks: []
        },
        stylus: {
          files: ['lib/src/styl/**/*.styl'],
          tasks: ['stylus', 'copyAssets']
        },
        templates: {
          files: ['lib/partials/**/*.html'],
          tasks: ['ngtemplates', 'uglify:scripts', 'copyAssets']
        },
        javascript: {
          files: ['lib/src/js/**/*.js'],
          tasks: ['uglify:scripts', 'copyAssets']
        },
        javascriptVendor: {
          files: ['bower_components/**/*.js'],
          tasks: ['uglify:vendor', 'copyAssets']
        },
        exmple: {
          files: [path.join(projectConfig.src, '/**/*')],
          tasks: ['metalsmith']
        },
        builder: {
          files: ['lib/build/*', 'example/*', 'config.json'],
          tasks: ['metalsmith']
        }
      },
      'http-server': {
        dev: {
          root: projectConfig.dest,
          port: demoPort
        },
        devBackground: {
          root: projectConfig.dest,
          port: demoPort,
          runInBackground: true
        }
      },
      bump: {
        options: {
          files: ['package.json', 'bower.json'],
          updateConfigs: ['pkg']
        }
      },
      shell: {
        dirtycheck: {
          command: [
            'if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]]; then',
            ' echo "Index is dirty, commit or stash files before releasing.";',
            ' exit 1;',
            'fi'
          ].join(' ')
        },
        bump: {
          command: [
            'git update-index --no-assume-unchanged $(find lib/compiled -type f)',
            'git add lib/compiled -f',
            'git add package.json',
            'git add bower.json',
            'git commit -m"release v<%= pkg.version %>"',
            'git tag v<%= pkg.version %> -m"version v<%= pkg.version %>"',
            'git push origin master --tags',
            'git update-index --assume-unchanged $(find lib/compiled -type f)'
          ].join(' && ')
        }
      }
    });

    /* Load grunt tasks from NPM packages */
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('demo', function() {
      grunt.task.run(['build', 'http-server:dev']);
    });
    grunt.registerTask('metalsmith', function() {
      require('./lib/index')(projectConfig).build(this.async());
    });
    grunt.registerTask('copyAssets', function() {
      copyAssets(projectConfig, this.async());
    });
    grunt.registerTask('build', ['stylus', 'ngtemplates', 'uglify', 'metalsmith']);
    grunt.registerTask('release', function(type) {
      grunt.task.run([
        'shell:dirtycheck',
        'bump:' + (type || 'patch') + ':bump-only',
        'build',
        'shell:bump',
      ]);
    });
    grunt.registerTask('default', function() {
      process.env.BASE_JS_INCLUDE_AUTOLOAD = true;
      grunt.task.run(['http-server:devBackground', 'watch']);
    });
  };

})();
