/*global module:false*/
module.exports = function(grunt) {

  var component = require('./component.json');
  // before release:
  // update component.js, package.json
  // after release:
  // add tag to repo: git tag -a v1.0.0
  // push tag: git push origin 1.0.0

  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-contrib');

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: component.version,
      banner: '// ' + component.name + ', v<%= meta.version %>\n' +
        '// Copyright (c)<%= grunt.template.today("yyyy") %> Adriano Raiano (adrai).\n' + 
        '// Distributed under MIT license\n' + 
        '// http://adrai.github.io/js-flowchart/\n'
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
        banner: '<%= meta.banner %>'
      },
      // bin: {
      //   src: ['bin/flowchart-latest.js'],
      //   dest: 'bin/flowchart-<%= meta.version %>.min.js'
      // },
      release: {
        src: ['bin/flowchart-latest.js'],
        dest: 'release/flowchart-<%= meta.version %>.min.js'
      },
      amd: {
        src: ['bin/flowchart.amd-latest.js'],
        dest: 'release/flowchart.amd-<%= meta.version %>.min.js'
      }
    },

    copy: {
      js: {
        files: [
          { expand: true, cwd: 'bin/', src: ['*.js'], dest: 'release/', 
            rename: function(dest, src) { console.log(src + ' -> ' + dest);
              if (src == 'flowchart-latest.js') {
                dest += 'flowchart-' + component.version + '.js';
              }
              if (src == 'flowchart.amd-latest.js') {
                dest += 'flowchart.amd-' + component.version + '.js';
              }
              return dest;
            }
          }
          //'bin/': ['bin/flowchart-latest.js', 'bin/flowchart.amd-latest.js'],
          //'release/': ['bin/flowchart-latest.js', 'bin/flowchart.amd-latest.js']
        ]
      }
    },

    compress: {
      zip: {
        options: {
          archive: 'release/flowchart-<%= meta.version %>.zip',
          mode: 'zip',
          level: 1
        },
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'release/',
            src: [
              'flowchart-<%= meta.version %>.js', 
              'flowchart-<%= meta.version %>.min.js'
            ],
            dest: 'flowchart-<%= meta.version %>/'
          }
        ]
      },
      zipamd: {
        options: {
          archive: 'release/flowchart.amd-<%= meta.version %>.zip',
          mode: 'zip',
          level: 1
        },
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'release/',
            src: [
              'flowchart.amd-<%= meta.version %>.js', 
              'flowchart.amd-<%= meta.version %>.min.js'
            ],
            dest: 'flowchart.amd-<%= meta.version %>/'
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