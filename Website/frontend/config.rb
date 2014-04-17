# Require any additional compass plugins here.

require "compass-h5bp"

# Set this to the root of your project when deployed:
css_dir = "assets/css"
sass_dir = "assets/css/_sass"
images_dir = "assets/i"

###
# Helpers
###

module Sass::Script::Functions
  
  # Custom str_index function for use in Sass
  # def str_index(string, substring)
  #   assert_type string, :String
  #   assert_type substring, :String
  #   index = string.value.index(substring.value) || -1
  #   Sass::Script::Number.new(index + 1)
  # end
  # declare :str_index, [:string, :substring]
  
  # Custom list_files function for use in Sass
  def list_files(path)
    return Sass::Script::List.new(
      Dir.glob(path.value).map! { |x| Sass::Script::String.new(x) },
      :comma
    )
  end

  def image_exists(image_file)

    file_path = image_file.value
    
    if file_path.start_with?("/")
      file_path = file_path.sub("/", "")
    end

    if File.exists?(file_path)
      path = file_path
    elsif Compass.configuration.images_path
      path = File.join(Compass.configuration.images_path, file_path)
    else
      path = File.join(Compass.configuration.project_path, file_path)
    end
    
    Sass::Script::Bool.new(File.exists?(path)) 

  end
  
end

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To enable debugging comments that display the original location of your selectors. Uncomment:
line_numbers = true