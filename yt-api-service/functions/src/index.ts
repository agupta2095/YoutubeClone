/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Dummy hello world functions.
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Create user function that is going to invoked whenever a new user is added

import * as functions from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {Firestore} from "firebase-admin/firestore";


initializeApp();
const firestore = new Firestore();

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };
  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User created ${JSON.stringify(userInfo)}`);
  return;
});

import {onCall} from "firebase-functions/v2/https";

// Imports the Google Cloud client library
import {Storage} from "@google-cloud/storage";

// Creates a client
const storage = new Storage();
const rawVideoBucketName = "ak-yt-raw-videos";

export const generateSignedUrl = onCall({maxInstances: 1}, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }
  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawVideoBucketName);
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtention}`;
  const [url]= await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15*60*1000, // 15 minutes
  });

  console.log("Generated PUT signed URL:");
  console.log(url);
  return {url, fileName};
});
