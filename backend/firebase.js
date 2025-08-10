// firebase.js
import admin from 'firebase-admin';
import fs from 'fs';

const serviceAccount = JSON.parse(
  fs.readFileSync('./firebaseServiceAccount.json', 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'we-code-a0c49.appspot.com', // ✅ your actual bucket
});

const bucket = admin.storage().bucket();

export { bucket };
