#Example:
#ruby include.rb -p "../public/demos/tiny_mce/" -f "files_list.txt" -d "../public/demos/tiny_mce/production.js"
require 'getoptlong'
require 'fileutils'
require 'json'
require 'net/http'
require 'uri'
### Program Options
progopts = GetoptLong.new(
  [ "--page","-p", GetoptLong::OPTIONAL_ARGUMENT ],
  [ "--files","-f", GetoptLong::OPTIONAL_ARGUMENT ],
  [ "--destination","-d", GetoptLong::OPTIONAL_ARGUMENT ],
  [ "--compressor","-c", GetoptLong::OPTIONAL_ARGUMENT ]
)

page = 'public'
files = 'script/files_list.txt'
destination = 'public/javascripts/production.js'
compressor = 'java -jar yuicompressor-2.2.4.jar'
progopts.each do |option, arg|
  case option
    when '--page'
      page = arg
    when '--files'
      files = arg
    when '--destination'
      destination = arg
    when '--compressor'
      compressor = arg
    else
      puts "Unrecognized option #{opt}"
      exit 0
  end
end
  
p 'page path = '+page
p 'files list = '+files
p 'destination = '+destination

file = File.open(files)
files_list = file.read
file.close

files_array = []
files_list.scan(/\'(.*)\'/) {|file|
  files_array.push(file[0])
}

def append_file_text_to_file(file, path_to_file_to_append)
  file_to_append = File.open(path_to_file_to_append)
    file << file_to_append.read
    file << "\n"
  file_to_append.close
end

File.open(destination, 'w') do |f|
  for file in files_array
    p 'adding '+file
    if(file[0..3]=='http')
      path=file.match(/https?\:\/\/[^\/]*\/(.*)/)[1]
      js_file = File.open(File.join('public',path))
      content = js_file.read
      js_file.close
      #content=Net::HTTP.get URI.parse(file)
    else
      js_file = File.open(File.join(page,file))
      content = js_file.read
      js_file.close
    end
    f << 'include.set_path("'+File.dirname(file)+'");'
    f << "\n"
    f << content
    f << "\n"
  end
end

p 'compressing'
system(compressor+' '+destination+' -o '+destination)
p 'saving to '+destination
p 'all done'