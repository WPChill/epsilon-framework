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
    sass: {
      dist: {
        options: {
          style: 'expanded',
          sourcemap: 'none',
        },
        files: [
          {
            expand: true,
            cwd: 'assets/css/',
            src: [ '*.scss' ],
            dest: 'assets/css/',
            ext: '.css'
          } ]
      }
    }
  } );

  grunt.config( 'watch', {
    scss: {
      tasks: [ 'sass:dist' ],
      files: [
        'assets/css/*.scss',
        'assets/css/**/*.scss',
        'assets/css/**/**/*.scss',
      ]
    }
  } );

  grunt.event.on( 'watch', function( action, filepath ) {
    // Determine task based on filepath
    var get_ext = function( path ) {
      var ret = '';
      var i = path.lastIndexOf( '.' );
      if ( - 1 !== i && i <= path.length ) {
        ret = path.substr( i + 1 );
      }
      return ret;
    };
    switch ( get_ext( filepath ) ) {
        // PHP
      case 'php' :
        //grunt.config('paths.php.files', [ filepath ]);
        break;
        // JavaScript
      case 'js' :
        grunt.config( 'paths.js.files', [ filepath ] );
        break;
    }
  } );

  grunt.registerTask( 'startSass', [
    'sass'
  ] );
};
