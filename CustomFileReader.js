import fs from 'fs';
import util from 'util';
import { Readable } from 'stream';

const readdir = util.promisify(fs.readdir);

class CustomFileReader extends Readable {
    constructor(options, directory) {
        super(options);
        this._readableState.objectMode = true;
        this._sources = [];
        this._deadSourcesCount = 0;
        this.createStream(directory);
    }

    createStream(directory) {
        readdir(directory)
           .then((resolve, reject) => {

                if(reject) {
                    throw new Error("Promise was rejected")
                }

                if(resolve.length < 1) {
                    throw new Error("Empty Directory");
                }

                resolve.forEach(file => {
                    this._sources.push({
                        source: fs.createReadStream(directory + file, {encoding: "utf8"}),
                        file
                    });
                });

                this._source = this._sources[this._deadSourcesCount].source;
                // this._source.readStart();
            
                // Every time there's data, push it into the internal buffer.
                this._source.on('data', (chunk) => {
                    if(Buffer.isBuffer(chunk)) {
                        chunk = chunk.toString();
                    }
                    console.log("_")
                    // if push() returns false, then stop reading from source
                    if (!this.push({ chunk, file: this._sources[this._deadSourcesCount].file}))
                        this._source.pause();
                });
            
                this._source.on('end', () => {
                    console.log("onend")
                    this._deadSourcesCount++;
                    if(this._sources.length <= this._deadSourcesCount) {
                        // When the source ends, push the EOF-signaling `null` chunk
                        this.push(null);
                        return;
                    }
                    this.push({chunk: "", file: this._sources[this._deadSourcesCount].file});
                    this._source = this._sources[this._deadSourcesCount].source;
                });
           })
           .catch(console.error);
    }

    // _read will be called when the stream wants to pull more data in
    // the advisory size argument is ignored in this case.
    _read(size) {
        console.log("+")
        this._source && this._source.resume();
    }
}

export default CustomFileReader;