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
            },
            themes: {
              files: [{
                expand: true,
                cwd: 'src/css/7_themes',
                src: ['**/*.scss','*.scss'],
                dest: 'dist/css/',
                ext: '.css'
              }]
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
                      src: "templates/**/index.html",
                      dest: "dist/",
                      ext: ".html"
                   }
                ]
            }
        },
        premailer: {
          inline :{
            options: {
              
            },
            files : [{
              expand: true,
              cwd: "dist/templates",
              src: ['*.html','**/*.html'],
              dest: 'dist/output'
            }]
          }
        },
        litmus: {
            test: {
              src: ['dist/output/*.html', 'dist/output/**/*.html'],
              options: {
                username: 'email@gmail.com',
                password: 'pass',
                url: 'https://cedricdugas.litmus.com',
                clients: [
                  //gmail
                  'gmailnew', 'ffgmailnew', 'chromegmailnew',
                  // outlook
                  'ol2002', 'ol2003', 'ol2007', 'ol2010', 'ol2011', 'ol2013',
                  // hotmail
                  'outlookcom', 'ffoutlookcom', 'chromeoutlookcom', 
                  //Yahoo
                  'chromeyahoo',
                  //applemail
                  'appmail6',
                  //mobile
                  'iphone6plus', 'iphone6', 'iphone5s', 'androidgmailapp', 'android4', 'ipad',
                  // spam check
                  'messagelabs'
                ]
              }
            }
        },
        nodemailer: {
            options: {
              transport: {
                type: 'SMTP',
                options: {
                  service: 'Gmail',
                  auth: {
                    user: 'email@gmail.com',
                    pass: 'test12'
                  }
                }
              },
              recipients: [
                {
                  email: 'email@gmail.com',
                  name: 'Jane Doe'
                }
              ]
            },
            src: ['dist/output/*.html']
        },
        connect: {
          server: {
            options: {
              port: 8555,
              keepalive : true,
              livereload: true,
              base : "dist",
              hostname: '*'
            }
          }
        },
        watch: {
            options: {
                livereload: true
            },
            css: {
                files: ['src/css/*.scss','src/css/**/*.scss'],
                tasks: ['sass']
            },
            html:{
                files: ['src/*.html','src/**/*.html'],
                tasks: ['nunjucks','emailBuilder:inline']
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-email-builder');
    grunt.loadNpmTasks('grunt-nunjucks-2-html');
    grunt.loadNpmTasks('grunt-email-builder');
    grunt.loadNpmTasks('grunt-litmus');
    grunt.loadNpmTasks('grunt-nodemailer');
    grunt.loadNpmTasks('grunt-premailer');

    grunt.registerTask('default',['watch']);
    grunt.registerTask('css',['sass']);
    grunt.registerTask('html',['nunjucks','emailBuilder:inline']);
    grunt.registerTask('build',['sass','nunjucks','emailBuilder:inline']);
    grunt.registerTask('sendlitmus',['litmus:test']);
    grunt.registerTask('email',['nodemailer']);

};
