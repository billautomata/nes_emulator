var d3 = require('d3')

require('./utils.js')

require('./load_romfile.js')(function () {
  // window.nes.start()

  var n_memory_elements = 2048 // 2k
  var mem_width = 128
  var div_memory = d3.select('div#memory')
  var svg = div_memory.append('svg')
    .attr('viewBox', [0, 0, mem_width, n_memory_elements / mem_width].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .attr('width', '100%')

  // var scale_x = d3.scaleLinear().domain([0, mem_width]).range([])

  var m = []
  for (var i = 0; i < n_memory_elements; i++) {
    var y = Math.floor(i / mem_width)
    var x = i - (y * mem_width)
    m.push(svg.append('rect').attr('x', x)
      .attr('y', y)
      .attr('width', 1)
      .attr('height', 1)
      .attr('stroke', 'none'))
  }

  // draw the memory
  setInterval(function () {
    window.nes.frame()
    m.forEach(function (m, i) {
      m.attr('fill', d3.rgb(window.nes.cpu.mem[i], window.nes.cpu.mem[i], window.nes.cpu.mem[i]))
    })
  }, 14)

})
