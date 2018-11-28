import fs from 'fs';
// import byline from 'byline';
// import util from 'util';
// import MyFileFormatter from './MyFileFormatter';
// import child_process from 'child_process';
import CustomFileWriter from './CustomFileWriter';
import CustomFileReader from './CustomFileReader';
import SourceWrapper from './SourceWrapper';

// const readdir = util.promisify(fs.readdir);
// const formatter = new MyFileFormatter();
const outputDir = "/home/vassar/Documents/python/performance files/Output Files/";

export function start(dataFileDir) {
    console.log("Creating file reader obj");
    const fileReader = new CustomFileReader({}, dataFileDir);
    // console.log("Opening reader stream");
    // fileReader.createStream(dataFileDir);

    const fileWriter = new CustomFileWriter({}, outputDir);

    fileReader.pipe(fileWriter);

    // const wrapper = new SourceWrapper();

    // wrapper.pipe(process.stdout);
    // fs.createReadStream("/home/vassar/Documents/python/printStuff.py").pipe(process.stdout)
    // console.log(wrapper)
};

/*
    Reader threads will read lines from start offset k till n lines. 
    Where k = endOfDays for last years and n is 365 or 366.

    Every line contains a single day's data. Form a single output line from this, and pass
    it to writer thread.

    The Writer thread accpets year a single line to be written. It creates a file for the year
    if it doesn't exist already and writes it.
*/