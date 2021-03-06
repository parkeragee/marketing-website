var exclude = [
  '!node_modules/**/*',
  '!bower_components/**/*'
];

module.exports = {
  //assemble: {
    //files: [
      //'<%= config.content %>/**/*.{hbs,yml}',
      //'<%= config.guts %>/templates/**/*.hbs',
      //'!<%= config.guts %>/templates/client/**/*.hbs',
      //'<%= config.guts %>/assets/js/services/user_state.js',
      //'<%= config.guts %>/helpers-v6/**/*.js'
    //].concat(exclude),
    //tasks: ['config:dev', 'assemble']
  //},
  sassom: {
    files: '<%= config.guts %>/assets/css/om/**/*.{css,scss}',
    tasks: ['config:dev', 'sass:dev', 'replace', 'autoprefixer', 'clean:postBuild']
  },
  jsom: {
    files: ['<%= config.guts %>/assets/js/om/**/*.js'],
    tasks: ['config:dev', 'jshint:clientDev', 'jshint:server', 'modernizr', 'concat:namespaceOMPages', 'concat:omBundle', 'concat:jqueryModernizrOM', 'copy:omUITest', 'clean:postBuild']
  },
  sass: {
    files: ['<%= config.guts %>/assets/css/**/*.scss', '!<%= config.guts %>/assets/css/om/**/*.{css,scss}'],
    tasks: ['config:dev', 'sass:dev', 'replace', 'autoprefixer', 'clean:postBuild']
  },
  img: {
    files: ['<%= config.guts %>/assets/img/*.{png,jpg,svg}'],
    tasks: ['copy:img']
  },
  js: {
    files: ['<%= config.guts %>/assets/js/**/*.js', '!<%= config.guts %>/assets/js/services/user_state.js', '!<%= config.guts %>/assets/js/om/**/*.js', '<%= config.temp %>/assets/js/**/*.js'],
    tasks: ['config:dev', 'jshint:clientDev', 'jshint:server', 'handlebars', 'modernizr', 'concat', 'clean:postBuild']
  },
  test: {
    files: ['test/**/*.js'],
    tasks: ['jshint:test']
  },
  clientHandlebarsTemplates: {
    files: ['<%= config.guts %>/templates/client/**/*.hbs'],
    tasks: ['config:dev', 'jshint', 'handlebars', 'concat', 'clean:postBuild']
  },
  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '<%= config.dist %>/**/*.html',
      '!<%= config.dist %>/partners/**/*.html',
      '<%= config.dist %>/assets/**/*.{css,js}'
    ]
  }
};
