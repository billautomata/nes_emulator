module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-express-server')
  grunt.loadNpmTasks('grunt-standard')

  // grunt.registerTask('serve', [ 'browserify', 'express:dev', 'watch'])
  grunt.registerTask('default', ['browserify:main', 'standard:webapp', 'express', 'watch'])

  grunt.initConfig({
   express: {
      options: { },
      dev: {
        options: {
          port: 8000,
          script: './express_server.js'
        }
      }
    },
    standard: {
      options: {
        format: true,
        force: true
      },
      webapp: {
        src: [
          './source/*.js', './webapp/**/*.js', './webapp/**/**/*.js'
        ]
      }
    },
    // browserify: {
    //   main: {
    //     src: 'webapp/index.js',
    //     dest: 'docs/js/build/viz.js',
    //     files: {
    //       'docs/js/build/viz.js': ['./webapp/*.js', './webapp/**/*.js', './webapp/**/**/*.js' ],
    //     },
    //     options: {
    //       transform: ['brfs'],
    //       browserifyOptions: {
    //         debug: true
    //       }
    //     }
    //   }
    // },
    watch: {
      client_js: {
        files: ['./source/*.js', './webapp/*.js', './index.html' ],
        tasks: ['standard:webapp'],
        options: {
          livereload: {
            port: 35729
          }
        },
      }
    }
  })
}
