module.exports = function(grunt) {


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        coffee: {
            compile: {
                options: {
                    sourceMap: true
                },
                files: {
                    'src/ifvisible.js': 'src/ifvisible.coffee'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.registerTask('default', function (spec) {

        grunt.task.run(['coffee:compile']);

    });

};
