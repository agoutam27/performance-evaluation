import fs from 'fs';
import { Readable } from 'stream';

export function createDataFiles(dir, number, startYear, endYear) {

    let rstream;
    let wstream;

    for(let i = 0; i < number; i++) {
        let fileName = dir + "Loc_" + i + ".csv";
        let startDate = new Date(startYear, 0, 1);
        let endDate = new Date(endYear, 11, 31);

        rstream = new Readable({objectMode: true});
        wstream = fs.createWriteStream(fileName);
        rstream.pipe(wstream);

        while(startDate <= endDate) {
            let mm = ((startDate.getMonth()+1)>=10)?(startDate.getMonth()+1):'0'+(startDate.getMonth()+1);
            let dd = ((startDate.getDate())>=10)? (startDate.getDate()) : '0' + (startDate.getDate());
            let yyyy = startDate.getFullYear();
            let date = dd + "/" + mm + "/" + yyyy; //yyyy-mm-dd
            let data = getRandom(10, 100);
            let line = date + ',' + data + '\n';
            rstream.push(line);
            startDate = new Date(startDate.setDate(startDate.getDate() + 1));
        }
        rstream.unpipe();
        rstream.destroy();
        wstream.destroy();
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}