module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
            options:{
                paths : "src",
                langs : ["en_US"]
                // Use custom tag syntax to not interfer with your own templating engine
                /*
                tags : {
                  blockStart: '<%',
                  blockEnd: '%>',
                  variableStart: '<$',
                  variableEnd: '$>',
                  commentStart: '<#',
                  commentEnd: '#>'
                }
                */
                // Data to be used in template
                // data: grunt.file.readJSON('data.json'),
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
                username: 'test@gmail.com',
                password: 'test',
                url: 'https://test.litmus.com',
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
            src: ['dist/output/*.html','dist/output/**/*.html']
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
                tasks: ['nunjucks','premailer:inline']
            }
        }
    });

    grunt.registerTask("build-templates", "Build emails html", function(test) {
        var nunjucks = grunt.config.get('nunjucks') || {};
        var langs = nunjucks.options.langs;
        langs.forEach(function(lang){
          nunjucks[lang] = {
              options:{
                lang:lang,
                paths : "src"
              },
              files: [
                   {
                      expand: true,
                      cwd: "src/",
                      src: ["templates/**/index.html"],
                      dest: "dist/"+lang+"/",
                      ext: ".html"
                   }
              ]
          };
        });

        grunt.config.set('nunjucks', nunjucks);
        grunt.task.run('nunjucks');
    });



    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-nunjucks-2-html');
    grunt.loadNpmTasks('grunt-litmus');
    grunt.loadNpmTasks('grunt-nodemailer');
    grunt.loadNpmTasks('grunt-premailer');

    grunt.registerTask('default',['watch']);
    grunt.registerTask('css',['sass']);
    grunt.registerTask('html',['nunjucks','premailer:inline']);
    grunt.registerTask('build',['sass','nunjucks','premailer:inline']);
    grunt.registerTask('email',['nodemailer']);

};
