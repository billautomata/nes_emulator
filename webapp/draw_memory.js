module.exports = draw_memory

var d3 = require('d3')

function draw_memory () {
  var n_memory_elements = 2048 // 2k
  var mem_width = 48
  var div_memory = d3.select('div#memory')

  var div_controls = div_memory.append('div')

  div_controls.append('button')
    .datum({clicked: false})
    .html('draw memory')
    .on('click', function () {
      var v = d3.select(this).datum().clicked
      d3.select(this).datum().clicked = !v
      window.draw_memory = d3.select(this).datum().clicked
    })
  var hover_indicator = div_controls.append('span').style('padding-left', '10px').style('font-size', '10px')

  var svg = div_memory.append('svg')
    .attr('viewBox', [0, 0, mem_width, Math.ceil(n_memory_elements / mem_width)].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .attr('width', '100%')
    .style('background-color', 'black')

  // var scale_x = d3.scaleLinear().domain([0, mem_width]).range([])

  var howthisworks = ''
  howthisworks += '<h4>how this works</h4>'
  howthisworks += ['Click [draw memory].  That renders the memory layout of the first 2048 bytes of the NES above. ',
    'The values are the brightness of the rectangle, and a blue stroke indicates that memory address is active. ',
    'Click the memory address to add a probe and a doper.  The probe will update whenever the value is read.  ',
    'For some addresses this is only a handful of times per level, others are read 100 times per frame.  ',
    'Click activate to change the value to whatever you have set at the slider.  ',
    'The value of the probe should be locked to the value set with the slider, indicating the memory is being replaced by your custom value.',
    'To record your own run...',
    'You need to stop the run that is currently playing..',
    'Press [stop] > [is loading inputs] > [reset nes] > [record] > play your run > [stop] > [write to disk] > [restart]'
  ].join('<br><br>')

  var div_explain = div_memory.append('div')
    .style('max-height', '100px')
    .style('overflow-y', 'scroll')
    .html(howthisworks)

  var m = []
  for (var i = 0; i < n_memory_elements; i++) {
    var y = Math.floor(i / mem_width)
    var x = i - (y * mem_width)
    var rect = svg.append('rect').attr('x', x)
      .attr('y', y)
      .attr('width', 1)
      .attr('height', 1)
      .attr('stroke', 'none')
      .attr('stroke-width', '0.2px')
      .datum(i)
    rect.on('mouseover', function () {
      hover_indicator.html(['hovering over', d3.select(this).datum(), '0x' + Number(d3.select(this).datum()).toString(16).toUpperCase()].join(' '))
    })
    rect.on('click', function () {
      var i = d3.select(this).datum()
      window.add_both({ name: i, addr: i, value: 0, active: false })
    })
    m.push(rect)
  }
  return m
}
