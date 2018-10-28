const http = require('http'),
    index = require('./index'),
    port = process.env.PORT || 3000,
    server = http.createServer(index)

server.listen(port)