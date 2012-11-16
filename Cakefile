{spawn, exec} = require 'child_process'

run = (name, args) ->
  proc =           spawn name, args
  proc.stderr.on   'data', (buffer) -> console.log buffer.toString()
  proc.stdout.on   'data', (buffer) -> console.log buffer.toString()
  proc.on          'exit', (status) -> process.exit(1) if status != 0

task 'watch', 'Watch source files and build JS & CSS', (options) ->
  run 'coffee',  ['-wco', 'dist', 'src']
  run 'cake', ['minify']

task 'minify', 'Minify the resulting application file after build', ->
  filename = 'jquery.shortcode'
  exec "uglifyjs -o dist/#{filename}.min.js dist/#{filename}.js", (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr