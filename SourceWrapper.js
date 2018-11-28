import fs from 'fs';
import { Readable } from 'stream';

class SourceWrapper extends Readable {
    constructor(options) {
        super(options);

        this._source = fs.createReadStream("/home/vassar/Documents/python/printStuff.py");
        // this._source = process.stdin;

        // Every time there's data, push it into the internal buffer.
        this._source.on('data', (chunk) => {
            // if push() returns false, then stop reading from source
            console.log("chunk", chunk)
            if (!this.push(chunk))
                this._source.pause();
        });

        // When the source ends, push the EOF-signaling `null` chunk
        this._source.on('end', () => {
            this.push(null);
        });
    }
    // _read will be called when the stream wants to pull more data in
    // the advisory size argument is ignored in this case.
    _read(size) {
        console.log(this._source)
        this._source.resume();
    }
}

export default SourceWrapper;