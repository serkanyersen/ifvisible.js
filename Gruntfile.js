module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            coffee: {
                files: ['src/*.coffee'],
                tasks: ['coffee:compile'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        },

        coffee: {
            compile: {
                options: {
                    sourceMap: true
                },
                files: {
                    'src/ifvisible.js': 'src/ifvisible.coffee'
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'src/ifvisible.min.js': ['src/ifvisible.js']
                }
            }
        },

        docco: {
          build: {
            src: ['src/ifvisible.coffee'],
            options: {
              output: 'docs/'
            }
          }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-docco');

    grunt.registerTask('default', function (spec) {
        grunt.task.run(['coffee:compile', 'uglify:build', 'docco:build']);
    });
};
