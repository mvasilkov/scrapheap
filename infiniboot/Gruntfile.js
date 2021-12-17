module.exports = grunt => {
    'use strict'
    grunt.loadNpmTasks('grunt-contrib-connect')
    grunt.loadNpmTasks('grunt-sass')
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.initConfig({
        connect: {
            usage: {
                options: {
                    port: 3000,
                    base: './usage',
                }
            },
        },

        sass: {
            options: {
                sourceMap: true,
            },
            stylesheets: {
                files: {
                    './build/infiniboot.css': './stylesheets/infiniboot.scss',
                    './build/usage.css': './stylesheets/usage.scss',
                }
            },
        },

        watch: {
            options: {
                interval: 3000,
                spawn: false,
            },
            stylesheets: {
                files: './stylesheets/*.scss',
                tasks: ['sass:stylesheets'],
            },
        },
    })

    grunt.registerTask('runserver', () => {
        grunt.task.run([
            'sass:stylesheets',
            'connect:usage',
            'watch:stylesheets',
        ])
    })

    grunt.registerTask('default', 'runserver')
}
