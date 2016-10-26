var d3 = require('d3')
var Stats = require('stats.js')
var stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

require('./utils.js')
var poller = require('./logic_analyzer.js').poller
var doper = require('./doper.js')
var input_recorder = require('./input_recorder.js')()

window.i = input_recorder

if (window.localStorage.getItem('input_dvr') === null) {
  window.localStorage.setItem('input_dvr', JSON.stringify(require('../runs/example_run.json')))
}

var draw_memory = false

require('./load_romfile.js')(function () {
  // main function

  var m = require('./draw_memory.js')()

  var pollers = []
  function add_poller (options) {
    pollers.push(poller(options))
  }
  window.add_poller = add_poller

  var dopers = []
  function add_doper (options) {
    var d = doper(options)
    // d.start()
    dopers.push(d)
  }

  // add_poller({ name: 'enemy 0 type', addr: 0x0016 })
  // add_poller({ name: 'enemy 1 type', addr: 0x0017 })
  // add_poller({ name: 'player facing', addr: 0x0033 })
  // add_poller({ name: '0x00', addr: 0x00 })
  // add_poller({ name: 'player position y', addr: 0xCE })

  // add_doper({ name: 'enemy 0 type', addr: 0x0016, value: 0x01 })
  // add_doper({ name: 'enemy 1 type', addr: 0x0017, value: 0x01 })
  // add_doper({ name: 'enemy 2 type', addr: 0x0018, value: 0x01 })
  // add_doper({ name: 'enemy 3 type', addr: 0x0019, value: 0x01 })
  // add_doper({ name: 'enemy 4 type', addr: 0x001A, value: 0x01 })
  // add_doper({ name: 'powerup on screen', addr: 0x1B, value: 0x00, active: false })
  // add_doper({ name: 'test', addr: 0x00, value: 0x248 })

  // add_doper({ name: 'all powerups star', addr: 0x0039, value: 0x02, active: false })

  // add_doper({
  //   name: 'power up state',
  //   addr: 0x756,
  //   value: 0x3
  // })

  window.memory_changes = []

  window.i.load()
  window.i.play()
  // window.i.ffw(400)
  // window.i.pause()

  tick()
  // setInterval(tick, 16)
  function tick () {
    stats.begin()
    var n_frames_per_tick = 1
    while(n_frames_per_tick--){
      if (input_recorder.active()) {
        window.memory_changes = []
        input_recorder.tick()
        dopers.forEach(function (d) {
          d.tick()
        })

        window.nes.frame()

        if (draw_memory) {
          m.forEach(function (m, i) {
            m.attr('fill', d3.rgb(window.nes.cpu.mem[i], window.nes.cpu.mem[i], window.nes.cpu.mem[i]))
          })
        }
        pollers.forEach(function (p) {
          p()
        })
        dopers.forEach(function (d) {
          d.tick()
        })
      }
    }
    stats.end()
    window.requestAnimationFrame(tick)
  }
})
