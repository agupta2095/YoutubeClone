import {getFunctions, httpsCallable} from "firebase/functions";

const functions = getFunctions();

const generateUploadUrl = httpsCallable(functions, 'generateSignedUrl');

export async function uploadVideo(file: File) {
    //Figure out the extention 
    const response: any = await generateUploadUrl({
        fileExtention:file.name.split('.').pop()
    })

    //upload the file via the signed URL
    const uploadResult  = await fetch(response?.data?.url, {
       method: 'PUT', 
       body: file,
       headers: {
        'Content-Type' : file.type
       },
    });
    return uploadResult;
}