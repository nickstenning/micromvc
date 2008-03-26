The Ruby include.rb script is intended to be used with the JavaScript MVC Include library.

Script options:
"--page","-p"
  - Description: the path to the HTML page where your application runs from
  - Default: public
"--files","-f"
  - Description: the path to the list of files to be compressed, copied and pasted from the IncludeJS compression window
  - Default: script/files_list.txt
"--destination","-d"
  - Description: the path to where the output should be saved.  Saves to 'production.js' by default.
  - Default: public/javascripts/production.js
"--compressor","-c"
  - Description: the compressor command line command.  Uses the YUI compressor by default
  - Default: "java -jar yuicompressor-2.2.4.jar"

Example Usage:
ruby script\include.rb --page "public/demos/tiny_mce/"

Usage Steps:
1. Place the script and all contents of this folder in the script/ directory.
2. Load scripts in your application with include.
3. Turn on compression with include.setup('compress')
4. When the compression window opens, copy the list of compressed files.
5. Paste the list of files in a script/files_list.txt on the server.
6. Invoke the ruby compressor script.