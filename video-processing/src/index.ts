import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
const app = express();
app.use(express.json());

app.post("/process-video", (req, resp) => {
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

    ffmpeg(inputVideoPath)
    .outputOptions('-vf', 'scale=-1:360') // 360p
    .on("end", () => {
        resp.status(200).send("Video processing finished successfully.");
    })
    .on("error", (err: any) => {
        console.log(`An error occured: ${err.message}`);
        resp.status(500).send(`Internal Server Error: ${err.message}`);
    })
    .save(outputVideoPath);

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(
        `Server running at http://localhost:${port}`);
});

