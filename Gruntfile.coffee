module.exports = (grunt) ->
  require("load-grunt-tasks")(grunt)

  pkg = grunt.file.readJSON "package.json"

  dir =
    src:    "src"
    dist:   "dist"
    coffee: "coffee"
    sass:   "sass"
    js:     "js"
    css:    "css"
    img:    "img"
    sound:  "sound"
    lib:    "lib"

  # ===== Config ===== #
  grunt.initConfig
    # Directory
    dir: dir

    # Package
    pkg: pkg

    # Coffee Script
    coffee:
      options:
        bare: true
      compile:
        files: [
          expand: true
          cwd: "<%= dir.src %>/<%= dir.coffee %>/"
          src: ["**/*.coffee"]
          dest: "<%= dir.dist %>/<%= dir.js %>/"
          ext: ".js"
        ]

    # Compass
    compass:
      dist:
        options:
          config: "config.rb"

    # JS Hint
    jshint:
      files: ["<%= dir.dist %>/<%= dir.js %>/**/*.js"]

    # Copy Static Files
    copy:
      html:
        files: [
          expand: true
          cwd: "<%= dir.src %>/"
          src: ["**/*.html"]
          dest: "<%= dir.dist %>/"
        ]
      img:
        files: [
          expand: true
          cwd: "<%= dir.src %>/<%= dir.img %>/"
          src: ["**"]
          dest: "<%= dir.dist %>/<%= dir.img %>/"
        ]
      sound:
        files: [
          expand: true
          cwd: "<%= dir.src %>/<%= dir.sound %>/"
          src: ["**"]
          dest: "<%= dir.dist %>/<%= dir.sound %>/"
        ]
      lib:
        files: [
          expand: true
          cwd: "<%= dir.src %>/<%= dir.lib %>/"
          src: ["**"]
          dest: "<%= dir.dist %>/<%= dir.lib %>/"
        ]

    # Livereload
    connect:
      livereload:
        options:
          port: 8000
          hostname: "localhost"
          base: "<%= dir.dist %>/"

    # Watch files
    watch:
      options:
        livereload: true
      html:
        files: "<%= dir.src %>/**/*.html"
        tasks: ["copy:html"]
      img:
        files: "<%= dir.src %>/<%= dir.img %>/**/*"
        tasks: ["copy:img"]
      sound:
        files: "<%= dir.src %>/<%= dir.sound %>/**/*"
        tasks: ["copy:sound"]
      lib:
        files: "<%= dir.src %>/<%= dir.lib %>/**/*"
        tasks: ["copy:lib"]
      css:
        files: "<%= dir.src %>/<%= dir.cass %>/**/*.scss"
        tasks: ["compass"]
      js:
        files: "<%= dir.src %>/<%= dir.coffee %>/**/*.coffee"
        tasks: ["coffee", "jshint"]

  # Plugin
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-compass"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-jshint"

  # Tasks
  grunt.registerTask "default", ["connect", "watch"]
  grunt.registerTask "build", ["coffee", "compass", "copy", "jshint"]
