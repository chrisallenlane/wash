#!/usr/bin/env ruby

require 'webrick'
require 'webrick/httpproxy'

# configure the proxy server
proxy = WEBrick::HTTPProxyServer.new(
    :Port            => 1338,
    :RequestCallback => Proc.new{ |req, res| puts req.request_line, req.raw_header}
)

# configure shutdown
trap('INT'){ proxy.shutdown }

# start
proxy.start
