/*
 * Gruntfile.js
 * Thanks to @toddmotto for the base
 */

'use strict';

var lrPort = 35730,
    servingPort = 1337;

var lrInstance = require( 'connect-livereload' )({
    port: lrPort
});

var mountFolder = function ( connect, dir ) {
    return connect.static( require( 'path' ).resolve( dir ) );
};

module.exports = function ( grunt ) {


    pkg: grunt.file.readJSON('package.json'),
    require( 'matchdep' ).filterDev('grunt-*').forEach( grunt.loadNpmTasks );

    grunt.initConfig({
        /*
          LIVERELOAD SETUP
        */
        connect: {
            options: {port: servingPort,hostname: 'localhost'},
            livereload: {options: {middleware: function ( connect ) {return [lrInstance,mountFolder(connect, '.')];}}}
        },
        /*
          LAUNCH A SERVER AND OPEN THE BROWSER
        */
        open: {
            server: {path: 'http://localhost:<%= connect.options.port %>'}
        },
        /*
          COMPILE SCSS AND SASS FILES
            CHANGE cssDir and sassDir to your needs!
            optional: use the config.rb file 
              (by simply removing the options above and uncomment config: ...)
        */
        compass: {
          compile: {
            options: {
              cssDir: 'css/',
              sassDir: 'sass/',
              outputStyle: 'compressed'
              //config: 'config.rb'
            }
          }
        },
        /*
        auto prefixer
        */
        autoprefixer:{
            dist:{
                files:{
                    'css/main.css':'css/main.css'
                }
            }
        },



        /*
          UGLIFY and CONCAT YOUR JS FILES:
            YOU NEED TO CHANGE THE VALUES BELOW DEPENDING ON YOUR SETUP
            SYNTAX :
              'dest' : ['src']
        */
        uglify: {
            dist: {
                files: {
                    'js/built.min.js' : [ 'js/main.js']
                }
            }
        },

        jshint: {
            options: {
                asi: true, //to turn off annoying warning about missing semicolon at the end
                eqeqeq: false,
                browser: false,
                curly: false,
                newcap: false,
                undef: false,
                eqnull: false,
                node: false,
                globals: {
                    jQuery: true
                },
            },
            all: ['js/main.js']
        },

        watch: {
            js_watch: {
                options: {
                    livereload: lrPort
                },
                files: [
                    'js/{,*/}*.js',
                    '!js/built.min.js' /*watch for all file changes, except when your main js file changes => else infinite loop*/
                ],
                tasks: ['jshint','uglify']
            },
            css_watch: {
                options: {
                    livereload: lrPort
                },
                files: [
                    'sass/{,*/}*.{scss,sass}',
                ],
                tasks: ['compass','autoprefixer']
            },
            htmlWATCH: {
                options: {
                    livereload: lrPort
                },
                /*
                  add additional directories you want to watch for changes
                */
                files: [
                    '**/*.{html,md}' //watch every HTML and MD file
                ],
            },
            imagesWATCH: {
                options: {
                    livereload: lrPort
                },
                /*
                  add additional directories you want to watch for changes
                */
                files: [
                    '**/*.{jpg,png,jpeg,JPG}'
                ]
            }
        }
    });
    
    grunt.registerTask( 'default' , [
        'jshint',
        'uglify',
        'compass',
        'autoprefixer',
        'connect:livereload',
        'open',
        'watch'
    ]);
};