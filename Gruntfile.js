/*global module:false*/
module.exports = function(grunt) {

  var component = require('./package.json');
  // before release:
  // update component.js, package.json
  // after release:
  // add tag to repo: git tag v1.0.0
  // push tag: git push --tags
  // to initialize all again
  // http://twoguysarguing.wordpress.com/2010/11/14/tie-git-submodules-to-a-particular-commit-or-branch/
  // nav to site and do: git checkout gh-pages

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: component.version,
      banner: '// ' + component.name + ', v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Adriano Raiano (adrai).\n' +
        '// Distributed under MIT license\n' +
        '// http://adrai.github.io/flowchart.js\n'
    },

    clean: ['bin'],

    jshint: {
      options: {
        scripturl: true,
        laxcomma: true,
        loopfunc: true,
        curly: false,
        eqeqeq: false,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          $: true,
          console: true,
          ActiveXObject: true,
          module: true
        }
      },
      files: [ 'bin/*.js' ]
    },

    rig: {
      options: {
        banner: '<%= meta.banner %>'
      },
      build: {
        src: ['src/flowchart.js'],
        dest: 'bin/flowchart-latest.js'
      },
      amd: {
        src: ['src/amd.js'],
        dest: 'bin/flowchart.amd-latest.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>',
      },
      // bin: {
      //   src: ['bin/flowchart-latest.js'],
      //   dest: 'bin/flowchart-<%= meta.version %>.min.js'
      // },
      // release: {
      //   src: ['bin/flowchart-latest.js'],
      //   dest: 'release/flowchart-<%= meta.version %>.min.js',
      //   options: {
      //     sourceMap: true,
      //     sourceMapName: 'release/flowchart-<%= meta.version %>.min.map'
      //   }
      // },
      // amd: {
      //   src: ['bin/flowchart.amd-latest.js'],
      //   dest: 'release/flowchart.amd-<%= meta.version %>.min.js',
      //   options: {
      //     sourceMap: true,
      //     sourceMapName: 'release/flowchart.amd-<%= meta.version %>.min.map'
      //   }
      // }
      release: {
        src: ['bin/flowchart-latest.js'],
        dest: 'release/flowchart.min.js',
        options: {
          sourceMap: true,
          sourceMapName: 'release/flowchart.min.map'
        }
      },
      amd: {
        src: ['bin/flowchart.amd-latest.js'],
        dest: 'release/flowchart.amd.min.js',
        options: {
          sourceMap: true,
          sourceMapName: 'release/flowchart.amd.min.map'
        }
      }
    },

    copy: {
      js: {
        // files: [
        //   { expand: true, cwd: 'bin/', src: ['*.js'], dest: 'release/',
        //     rename: function(dest, src) { console.log(src + ' -> ' + dest);
        //       if (src == 'flowchart-latest.js') {
        //         dest += 'flowchart-' + component.version + '.js';
        //       }
        //       if (src == 'flowchart.amd-latest.js') {
        //         dest += 'flowchart.amd-' + component.version + '.js';
        //       }
        //       return dest;
        //     }
        //   },
        //   { expand: true, cwd: 'bin/', src: ['flowchart-latest.js'], dest: 'site/'}
        //   //'bin/': ['bin/flowchart-latest.js', 'bin/flowchart.amd-latest.js'],
        //   //'release/': ['bin/flowchart-latest.js', 'bin/flowchart.amd-latest.js']
        // ]
        files: [
          { expand: true, cwd: 'bin/', src: ['*.js'], dest: 'release/',
            rename: function(dest, src) { console.log(src + ' -> ' + dest);
              if (src == 'flowchart-latest.js') {
                dest += 'flowchart.js';
              }
              if (src == 'flowchart.amd-latest.js') {
                dest += 'flowchart.amd.js';
              }
              return dest;
            }
          },
          { expand: true, cwd: 'bin/', src: ['flowchart-latest.js'], dest: 'site/'}
          //'bin/': ['bin/flowchart-latest.js', 'bin/flowchart.amd-latest.js'],
          //'release/': ['bin/flowchart-latest.js', 'bin/flowchart.amd-latest.js']
        ]
      }
    },

    compress: {
      // zip: {
      //   options: {
      //     archive: 'release/flowchart-<%= meta.version %>.zip',
      //     mode: 'zip',
      //     level: 1
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       flatten: true,
      //       cwd: 'release/',
      //       src: [
      //         'flowchart-<%= meta.version %>.js',
      //         'flowchart-<%= meta.version %>.min.js',
      //         'flowchart-<%= meta.version %>.min.map'
      //       ],
      //       dest: 'flowchart-<%= meta.version %>/'
      //     }
      //   ]
      // },
      'zip-latest': {
        options: {
          archive: 'release/flowchart.zip',
          mode: 'zip',
          level: 1
        },
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'release/',
            src: [
              'flowchart.js',
              'flowchart.min.js',
              'flowchart.min.map'
            ],
            dest: 'flowchart/'
          }
        ]
      },
      // zipamd: {
      //   options: {
      //     archive: 'release/flowchart.amd-<%= meta.version %>.zip',
      //     mode: 'zip',
      //     level: 1
      //   },
      //   files: [
      //     {
      //       expand: true,
      //       flatten: true,
      //       cwd: 'release/',
      //       src: [
      //         'flowchart.amd-<%= meta.version %>.js',
      //         'flowchart.amd-<%= meta.version %>.min.js',
      //         'flowchart.amd-<%= meta.version %>.min.map'
      //       ],
      //       dest: 'flowchart.amd-<%= meta.version %>/'
      //     }
      //   ]
      // },
      'zipamd-latest': {
        options: {
          archive: 'release/flowchart.amd.zip',
          mode: 'zip',
          level: 1
        },
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'release/',
            src: [
              'flowchart.amd.js',
              'flowchart.amd.min.js',
              'flowchart.amd.min.map'
            ],
            dest: 'flowchart/'
          }
        ]
      }
    },

    watch: {
      lib: {
        files: 'src/*.js',
        tasks: 'rig:build'
      }
    }

  });

  // Default task.
  grunt.registerTask('default', ['clean', 'rig']);
  grunt.registerTask('release', ['default', 'uglify', 'copy', 'compress']);


};
