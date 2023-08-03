import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";
import { error } from "console";

const storage = new Storage();

const rawVideoBucketName = "ak-yt-raw-videos";
const processedVideoBucketName = "ak-yt-processed-videos";

const localRawVideoDir = "./raw-videos";
const localProcessedVideoDir = "./processed-videos";

/**
 * Ensures if directory exists, create if doesn't
 * @param dirPath - The directory path to check
 */
export function ensureDirectoryExistence(dirPath:string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true});
        console.log("Created directory at " + dirPath);
    }
}

/**
 * Create the local directories for raw and processed videos
 */

export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoDir);
    ensureDirectoryExistence(localProcessedVideoDir);
}

/**
 * Method to convert video @360p
 * @param rawVideoPath : name of the raw video
 * @param convertedVideoPath : name of the converted video
 * @returns A Promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoPath:string, convertedVideoPath:string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoDir}/${rawVideoPath}`)
        .outputOptions('-vf', 'scale-=1:360')
        .on("end", function() {
            console.log("Video Processed Sucessfully");
            resolve();
        })
        .on("error", function(err : any) {
            console.log("Error occurred " + err.message);
            reject(err);
        })
        .save(`${localProcessedVideoDir}/${convertedVideoPath}`);
    });
}


/**
 * Download raw video from GC to local FS 
 * @param videoName is the name of the video to download
 * @returns a Promise that resolves when the video has been downloaded
 */
export async function downloadRawVideo(videoName:string) {
    await storage.bucket(rawVideoBucketName)
    .file(videoName)
    .download(
        {destination : `${localRawVideoDir}/${videoName}`}
    );
    console.log(`google storage: gs://${rawVideoBucketName}/${videoName} downloaded to ${localRawVideoDir}/${videoName}`);
}


/**
 * Upload converted low quality image to GC from local FS
 * @param videoName is the name of the video to upload
 * @returns a Promise that resolves when the video has been uploaded
 */
export async function uploadProcessedVideo(videoName:string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await storage.bucket(processedVideoBucketName)
    .upload(
        `${localProcessedVideoDir}/${videoName}`, 
        {destination : videoName}
    )
    console.log(`Video uploaded from local 
    ${localProcessedVideoDir}/${videoName} to Google cloud gs://${processedVideoBucketName}/${videoName}`);

    await bucket.file(videoName).makePublic();
}

/**
 * Method to delete file at a given file path
 * @param filePath is the name of the file
 * @returns a Promise which resolves when file is deleted successfully or doesn't exist
 */
export function deleteFile(filePath : string) {
    return new Promise<void>((resolve, reject) => {
       if (fs.existsSync(filePath)) {
         fs.unlink(filePath, (err)=> {
            if (err) {
                console.log(`Failed to delete file at  ${filePath}`, err);
                reject(err);
            } else {
                console.log(`Successfully deleted file at ${filePath}`);
                resolve();
            }
         });
       } else {
          console.log(`File not found at ${filePath}`);
          resolve();
       }
    }
    );
}

/**
 * @param videoName is name of the video to delete locally 
 * {@link localRawVideoPath} folder.
 * @returns a Promise that resolves when the file has been deleted
 */
export function deleteRawVideo(videoName : string) {
  return deleteFile(`${localRawVideoDir}/${videoName}`)
}


/**
 * @param videoName is name of the video to delete locally 
 * {@link localRawVideoPath} folder.
 * @returns a Promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(videoName : string) {
    return deleteFile(`${localProcessedVideoDir}/${videoName}`)
  }