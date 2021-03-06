module.exports = {
  options: {
    trailing: true,
    curly: true,
    eqeqeq: true,
    indent: 4,
    latedef: true,
    noempty: true,
    nonbsp: true,
    undef: true,
    quotmark: 'single',
    node: true
  },
  test: {
    options: {
      browser: true,
      unused: true,
      node: true,
      globals: {
        mocha: false,
        it: false,
        console: false,
        describe: false,
        beforeEach: false,
        waits: false,
        waitsFor: false,
        runs: false
      }
    },
    files: {
      src: [
        'test/**/*.js',
        'configs/uiTestConfig.js'
      ]
    }
  },
  clientProd: {
    options: {
      browser: true,
      unused: true,
      globals: {
        jQuery: false,
        moment: false,
        $: false,
        Oform: false,
        w: false,
        d: false,
        Modernizr: true
      }
    },
    files: {
      src: [
        '<%= config.guts %>/assets/js/**/*.js',
        '!<%= config.guts %>/assets/js{,/om}/libraries/**/*.js',
        '!<%= config.guts %>/assets/js{,/om}/utils/*.js'
      ]
    }
  },
  clientDev: {
    options: {
      browser: true,
      debug: true,
      globals: {
        jQuery: false,
        console: false,
        moment: false,
        _gaq: false,
        $: false,
        Oform: false,
        w: false,
        d: false,
        Modernizr: true
      }
    },
    files: {
      src: [
        '<%= config.guts %>/assets/js/**/*.js',
        '!<%= config.guts %>/assets/js{,/om}/libraries/**/*.js',
        '!<%= config.guts %>/assets/js{,/om}/utils/*.js'
      ]
    }
  },
  server: {
    options: {
      node: true,
      debug: true
    },
    files: {
      src: [
        '<%= config.guts %>/helpers/*.js',
        'grunt/**/*.js',
        'Gruntfile.js'
      ]
    }
  }
};
