
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch:{
      scripts:{
        files:['app/src/**/*.js'],
        tasks:['browserify','uglify']
      },
    },
    browserify:{
      dist:{
        files:{
          'app/static/brows_bundle.js':['app/src/**/*.js']
        }
      }
    },
    uglify:{
      target:{
        files:{
          'app/static/jsbuild.js':'app/static/brows_bundle.js'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
};
