var d3 = require('d3')
var Stats = require('stats.js')
var stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

require('./utils.js')
var poller = require('./logic_analyzer.js').poller
var input_recorder = require('./input_recorder.js')()

window.i = input_recorder

var draw_memory = false

require('./load_romfile.js')(function () {
  // main function

  var m = require('./draw_memory.js')()

  var pollers = []
  function add_poller (options) {
    pollers.push(poller(options))
  }

  window.add_poller = add_poller

  // add_poller({ name: 'enemy 0 type', addr: 0x0016 })
  // add_poller({ name: 'enemy 1 type', addr: 0x0017 })
  // add_poller({ name: 'player facing', addr: 0x0033 })
  // add_poller({ name: '0x01', addr: 0x01 })
  // add_poller({ name: 'player position y', addr: 0xCE })

  // draw the memory
  tick()
  function tick () {
    stats.begin()
    window.memory_changes = []
    input_recorder.tick()
    window.nes.frame()
    if (draw_memory) {
      m.forEach(function (m, i) {
        m.attr('fill', d3.rgb(window.nes.cpu.mem[i], window.nes.cpu.mem[i], window.nes.cpu.mem[i]))
      })
    }
    pollers.forEach(function (p) {
      p()
    })
    stats.end()
    window.requestAnimationFrame(tick)
  }
})
