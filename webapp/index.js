var d3 = require('d3')

require('./utils.js')

require('./load_romfile.js')(function () {
  // window.nes.start()

  var n_memory_elements = 2048 // 2k
  var mem_width = 64
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

    var c = -1
    var changes = []

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

  var pollers = []
  function add_poller (options) {
    pollers.push(poller(options))
  }

  window.add_poller = add_poller

  add_poller({ name: 'enemy 0 type', addr: 0x0016 })
  add_poller({ name: 'enemy 1 type', addr: 0x0017 })
  add_poller({ name: 'player facing', addr: 0x0033 })
  add_poller({ name: '0x01', addr: 0x01 })
  add_poller({ name: 'player position y', addr: 0xCE })

  // draw the memory
  tick()
  function tick () {
    window.nes.frame()
    m.forEach(function (m, i) {
      m.attr('fill', d3.rgb(window.nes.cpu.mem[i], window.nes.cpu.mem[i], window.nes.cpu.mem[i]))
    })
    pollers.forEach(function (p) {
      p()
    })
    window.requestAnimationFrame(tick)
  }

})
