var d3 = require('d3')
module.exports = function input_recorder () {
  var nes_state = ''
  var input_frames = []

  var current_frame

  var isRunning = false // is the simulation ticking forward
  var isRecording = false // are the current frame inputs being recorded
  var isLoadingInputs = true // are the current frame inputs copied to the keyboard
  var isPlaying = false // is the current frame being advanced

  var nesPaused = false

  var isInControl = true

  var div_parent = d3.select('div#input_recorder')

  var w = 100
  var h = 2
  var svg = div_parent.append('svg')
    .attr('viewBox', [ 0, 0, w, h ].join(' '))
    .attr('preserveApsectRatio', 'xMidYMid')
    .attr('width', '100%')
    .style('background-color', 'rgb(250,250,250)')
    // .style('outline', '1px solid black')

  var play_head = svg.append('rect')
    .attr('x', 0).attr('y', 0)
    .attr('width', 0).attr('height', h)
    .attr('fill', 'rgb(33,66,255)')

  var scale_x = d3.scaleLinear().domain([0, input_frames.length]).range([0, w])

  var div_status = div_parent.append('div').html('status: ').append('span').html('--')
  var div_framecount = div_parent.append('div').html('frame: ').append('span').html('--')

  var div_controls = div_parent.append('div')
  div_controls.append('button').html('restart').on('click', function () {
    play()
  })

  // restart, loads state, resets current frame
  // replay inputs on, nes running, inputs loaded per frame
  // replay inputs off, nes running, inputs not loaded per frame

  div_controls.append('button').html('is loading inputs').on('click', function () {
    isLoadingInputs = !isLoadingInputs
    if (!isLoadingInputs) {
      // unload the state of the nes controller
      window.nes.keyboard.state1.forEach(function (v, idx) {
        window.nes.keyboard.state1[idx] = 64
      })
    }
    // update the visuals of the button
    if (isLoadingInputs) {
      d3.select(this).html('is loading inputs')
    } else {
      d3.select(this).html('not loading inputs')
    }
  })
  div_controls.append('button').html('pause').on('click', function () {
    pause()
  })
  div_controls.append('button').html('unpause').on('click', function () {
    unpause()
  })
  div_controls.append('button').html('record').on('click', function () {
    record()
  })
  div_controls.append('button').html('stop').on('click', function () {
    stop()
  })
  div_controls.append('button').html('write to disk').on('click', function () {
    save()
  })
  div_controls.append('button').html('reset nes').on('click', function () {
    window.nes.reloadRom()
  })

  function ffw (frame) {
    isRunning = true
    isPlaying = true
    while(current_frame < frame){
      window.memory_changes = []
      console.log(current_frame)
      tick()
    }
  }

  function record () {
    isRunning = true
    isRecording = true
    var nes_json_object = window.nes.toJSON()
    nes_json_object.romData = ''
    nes_state = JSON.stringify(nes_json_object)
    input_frames = []
    current_frame = 0
    div_status.html('recording')
  }

  function pause () {
    isRunning = false
    div_status.html('paused')
  }

  function unpause () {
    isRunning = true
    div_status.html('playing')
  }
  function stop () {
    isPlaying = false
    isRecording = false
    div_status.html('not playing recording')
  }
  function load () {
    var input_dvr = JSON.parse(window.localStorage.getItem('input_dvr'))
    input_dvr.nes_state.romData = window.romdata
    nes_state = input_dvr.nes_state
    input_frames = input_dvr.input_frames
    scale_x = d3.scaleLinear().domain([0, input_frames.length]).range([0, w])
    current_frame = 0
  }

  function play () {
    window.nes.fromJSON(JSON.parse(nes_state))
    current_frame = 0
    isPlaying = true
    isRunning = true
    // isLoadingInputs = true
    div_status.html('playing')
  }

  function off () {
    pause()
    window.nes.keyboard.state1.forEach(function (v, idx) {
      window.nes.keyboard.state1[idx] = 0
    })
  }

  function on () {
    isLoadingInputs = true
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
        window.nes.frame()
      } else {
        if (current_frame < input_frames.length) {
          play_head.attr('width', scale_x(current_frame))
          if (isLoadingInputs) {
            input_frames[current_frame].forEach(function (v, idx) {
              window.nes.keyboard.state1[idx] = v
            })
          }
          if (isPlaying) {
            current_frame += 1
          }
          window.nes.frame()
        } else {
          // reset the system because current frames exhausted
          setTimeout(function () {
            play()
          }, 0)
        }
      }
    }
  }

  return {
    tick: tick,
    play: play,
    load: load,
    save: save,
    ffw: ffw
  }

}
