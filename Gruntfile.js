module.exports = function(grunt) {
    // load dependencies
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    // project config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    'src/lib.js','lib/crafty.js','src/racquetball.js'
                ], 
                dest: 'build/racquetball-production.js'
            }
        },
        uglify: {
            options: { 
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/racquetball-production.js',
                dest: 'build/racquetball-production.min.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js'], 
                tasks: ['concat', 'uglify'],
                options: { spawn: false }
            }
        }
    });

    // default tasks
    grunt.registerTask('default', ['concat', 'uglify']);
};
