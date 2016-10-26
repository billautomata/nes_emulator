module.exports.poller = poller

var d3 = require('d3')

function poller (options) {
  // options.name
  // options.addr
  // options.n_samples
  if (options.n_samples === undefined) {
    options.n_samples = 32
  }
  var samples = new Uint8Array(options.n_samples)
  var current_sample_idx = 0

  console.log('adding poller')

  var w = options.n_samples
  var h = 6
  var svg = d3.select('body').append('svg')
    .attr('viewBox', [ 0, 0, w, h ].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .attr('width', '100%')
    .style('outline', '1px solid black')

  var txt = svg.append('text').text(options.name)
    .attr('x', 1)
    .attr('y', 1)
    .attr('font-size', '1px')

  var scale_x = d3.scaleLinear().domain([0, options.n_samples]).range([1, w])
  var scale_y = d3.scaleLinear().domain([0, 255]).range([h, 0])

  var circles = []

  for (var i = 0; i < options.n_samples; i++) {
    circles.push(svg.append('circle')
      .attr('cx', scale_x(i))
      .attr('cy', scale_y(0))
      .attr('r', 0.5)
      .attr('fill', 'blue'))
  }

  function tick () {
    // sample
    samples[current_sample_idx] = window.nes.cpu.mem[options.addr]
    circles[current_sample_idx].attr('cy', scale_y(samples[current_sample_idx]))
    txt.text([options.name, samples[current_sample_idx]].join(' = '))
    current_sample_idx += 1
    if (current_sample_idx > samples.length - 1) {
      current_sample_idx = 0
    }
  }
  return tick
}
