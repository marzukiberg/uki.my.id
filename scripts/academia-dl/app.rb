require 'sinatra'
require 'uri'
require 'fileutils'

set :bind, '0.0.0.0'

get '/' do
  erb :index
end

post '/download' do
  url = params[:url]
  # Extract base filename from URL
  base_filename = URI.parse(url).path.split('/').last[0..250]
  output_dir = 'output'
  FileUtils.mkdir_p(output_dir) unless Dir.exist?(output_dir)

  # Find the downloaded file (could be .pdf, .doc, .docx) in output/
  possible_files = ["#{base_filename}.pdf", "#{base_filename}.doc", "#{base_filename}.docx"]
  existing_path = possible_files.map { |f| File.join(output_dir, f) }.find { |p| File.exist?(p) }

  result = nil
  # If not found, call the academia-dl script which will write to output/
  unless existing_path
    result = `bundle exec ruby academia-dl.rb "#{url}" 2>&1`
    existing_path = possible_files.map { |f| File.join(output_dir, f) }.find { |p| File.exist?(p) }
  end

  if existing_path && File.exist?(existing_path)
    content_type = case File.extname(existing_path)
                   when '.pdf' then 'application/pdf'
                   when '.doc' then 'application/msword'
                   when '.docx' then 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                   else 'application/octet-stream'
                   end
    send_file existing_path, filename: File.basename(existing_path), type: content_type
  else
    @result = "Download failed: #{result || 'file not found in output/'}"
    erb :index
  end
end