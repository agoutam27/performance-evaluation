import stream from 'stream';

const { Transform } = stream || require('readable-stream');

class MyFileFormatter extends Transform {

    constructor(options) {
        super(options);
        this._lastChunkEndedWithCR = true;
        // Forcing Object Mode
        this._readableState.objectMode = true;
        this._writableState.objectMode = true;
        this._partialLine = "";
    }

    _transform(chunk, encoding, cb) {
        encoding = encoding || 'utf8';
  
        if (Buffer.isBuffer(chunk)) {
            if (encoding == 'buffer') {
                chunk = chunk.toString(); // utf8
                encoding = 'utf8';
            }
            else {
                chunk = chunk.toString(encoding);
            }
        }

        var lines = chunk.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g);

        if (this._lastChunkEndedWithCR && chunk[0] == '\n') {
            lines.shift();
        }

        lines[0] = this._partialLine + lines[0];

        this._lastChunkEndedWithCR = chunk[chunk.length - 1] == '\r';
        let _bufferedObjects = {};

        for(let i = 0; i < lines.length - 1; i++) {
            let line = lines[i];
            let splittedLine = line.split(",");
            let dateString = splittedLine[0];
            if(dateString === "DATE") continue;
            let year = new Date(dateString).getFullYear();
            if(isNaN(year)) {
                throw new Error("Date String could not be parsed");
            }
            let data = splittedLine[1];
            _bufferedObjects[year] = _bufferedObjects[year] 
                ? _bufferedObjects[year] + "," + data
                : data;
        }
        this._partialLine = lines[lines.length - 1];

        this.push(_bufferedObjects);
        cb();
    }
}

export default MyFileFormatter;