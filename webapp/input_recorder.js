module.exports = function input_recorder () {
  var nes_state = ''
  var input_frames = []

  var current_frame
  var isRunning = false
  var isPlaying = false
  var isRecording = false

  function record () {
    isRunning = true
    isRecording = true
    nes_state = JSON.stringify(window.nes.toJSON())
    input_frames = []
    current_frame = 0
  }
  function stop () {
    isRunning = false
    isPlaying = false
    isRecording = false
  }
  function play () {
    window.nes.fromJSON(JSON.parse(nes_state))
    current_frame = 0
    isPlaying = true
    isRunning = true
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
    play()
  }
  function tick () {
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
          input_frames[current_frame].forEach(function (v, idx) {
            window.nes.keyboard.state1[idx] = v
          })
        }
        current_frame += 1
      }
    }
  }

  return {
    tick: tick,
    play: play,
    record: record,
    stop: stop,
    save: save,
    load: load
  }

}
