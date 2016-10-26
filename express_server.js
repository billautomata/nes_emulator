var http = require('http')
var express = require('express')

// start express server
var port = 60000

var app = express()
app.use(require('body-parser').json())

var server = http.createServer(app).listen(port, function () {
  console.log('listening on', port)
})

app.use(express.static(__dirname + '/'))
