#!/usr/bin/env ruby

require 'webrick'

# configure the local webserver
server = WEBrick::HTTPServer.new :Port => 1337
server.mount "/", WEBrick::HTTPServlet::FileHandler, './'

# configure shutdown
trap('INT') { server.stop }

# start
server.start
