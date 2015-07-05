var YAML = require('yamljs');

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
                
                langs : ["en_US", "fr_CA"],
                configureEnvironment : function(env){
                  var self = this;
                  env.addFilter('trans', function(str, obj) {
                    var lang = self.options().lang || 'en_US';
                    var locale = YAML.load('locales/'+lang+'.yml');

                    var string = locale[str],
                        myObj = obj || {};

                    for (var params in myObj) {
                      if (myObj.hasOwnProperty(params)) {
                        string = string.replace('%' + params + '%', myObj[params]);
                      }
                    }

                    return string;
                  });
                }
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
              warnLevel: "none"
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
          email : {
            options: {
              transport: {
                type: 'Sendmail'
              },
              recipients: [
                {
                  email: 'your.email@gmail.com',
                  name: 'Jane Doe'
                }
              ]
            },
            src: ['dist/output/en_US/transactional/alert.html']
          },
          emailonacid :{
             options: {
              transport: {
                type: 'Sendmail'
              },
              recipients: [
                {
                  email: 'username@emailonacid.com',
                  name: 'Email on Acid'
                }
              ]
            },
            src: ['dist/output/en_US/transactional/alert.html']           
          }
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
        },
        mochaTest: {
          api: {
            options: {
              reporter: 'spec'
            },
            src: ['tests/*.js']
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
                paths : "src/templates"
              },
              files: [
                   {
                      expand: true,
                      cwd: "src/templates",
                      src: ["**/*.html","!**/_*.html"],
                      dest: "dist/templates/"+lang+"/",
                      ext: ".html"
                   }
              ]
          };
        });

        grunt.config.set('nunjucks', nunjucks);
        grunt.task.run('nunjucks');
    });

    grunt.registerTask("build-templates-text", "Build emails text", function(test) {
        var nunjucks = grunt.config.get('nunjucks') || {};
        var langs = nunjucks.options.langs;
        langs.forEach(function(lang){
          nunjucks[lang] = {
              options:{
                lang:lang,
                paths : "src/templates"
              },
              files: [
                   {
                      expand: true,
                      cwd: "src/templates",
                      src: ["**/*.txt","!**/_*.txt"],
                      dest: "dist/output/"+lang+"/",
                      ext: ".txt"
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
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default',['watch']);
    grunt.registerTask('test',['mochaTest']);
    grunt.registerTask('css',['sass']);
    grunt.registerTask('html',['build-templates', 'build-templates-text','premailer:inline']);
    grunt.registerTask('build',['sass','build-templates', 'build-templates-text','premailer:inline']);
    grunt.registerTask('email',['nodemailer:email']);
    grunt.registerTask('eoa',['nodemailer:emailonacid']);

};
