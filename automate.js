$.ajax({
    url: 'roms/Super Mario Bros. (JU) (PRG0) [!].nes',
    xhr: function() {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhr.overrideMimeType !== 'undefined') {
            // Download as binary
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }
        self.xhr = xhr;
        return xhr;
    },
    complete: function(xhr, status) {
        var i, data;
        if (JSNES.Utils.isIE()) {
            var charCodes = JSNESBinaryToArray(
                xhr.responseBody
            ).toArray();
            data = String.fromCharCode.apply(
                undefined,
                charCodes
            );
        }
        else {
            data = xhr.responseText;
        }
        console.log('got mario data')
        nes.loadRom(data);
        nes.start()
    }
});


// url: 'roms/Super Mario Bros. (JU) (PRG0) [!].nes',
