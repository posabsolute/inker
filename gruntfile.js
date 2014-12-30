module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /*sass: {
            dist: {
                files: {
                    'css/main.css' : 'css/sass/main.scss'
                }
            }
        },*/
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/css/main.css': 'src/css/base.scss',
                    'dist/css/responsive.css': 'src/css/responsive.scss'
                }
            }
        },
        nunjucks: {
            /*
            precompile: {
                baseDir: 'src/',
                src: 'src/templates/*',
                dest: 'dist/nunjucks/templates.js'
            }
            */
            options:{
                paths : "src"
            },
            render: {
                files: [
                   {
                      expand: true,
                      cwd: "src/",
                      src: "templates/*.html",
                      dest: "dist/",
                      ext: ".html"
                   }
                ]
            }
        },
        emailBuilder: {
          inline :{
            options: {
              encodeSpecialChars: true
            },
            files : [{
              expand: true,
              cwd: "dist/templates",
              src: ['*.html'],
              dest: 'dist/output'
            }]
          }
        },
        watch: {
            options: {
                livereload: true
            },
            css: {
                files: ['**/*.scss'],
                tasks: ['compass']
            },
            responsive:{
                files: ['**/*.scss'],
                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-email-builder');
    grunt.loadNpmTasks('grunt-nunjucks-2-html');
    grunt.loadNpmTasks('grunt-email-builder');

    grunt.registerTask('default',['watch']);
    grunt.registerTask('buildcss',['sass']);
    grunt.registerTask('buildhtml',['nunjucks','emailBuilder']);

};
