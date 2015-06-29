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

class CssSplitter
 
  def self.split(infile, outdir = File.dirname(infile), max_selectors = 4095)
 
    raise "infile could not be found" unless File.exists? infile
 
    rules = IO.readlines(infile, "}")
    return if rules.first.nil?
 
    charset_statement, rules[0] = rules.first.partition(/^\@charset[^;]+;/)[1,2]
    return if rules.nil?
 
    # The infile remains the first file
    file_id = 1
    selectors_count = 0
    output = nil
 
    rules.each do |rule|
      rule_selectors_count = count_selectors_of_rule rule
      selectors_count += rule_selectors_count
 
      # Nothing happens until the selectors limit is reached for the first time
      if selectors_count > max_selectors
        # Close current file if there is already one
        output.close if output
 
        # Prepare next file
        file_id += 1
        filename = File.join(outdir, File.basename(infile, File.extname(infile)) + "_#{file_id.to_s}" + File.extname(infile))
        output = File.new(filename, "w")
        output.write charset_statement
 
        # Reset count with current rule count
        selectors_count = rule_selectors_count
      end
 
      output.write rule if output
    end
  end
 
  def self.count_selectors(css_file)
    raise "file could not be found" unless File.exists? css_file
 
    rules = IO.readlines(css_file, '}')
    return if rules.first.nil?
 
    charset_statement, rules[0] = rules.first.partition(/^\@charset[^;]+;/)[1,2]
    return if rules.first.nil?
 
    rules.inject(0) {|count, rule| count + count_selectors_of_rule(rule)}.tap do |result|
      puts File.basename(css_file) + " contains #{result} selectors."
    end
  end
 
  def self.count_selectors_of_rule(rule)
    rule.partition(/\{/).first.scan(/,/).count.to_i + 1
  end
  
end

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To enable debugging comments that display the original location of your selectors. Uncomment:
line_numbers = true

on_stylesheet_saved do |path|
  CssSplitter.split(path) unless path[/\d+$/]
end