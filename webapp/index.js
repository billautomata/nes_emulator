var d3 = require('d3')
var Stats = require('stats.js')
var stats = new Stats()
stats.showPanel(0)
window.stats = stats
document.body.appendChild(stats.dom)
stats.domElement.style.left = stats.domElement.style.top = null
stats.domElement.style.bottom = stats.domElement.style.right = '0px'

require('./utils.js')
var poller = require('./logic_analyzer.js').poller
var doper = require('./doper.js')
var input_recorder = require('./input_recorder.js')()

window.i = input_recorder

if (window.localStorage.getItem('input_dvr') === null) {
  window.localStorage.setItem('input_dvr', JSON.stringify(require('../runs/example_run.json')))
}

window.get_recording = function () {
  return JSON.stringify(window.localStorage.getItem('input_dvr'))
}

// var draw_memory = true
window.n_ticks = 1

require('./load_romfile.js')(function () {
  // main function
  var m = require('./draw_memory.js')()

  window.pollers = {}
  window.dopers = {}
  window.add_poller = add_poller
  window.add_both = add_both

  function add_poller (options) {
    window.pollers[options.addr] = poller(options)
  }
  function add_doper (options) {
    var d = doper(options)
    window.dopers[options.addr] = d
  }
  function add_both (options) {
    if (options.parent === undefined) {
      options.parent = d3.select('div#dopers').append('div').attr('class', 'doper_container')
    }
    add_doper(options)
    add_poller(options)
  }

  // add_poller({ name: 'current probe', addr: 235 })

  // crap
  // add_both({ name: 'unknown', addr: 1922, value: 24 })

  // found hacks
  // add_both({ name: 'mario fall rate', addr: 1802, value: 2 })
  // add_both({ name: 'player position y', addr: 0xCE, value: 32, active: false })
  // add_both({ name: 'god mode', addr: 0x9, value: 255, active: false })

  // add_doper({ name: 'enemy 0 type', addr: 0x0016, value: 0x01 })
  // add_doper({ name: 'enemy 1 type', addr: 0x0017, value: 0x01 })
  // add_doper({ name: 'enemy 2 type', addr: 0x0018, value: 0x01 })
  // add_doper({ name: 'enemy 3 type', addr: 0x0019, value: 0x01 })
  // add_doper({ name: 'enemy 4 type', addr: 0x001A, value: 0x01 })
  // add_doper({ name: 'powerup on screen', addr: 0x1B, value: 0x00, active: false })
  // add_doper({ name: 'all powerups star', addr: 0x0039, value: 0x02, active: false })
  // add_both({ name: 'smash the world up', addr: 159, value: 246 })
  // add_both({ name: 'sprite x position', addr: 942, value: 96 })
  // add_both({ name: 'awesome colors', addr: 1021, value: 255 })
  // add_both({ name: 'awesome colors', addr: 1022, value: 248 })
  // add_both({ name: 'disable jump', addr: 1075, value: 255 })
  // add_both({ name: 'player x speed', addr: 1110, value: 64 })
  // add_both({ name: 'mario draw state', addr: 1749, value: 24 })

  // add_both({ name: 'lock clock', addr: 1927, value: 24, })  // change to any value to lock the clock value

  // memory address 9 = flashing speed of icons

  add_both({ name: 'bg-sprite', addr: 1697, value: 12, active: true })
  // add_both({ name: 'what_block_loaded_1', addr: 1698, value: 12 })
  // add_both({ name: 'what_block_loaded_2', addr: 1699, value: 12 })
  // add_both({ name: 'what_block_loaded_3', addr: 1700, value: 12 })
  // add_both({ name: 'what_block_loaded_4', addr: 1701, value: 12 })
  // add_both({ name: 'what_block_loaded_5', addr: 1702, value: 12 })
  // add_both({ name: 'what_block_loaded_6', addr: 1703, value: 12 })
  // add_both({ name: 'what_block_loaded_7', addr: 1704, value: 12 })
  // add_both({ name: 'what_block_loaded_8', addr: 1705, value: 12 })
  // add_both({ name: 'what_block_loaded_9', addr: 1706, value: 12 })
  // add_both({ name: 'what_block_loaded_10', addr: 1707, value: 12 })
  // add_both({ name: 'what_block_loaded_11', addr: 1708, value: 12 })
  // add_both({ name: 'what_block_loaded_12', addr: 1709, value: 32 })

  window.memory_changes = []

  window.i.load()
  window.i.play()
  // window.i.ffw(150)

  var input = d3.select('div#emulator').append('input')
    .attr('type', 'range')
    .attr('min', '1')
    .attr('max', '10')
    .attr('step', '1')
    .property('value', window.n_ticks)
    .style('width', '100%')

  input.on('input', function () {
    window.n_ticks = d3.select(this).property('value')
  })

  tick()
  // setInterval(tick, 16)
  function tick () {
    stats.begin()
    var n_frames_per_tick = window.n_ticks
    while(n_frames_per_tick--){
      window.memory_changes = []
      input_recorder.tick()
      // iterate over the memory changes and update the appropriate pollers
      window.memory_changes.forEach(function (c) {
        var address = c[1]
        if (window.pollers[address] !== undefined) {
          window.pollers[address](c[2])
        }
      })
      if (window.draw_memory) {
        m.forEach(function (m, i) {
          m.attr('fill', d3.rgb(window.nes.cpu.mem[i], window.nes.cpu.mem[i], window.nes.cpu.mem[i]))
          m.attr('stroke', 'none')
        })
        window.memory_changes.forEach(function (c) {
          m[c[1]].attr('stroke', 'blue')
        })
      }
    }
    stats.end()
    window.requestAnimationFrame(tick)
  }
})
