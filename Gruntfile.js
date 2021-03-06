module.exports = function(grunt) {
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		site: grunt.file.readYAML('_config.yaml'),
		
		assemble: {
	      site: {
	        src: ['<%= site.pages %>'],
	        dest: '<%= site.dest %>',
	        options: {
		        flatten: true,
		        assets: '<%= site.assets %>',
		        data: '<%= site.data %>/*.{json,yml}',

		        // Templates
		        partials: '<%= site.includes %>',
		        layoutdir: '<%= site.layouts %>',
		        layout: '<%= site.layout %>',
		        collections: [{
		        	name: 'project',
		        	sortby: 'order',
		        	sortorder: 'ascending',
		        }]
	        },
	      },

		},

		clean: {
			server: ['<%= site.assets %>', '!<%= site.assets %>' ]
		},

		concurrent: {
			server: ['less', 'assemble:site'],
		},

		connect: {
	      options: {
	        port: 9000,
	        livereload: 35729,
	        // change this to '0.0.0.0' to access the server from outside
	        hostname: 'localhost'
	      },
	      livereload: {
	        options: {
	          open: true,
	          base: [
	            '<%= site.dest %>'
	          ]
	        }
	      }
	    },

		less: {
			server: {
				options: {
					paths: ["assets/css"]
				},
					files: {
					"assets/css/main.css": "src/less/main.less"
				},
			},
		},

		watch: {
			options: {
				livereload: true,
			},
			
			assemble: {
				files: ['<%= site.pages %>', '<%= site.data %>/*.json', '<%= site.includes %>', '<%= site.layouts %>'],
				tasks: ['assemble']
			},

			less: {
				files: ['src/less/**/*.less'],
				tasks: ['less'],
				options: {
					livereload: false,
				}
			},

			livereload: {
		        options: {
		          livereload: '<%= connect.options.livereload %>'
		        },
		        files: [
		          '<%= site.dest %>/*.html',
		          '<%= site.assets %>/css/*.css',
		          '<%= site.assets %>/img/*.{gif,jpg,jpeg,png,svg,webp}'
		        ]
		    }
		}
	
	});
	
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['clean', 'concurrent:server', 'connect', 'watch']);
	grunt.registerTask('dist', ['clean', 'assemble', 'replace:dist']);
}

