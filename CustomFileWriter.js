import { Writable } from 'stream';
import fs from 'fs';

class CustomFileWriter extends Writable {

    constructor(options, outputFileDir) {
        super(options);
        this._lastChunkEndedWithCR = true;
        // Forcing Object Mode
        this._writableState.objectMode = true;
        this._partialLine = "";
        this._outputFileDir = outputFileDir;
        this._fsWriteStreams = {};
        this._file = null;
    }

    _write(chunk, encoding, callback) {

        encoding = encoding || 'utf8';
  
        if (Buffer.isBuffer(chunk)) {
            console.log("chunk is buffer")
            if (encoding == 'buffer') {
                chunk = chunk.toString(); // utf8
                encoding = 'utf8';
            }
            else {
                chunk = chunk.toString(encoding);
            }
            chunk = JSON.parse(chunk);
        }

        var { file } = chunk;
        if(!this._file) {
            this._file = file;
        }
        chunk = chunk.chunk;

        var lines = chunk.split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g);

        if (this._lastChunkEndedWithCR && chunk[0] == '\n') {
            lines.shift();
        }

        lines[0] = this._partialLine + lines[0];
        this._partialLine = lines.pop();

        this._lastChunkEndedWithCR = chunk[chunk.length - 1] == '\r';

        for(let i = 0; i < lines.length ; i++) {

            let splittedLine = lines[i].split(",");
            let dateString = splittedLine[0];

            if(dateString === "DATE") continue;

            let date = new Date(dateString);
            let year = date.getFullYear();
            if(isNaN(year)) {
                throw new Error("Date String could not be parsed");
            }

            let data = splittedLine[1];
            if(!this._fsWriteStreams[year]) {
                this._fsWriteStreams[year] = fs.createWriteStream(this._outputFileDir + year + ".csv");
            }

            this._fsWriteStreams[year].write(
                date.getTime() === new Date(year, 0, 1).getTime() 
                ? "\n" + file + "," + data 
                : data
            );
        }
    }
}

export default CustomFileWriter;