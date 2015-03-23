'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// '<%= config.src %>/templates/pages/{,*/}*.hbs'
// use this if you want to match all subfolders:
// '<%= config.src %>/templates/pages/**/*.hbs'

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  var dateVar = grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT");

  //jit-grunt loads only the npm tasks required for the grunt task.
  //makes livereload much faster.
  require('load-grunt-config')(grunt, {
    jitGrunt: {
      staticMappings: {
        replace: 'grunt-text-replace',
        handlebars: 'grunt-contrib-handlebars',
        resemble: 'grunt-resemble-cli',
        sass: 'grunt-sass',
        connect: 'grunt-contrib-connect',
        jasmine_node: 'grunt-jasmine-node',
        open: 'grunt-open'
      }
    },
    data: {
      dateVar: dateVar,
      marketingDistName: 'website-stable'
    },
    init: true
  });

  grunt.registerTask('om-test', [
    'open'
  ]);

  grunt.registerTask('staging-deploy', [
    'gitinfo',
    'config:staging',
    'jshint:clientDev',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    's3:staging',
    'clean:postBuild'
  ]);

  grunt.registerTask('smartling-staging-deploy', [
    'gitinfo',
    'config:smartlingStaging',
    'jshint:clientDev',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    's3:smartling',
    'clean:postBuild'
  ]);

  grunt.registerTask('server', [
    'config:dev',
    'jshint:clientDev',
    'jshint:server',
    'jshint:test',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:dev',
    'replace',
    'autoprefixer',
    'copy',
    'clean:postBuild',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'config:production',
    'jshint:clientProd',
    'jshint:server',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:prod',
    'autoprefixer',
    'copy',
    'uglify',
    'filerev',
    'userevvd',
    'clean:postBuild'
  ]);

  grunt.registerTask('ui-test', function(which) {
    var jasminTest = 'jasmine_node',
        tasks = [
          'config:dev',
          'jshint:test'
        ];

    if(which){
      if(which !== 'om'){
        jasminTest += ':' + which;
        tasks.push(jasminTest);
      } else if(which === 'om'){
        tasks.push('om-test');
      }
    } else {
      tasks.push('om-test');
      tasks.push(jasminTest);
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('test', [
    'config:dev',
    'jshint:clientProd',
    'jshint:server',
    'jshint:test',
    'clean:preBuild',
    'assemble',
    'handlebars',
    'modernizr',
    'concat',
    'sass:dev',
    'replace',
    'autoprefixer',
    'copy',
    'clean:postBuild',
    'om-test',
    'connect:resemble',
    'jasmine_node',
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
  grunt.loadNpmTasks('grunt-github-releaser');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('forceoff', 'Forces the force flag off', function() {
    grunt.option('force', false);
  });

  grunt.registerTask('forceon', 'Forces the force flag on', function() {
    grunt.option('force', true);
  });

  grunt.registerTask('release', 'makes a release to github', function() {
    // Use the forceon option for all tasks that need to continue executing in case of error
    var prepare = ['prompt', 'build']
    var compress = ['compress'];
    var git_release_tasks = ['gitfetch', 'forceon', 'gittag', 'gitpush', 'forceoff', 'github-release'];

    grunt.task.run(prepare);
    grunt.task.run(compress);
    grunt.task.run(git_release_tasks);
  });

};
