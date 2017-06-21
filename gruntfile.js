'use strict';
module.exports = function( grunt ) {
  // load all tasks
  require( 'load-grunt-tasks' )( grunt, { scope: 'devDependencies' } );

  grunt.util.linefeed = '\n';

  grunt.initConfig( {
    pkg: grunt.file.readJSON( 'package.json' ),
    dirs: {
      css: 'assets/css',
      js: 'assets/js'
    },
    concat: {
      dist: {
        src: [
          'assets/vendors/epsilon-framework/components/epsilon-object.js',
          'assets/vendors/epsilon-framework/**/*.js',
          'assets/vendors/epsilon-framework/epsilon.js',
          '!assets/vendors/epsilon-framework/epsilon.min.js',
          '!assets/vendors/epsilon-framework/epsilon-concat.js'
        ],
        dest: 'assets/js/epsilon.js'
      }
    },
    uglify: {
      epsilon: {
        options: {
          sourceMap: false,
          sourceMapName: 'sourceMap.map'
        },
        src: [ 'assets/js/epsilon.js', '!assets/js/epsilon.min.js' ],
        dest: 'assets/js/epsilon.min.js'
      }
    },
  } );

  grunt.config('watch', {
    js: {
      files  : 'assets/vendors/epsilon-framework/**/*.js',
      tasks  : [ 'concat-epsilon' ],
      options: {
        spawn: false
      }
    }
  });

  grunt.event.on('watch', function (action, filepath) {
    // Determine task based on filepath
    var get_ext = function (path) {
      var ret = '';
      var i = path.lastIndexOf('.');
      if ( -1 !== i && i <= path.length ) {
        ret = path.substr(i + 1);
      }
      return ret;
    };
    switch ( get_ext(filepath) ) {
        // PHP
      case 'php' :
        grunt.config('paths.php.files', [ filepath ]);
        break;
        // JavaScript
      case 'js' :
        grunt.config('paths.js.files', [ filepath ]);
        break;
    }
  });

  // Concatenate Epsilon
  grunt.registerTask( 'concat-epsilon', [
    'concat:dist',
    'uglify:epsilon'
  ] );
};