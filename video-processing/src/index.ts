import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from './storage';

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video-local", (req, resp) => {
    // Get the path of the input video file from the body
    const inputVideoPath = req.body.inpFilePath;
    const outputVideoPath = req.body.outFilePath;

    // Error handling technique
    if (!inputVideoPath || !outputVideoPath) {
        console.log("Not input path");
        var errorMsg = "Missing : ";
        if (!inputVideoPath) {
            errorMsg += 'Input video path ';
        }
        if (!outputVideoPath) {
            errorMsg += 'Output video path ';
        }
        resp.status(400).send("Bad Request, missing file path. " + errorMsg);
    }

    const localRawVideoDir = "./raw-videos";
    const localProcessedVideoDir = "./processed-videos";

    ffmpeg(`${localRawVideoDir}/${inputVideoPath}`)
    .outputOptions('-vf', 'scale=-1:360') // 360p
    .on("end", () => {
        resp.status(200).send("Video processing finished successfully.");
    })
    .on("error", (err: any) => {
        console.log(`An error occured: ${err.message}`);
        resp.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(`${localProcessedVideoDir}/${outputVideoPath}`);

});


app.post('/process-video', async (req, resp) => {
    let data;
    // Process the function payload
    try {
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);
        if (!data.name) {
            throw new Error("Invalid post request payload");
        }
    } catch(err) {
        console.log(err);
        resp.status(400).send("Bad request: missing filename");
    }
    const inpFileName = data.name;
    const outFileName = `converted-${inpFileName}`;
    
    //Download the raw video from GC storage
    await downloadRawVideo(inpFileName);
    
    // Convert the video to 360p
    try {
        await convertVideo(inpFileName, outFileName);
    } catch (err) {
        await Promise.all(
            [
                //deleteRawVideo(inpFileName),
                //deleteProcessedVideo(outFileName)
            ]
        )
        console.log("Converting video failed, " + err);
        return resp.status(500).send("Converting video failed");
    }

    await uploadProcessedVideo(outFileName);

    await Promise.all(
        [
            deleteRawVideo(inpFileName),
            deleteProcessedVideo(outFileName)
        ]
    );

    return resp.status(200).send("Video conversion, uploading done successfully");

 }
)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `Server running at http://localhost:${port}`);
});

