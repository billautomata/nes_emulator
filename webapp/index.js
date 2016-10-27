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

var draw_memory = true

require('./load_romfile.js')(function () {
  // main function
  var m = require('./draw_memory.js')()

  window.pollers = {}
  window.dopers = {}
  window.add_poller = add_poller

  function add_poller (options) {
    window.pollers[options.addr] = poller(options)
  }
  function add_doper (options) {
    var d = doper(options)
    window.dopers[options.addr] = d
  }
  function add_both (options) {
    add_doper(options)
    add_poller(options)
  }

  add_poller({ name: 'current probe', addr: 1110 })

  // add_both({ name: 'unknown', addr: 1020, value: 85 })
  // add_both({ name: 'unknown', addr: 1021, value: 255 })
  // add_both({ name: 'unknown', addr: 1023, value: 85 })
  // add_both({ name: 'unknown', addr: 1024, value: 85 })

  // crap
  // add_both({ name: 'unknown', addr: 1922, value: 24 })

  // found hacks

  // add_both({ name: 'player position y', addr: 0xCE, value: 32 })

  // add_doper({ name: 'enemy 0 type', addr: 0x0016, value: 0x01 })
  // add_doper({ name: 'enemy 1 type', addr: 0x0017, value: 0x01 })
  // add_doper({ name: 'enemy 2 type', addr: 0x0018, value: 0x01 })
  // add_doper({ name: 'enemy 3 type', addr: 0x0019, value: 0x01 })
  // add_doper({ name: 'enemy 4 type', addr: 0x001A, value: 0x01 })
  // add_doper({ name: 'powerup on screen', addr: 0x1B, value: 0x00, active: false })
  // add_doper({ name: 'all powerups star', addr: 0x0039, value: 0x02, active: false })
  // add_both({ name: 'sprite x position', addr: 942, value: 96 })
  // add_both({ name: 'awesome colors', addr: 1021, value: 255 })
  // add_both({ name: 'awesome colors', addr: 1022, value: 248 })
  // add_both({ name: 'disable jump', addr: 1075, value: 255 })
  // add_both({ name: 'player x speed', addr: 1110, value: 64 })
  // add_both({ name: 'mario draw state', addr: 1749, value: 24 })
  // add_both({ name: 'lock clock', addr: 1927, value: 24, })  // change to any value to lock the clock value
  // add_both({ name: 'smash the world up', addr: 159, value: 246 })

  // add_doper({
  //   name: 'power up state',
  //   addr: 0x756,
  //   value: 0x3
  // })

  window.memory_changes = []

  window.i.load()
  window.i.play()
  window.i.ffw(150)
  // window.i.off()
  // window.i.pause()

  tick()
  // setInterval(tick, 16)
  function tick () {
    stats.begin()
    var n_frames_per_tick = 4
    while(n_frames_per_tick--){
      if (input_recorder.active()) {
        window.memory_changes = []
        input_recorder.tick()

        window.nes.frame()

        window.memory_changes.forEach(function (c) {
          var address = c[1]
          // console.log(address)
          if (window.pollers[address] !== undefined) {
            window.pollers[address](c[2])
          }
        })
        if (draw_memory) {
          m.forEach(function (m, i) {
            m.attr('fill', d3.rgb(window.nes.cpu.mem[i], window.nes.cpu.mem[i], window.nes.cpu.mem[i]))
          })
        }
      } else {
        window.nes.frame()
      }

    }
    stats.end()
    window.requestAnimationFrame(tick)
  }
})
