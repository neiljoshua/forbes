module.exports = function(grunt) {

grunt.initConfig({

 compass: {
		dist: {
			options: {
				sassDir: 'src/sass/',
				specify: 'src/sass/styles.scss',
				cssDir: 'src/css/'
			}
		}
	},

	jshint: {
		all: ['src/js/scripts.js']
	},

	uglify: {
		my_target: {
			files: {
				'dist/js/scripts.min.js': ['src/js/scripts.js'],
			}
		}
	},

	cssmin : {
		target : {
			src : ['src/css/styles.css'],
			dest : 'dist/css/styles.min.css'
		}
	},

	copy: {
	  main: {
	    expand: true,
	    cwd: 'src/',
	    src: 'images/**',
	    dest: 'dist/'
	  },
	},

	watch: {
		css: {
			files: ['src/sass/*.scss', "src/css/*.css"],
			tasks: ['compass','cssmin']
		},
		js: {
			files: ['src/js/*.js'],
			tasks: ['uglify']
		}
	}

});

grunt.loadNpmTasks('grunt-contrib-compass');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-watch');

grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'copy', 'watch']);
grunt.registerTask('dev', ['compass']);
}
