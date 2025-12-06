#!/usr/bin/env ruby

require 'nokogiri'
require 'uri'
require 'open-uri'
require 'open_uri_redirections'
require 'addressable/uri'
require 'net/http'
require 'fileutils'

REFERER = 'http://scholar.google.com'
PREFIX = 'https://www.academia.edu/download'
OPEN_URI_OPTIONS = {"Referer" => REFERER, :allow_redirections => :all}
MAX_RETRIES = 5

def get_content_type(url)
  uri = URI(url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true if uri.scheme == 'https'
  request = Net::HTTP::Head.new(uri)
  request['Referer'] = REFERER
  response = http.request(request)
  response['content-type']
rescue
  'application/pdf' # fallback
end

def extension_from_content_type(content_type)
  case content_type
  when /pdf/
    '.pdf'
  when /msword/
    '.doc'
  when /vnd.openxmlformats-officedocument.wordprocessingml.document/
    '.docx'
  else
    '.pdf' # fallback
  end
end

def detect_file_type(filename)
  File.open(filename, 'rb') do |f|
    header = f.read(8).bytes
    if header[0..3] == [0xD0, 0xCF, 0x11, 0xE0]
      '.doc'
    elsif header[0..4] == [0x25, 0x50, 0x44, 0x46, 0x2D] # %PDF-
      '.pdf'
    elsif header[0..3] == [0x50, 0x4B, 0x03, 0x04] # PK..
      '.docx'
    else
      '.pdf' # fallback
    end
  end
rescue
  '.pdf'
end

# Parse arguments
output_dir = 'output'
urls = []

ARGV.each do |arg|
  if arg.start_with?('--output=')
    output_dir = arg.split('=', 2)[1]
  else
    urls << arg
  end
end

urls.each do |academia_url|
  uri = Addressable::URI.parse(academia_url).normalize.to_s
  if URI(uri).host.nil? || URI(uri).path.nil? || URI(uri).path.empty? || !%{http https}.include?(URI(uri).scheme)
    $stderr.puts "Error parsing URL: #{academia_url}"
    exit 1
  end
  base_filename = URI(uri).path.split('/').last[0..250]
  FileUtils.mkdir_p(output_dir) unless Dir.exist?(output_dir)
  doc = nil
  if File.exist?(File.join(output_dir, base_filename + '.pdf')) || File.exist?(File.join(output_dir, base_filename + '.doc')) || File.exist?(File.join(output_dir, base_filename + '.docx'))
    $stderr.puts "#{base_filename} already exists in #{output_dir}, skipping"
  else
    if URI(uri).host.split('.')[-2..-1].join('.') != 'academia.edu'
      $stderr.puts "URL host must be 'academia.edu', error with URL: #{academia_url}"
      exit 1
    end
    retries = 0
    begin
      doc = Nokogiri::HTML(URI.open(uri))
    rescue OpenURI::HTTPError => e
      $stderr.puts e.inspect
      retries += 1
      if retries < MAX_RETRIES
        sleep(5)
        retry
      else
        $stderr.puts "Max retries (= #{MAX_RETRIES}) reached, exiting after trying to open URL: #{academia_url}"
        exit 1
      end
    end
    begin
      doc_script = doc.css('script').find{|script| script.content.include?('[{"id":')}
      download_id = doc_script.content.split('[{"id":')[1].split(',')[0]

      temp_url = "#{PREFIX}/#{download_id}/#{base_filename}.pdf"
      content_type = get_content_type(temp_url)
      ext = extension_from_content_type(content_type)
      filename = base_filename + ext
      file_path = File.join(output_dir, filename)
      url = "#{PREFIX}/#{download_id}/#{filename}"
      $stderr.puts "Resolved download URL: #{url} (Content-Type: #{content_type})"
      stream = URI.open(url, **OPEN_URI_OPTIONS)
      IO.copy_stream(stream, file_path)
      # Detect actual file type from content
      actual_ext = detect_file_type(file_path)
      if actual_ext != ext
        new_filename = base_filename + actual_ext
        new_file_path = File.join(output_dir, new_filename)
        File.rename(file_path, new_file_path)
        filename = new_filename
        file_path = new_file_path
        $stderr.puts "Renamed to #{filename} based on file content"
      end
      $stderr.puts "Downloaded #{file_path}"
    rescue StandardError => e
      $stderr.puts "Error parsing/downloading file for URL #{url}: #{e.inspect}"
      $stderr.puts e.backtrace
      exit 1
    end
  end
end
