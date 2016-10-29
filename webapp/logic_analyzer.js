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
  var svg = d3.select('div#dopers').append('svg')
    .attr('viewBox', [ 0, 0, w, h ].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .attr('width', '100%')
    .style('outline', '1px solid black')
    .attr('id', '_' + options.addr)

  var txt = svg.append('text').text(options.name)
    .attr('x', 1)
    .attr('y', 1)
    .attr('font-size', '1px')

  var scale_x = d3.scaleLinear().domain([0, options.n_samples]).range([1, w])
  var scale_y = d3.scaleLinear().domain([0, 255]).range([h - 1, 1])

  var circles = []
  var values = []

  for (var i = 0; i < options.n_samples; i++) {
    circles.push(svg.append('circle')
      .attr('cx', scale_x(i))
      .attr('cy', scale_y(0))
      .attr('r', 0.5)
      .attr('fill', 'rgb(33,66,255)'))
    values.push(svg.append('text')
      .attr('x', scale_x(i))
      .attr('y', scale_y(0))
      .attr('dy', '0.33em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '0.3px')
    )

  }

  function tick (v) {
    // console.log(v)
    // sample
    samples[current_sample_idx] = v
    circles[current_sample_idx].attr('cy', scale_y(samples[current_sample_idx]))
    values[current_sample_idx].attr('y', scale_y(samples[current_sample_idx]))
    values[current_sample_idx].text(samples[current_sample_idx])
    // txt.text([options.name, samples[current_sample_idx]].join(' = '))
    current_sample_idx += 1
    if (current_sample_idx > samples.length - 1) {
      current_sample_idx = 0
    }
  }
  return tick
}
