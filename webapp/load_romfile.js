module.exports = function (callback) {
  window.$.ajax({
    url: 'roms/Super Mario Bros. (JU) (PRG0) [!].nes',
    xhr: function () {
      var xhr = window.$.ajaxSettings.xhr()
      if (typeof xhr.overrideMimeType !== 'undefined') {
        // Download as binary
        xhr.overrideMimeType('text/plain; charset=x-user-defined')
      }
      // self.xhr = xhr
      return xhr
    },
    complete: function (xhr, status) {
      var data
      if (window.JSNES.Utils.isIE()) {
        var charCodes = window.JSNESBinaryToArray(
          xhr.responseBody
        ).toArray()
        data = String.fromCharCode.apply(
          undefined,
          charCodes
        )
      } else {
        data = xhr.responseText
      }
      console.log('got mario data')
      window.romdata = data
      window.nes.loadRom(window.romdata)
      callback()
    }
  })

// url: 'roms/Super Mario Bros. (JU) (PRG0) [!].nes',
}
