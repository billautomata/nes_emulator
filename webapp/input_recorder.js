var d3 = require('d3')
module.exports = function input_recorder () {
  var nes_state = ''
  var input_frames = []

  var current_frame
  var isRunning = false
  var isPlaying = false
  var isRecording = false
  var isInControl = true

  var div_parent = d3.select('div#input_recorder')

  var w = 100
  var h = 2
  var svg = div_parent.append('svg')
    .attr('viewBox', [ 0, 0, w, h ].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .attr('width', '100%')
    .style('outline', '1px solid black')

  var play_head = svg.append('rect').attr('x', 0).attr('y', 0).attr('width', 0).attr('height', h)
  var scale_x = d3.scaleLinear().domain([0, input_frames.length]).range([0, w])

  var div_status = div_parent.append('div').html('status: ').append('span').html('--')
  var div_framecount = div_parent.append('div').html('frame: ').append('span').html('--')

  var div_controls = div_parent.append('div')
  div_controls.append('button').html('restart').on('click', function () {
    play()
  })
  div_controls.append('button').html('pause').on('click', function () {
    pause()
  })
  div_controls.append('button').html('unpause').on('click', function () {
    unpause()
  })
  div_controls.append('button').html('player control off').on('click', function () {
    off()
  })
  div_controls.append('button').html('player control on').on('click', function () {
    on()
  })

  div_controls.append('button').html('>>').on('click', function () {
    isRunning = true
    isPlaying = true
    window.memory_changes = []
    tick()
    window.nes.frame()
    isRunning = false
  })

  function ffw (frame) {
    isRunning = true
    isPlaying = true
    while(current_frame < frame){
      window.memory_changes = []
      console.log(current_frame)
      tick()
      window.nes.frame()
    }
  }

  function record () {
    isRunning = true
    isRecording = true
    nes_state = JSON.stringify(window.nes.toJSON())
    input_frames = []
    current_frame = 0
    div_status.html('recording')
  }
  function pause () {
    isRunning = false
  }
  function unpause () {
    isRunning = true
  }

  function stop () {
    isRunning = false
    isPlaying = false
    isRecording = false
    div_status.html('stopped')
  }
  function play () {
    window.nes.fromJSON(JSON.parse(nes_state))
    current_frame = 0
    isPlaying = true
    isRunning = true
    div_status.html('playing')
  }

  function off () {
    pause()
    isInControl = false
    window.nes.keyboard.state1.forEach(function (v, idx) {
      window.nes.keyboard.state1[idx] = 0
    })
  }

  function on () {
    isInControl = true
    unpause()
  }

  function push_state (state) {
    input_frames.push(state)
  }

  function save () {
    window.localStorage.setItem('input_dvr', JSON.stringify({
      nes_state: nes_state,
      input_frames: input_frames
    }))
  }
  function load () {
    var input_dvr = JSON.parse(window.localStorage.getItem('input_dvr'))
    nes_state = input_dvr.nes_state
    input_frames = input_dvr.input_frames
    scale_x = d3.scaleLinear().domain([0, input_frames.length]).range([0, w])
    current_frame = 0
  }
  function tick () {
    div_framecount.html(current_frame)
    if (isRunning) {
      if (isRecording) {
        var o = []
        window.nes.keyboard.state1.forEach(function (v) {
          o.push(v)
        })
        push_state(o)
        current_frame += 1
      } else if (isPlaying) {
        if (current_frame < input_frames.length) {
          play_head.attr('width', scale_x(current_frame))
          input_frames[current_frame].forEach(function (v, idx) {
            window.nes.keyboard.state1[idx] = v
          })
          current_frame += 1
        } else {
          setTimeout(function () {
            // load()
            play()
          }, 0)
        }
      }
    }
  }

  return {
    tick: tick,
    play: play,
    record: record,
    stop: stop,
    save: save,
    load: load,
    ffw: ffw,
    pause: pause,
    unpause: unpause,
    off: off,
    on: on,
    active: function () { return isRunning }
  }

}
