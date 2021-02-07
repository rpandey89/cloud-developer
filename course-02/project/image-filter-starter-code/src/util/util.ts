import { reject, resolve } from 'bluebird';
import fs from 'fs';
import Jimp from 'jimp';

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
class FileStatus {
    status: number;
    filePath: string;

    constructor(status: number, filePath: string) {
      this.status = status;
      this.filePath = filePath;
    }
}

export async function filterImageFromURL(inputURL: string): Promise<FileStatus>{
    return new Promise( async resolve => {
        let photo;
        try {
            photo = await Jimp.read(inputURL);
        } catch (err) {
            console.log(err);
            resolve(new FileStatus(404, ""))
        }
        try {
            const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
            await photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale() // set greyscale
            .write(__dirname+outpath, (img)=>{
                resolve(new FileStatus(200, __dirname+outpath));
            });
        } catch(err) {
            console.log(err);
            resolve(new FileStatus(500, ""));
        }
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}