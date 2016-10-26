var d3 = require('d3')

module.exports = function doper (options) {
  // options.name
  // options.addr
  // options.value
  // options.active

  var name = options.name
  var addr = options.addr
  var value = options.value
  var isRunning = true

  var div_parent = d3.select('div#dopers').append('div')
  div_parent.style('display', 'inline-block')
  div_parent.style('background-color', 'rgba(255,0,0,0.1)')

  div_parent.append('div').html(options.name)
  div_parent.append('div').html(['addr', options.addr.toString(16)].join(' '))
  div_parent.append('input').property('value', options.value)

  div_parent.on('click', function () {
    if (isRunning) {
      stop()
    } else {
      start()
    }
  })

  if (options.active !== undefined) {
    isRunning = options.active
  } else {
    start()
  }

  function tick () {
    if (isRunning) {
      window.nes.cpu.mem[addr] = value
    }
  }
  function start () {
    div_parent.style('background-color', 'rgba(0,255,0,0.1)')
    isRunning = true
  }
  function stop () {
    isRunning = false
    div_parent.style('background-color', 'rgba(255,0,0,0.1)')
  }

  return {
    tick: tick,
    start: start,
    stop: stop
  }
}
