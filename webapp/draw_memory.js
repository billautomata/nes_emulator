module.exports = draw_memory

var d3 = require('d3')

function draw_memory () {
  var n_memory_elements = 2048 // 2k
  var mem_width = 64
  var div_memory = d3.select('div#memory')
  var svg = div_memory.append('svg')
    .attr('viewBox', [0, 0, mem_width, n_memory_elements / mem_width].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .attr('width', '100%')
    .style('background-color', 'black')

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
  return m
}
