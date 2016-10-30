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

  var type = ''
  var ring = []
  var ring_index = 0

  if (options.ring !== undefined) {
    type = 'ring'
    loadring(options)
  }

  var div_parent

  if (options.parent === undefined) {
    div_parent = d3.select('div#dopers').append('div')
  } else {
    div_parent = options.parent
  }

  div_parent = div_parent.append('div')
  div_parent.style('width', '100%')
    .style('background-color', 'rgba(255,0,0,0.1)')
    .style('padding-top', '2px')

  div_parent.append('div').html([options.name, ['addr', options.addr.toString(10)].join(' ')].join('-')).style('font-size', '10px')

  var div_value = div_parent.append('div')
    .attr('class', 'doper-value').html(value)

  div_parent.append('button').html('activate').on('click', function () {
    if (isRunning) {
      stop()
      d3.select(this).html('activate')
    } else {
      start()
      d3.select(this).html('deactivate')
    }
  })

  div_parent.append('button').html('-').on('click', function () {
    value = Number(value) - 1
    input.property('value', value)
    div_value.html(value)
  })
  div_parent.append('button').html('+').on('click', function () {
    value = Number(value) + 1
    input.property('value', value)
    div_value.html(value)
  })
  div_parent.append('button').html('remove').on('click', function () {
    div_parent.selectAll('*').remove()
    div_parent.remove()
    d3.select('svg#_' + addr).selectAll('*').remove()
    d3.select('svg#_' + addr).remove()
    window.pollers[addr] = undefined
    window.dopers[addr] = undefined
  })

  var input = div_parent.append('input')
    .attr('type', 'range')
    .attr('min', '0')
    .attr('max', '255')
    .attr('step', '1')
    .property('value', options.value)
    .style('width', '98%')

  input.on('input', function () {
    value = d3.select(this).property('value')
    div_value.html(value)
  })

  if (options.active !== undefined) {
    isRunning = options.active
  } else {
    start()
  }

  // function tick () {
  // if (isRunning) {
  //   window.nes.cpu.mem[addr] = value
  // }
  // }
  function start () {
    div_parent.style('background-color', 'rgba(0,255,0,0.1)')
    isRunning = true
  }
  function stop () {
    isRunning = false
    div_parent.style('background-color', 'rgba(255,0,0,0.1)')
  }
  function v () {
    if (type === 'ring') {
      ring_index += 1
      ring_index = ring_index % ring.length
      value = ring[ring_index]
      input.property('value', value)
    }
    return value
  }
  function loadring (options) {
    ring_index = 0
    if (options.padding !== undefined) {
      ring = []
      options.ring.forEach(function (v) {
        for (var i = 0; i < options.padding; i++) {
          ring.push(v)
        }
      })
    } else {
      ring = options.ring
    }
  }
  return {
    start: start,
    stop: stop,
    status: function () { return isRunning },
    value: v,
    loadring: loadring
  }
}
