import admin from "firebase-admin";
import * as functions from "firebase-functions";
import clunk from "lodash/chunk";
import parseHdfcFile from "./utils/parseHdfcFile";
import { StatementUpload } from "./utils/types";

admin.initializeApp();

const log = functions.logger;

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
export const parseFiles = functions.firestore
  .document("/files/{fileId}")
  .onCreate(async (snapshot) => {
    const { path, uid } = snapshot.data();
    console.log("Parsing file", path);
    const gcsStream = admin.storage().bucket().file(path).createReadStream();
    console.log("creating stream", path);

    const allBuffer: Promise<StatementUpload[]> = new Promise((resolve) => {
      const buffers: any = [];
      gcsStream.on("data", function (data: any) {
        buffers.push(data);
      });

      gcsStream.on("end", function () {
        console.log("onEnd", path);
        const buffer = Buffer.concat(buffers);
        const workbook = parseHdfcFile(buffer);
        resolve(workbook);
      });
    });

    // ALL ONREQUEST FUNCTIONS HAVE TO RETURN SOMETHING.
    allBuffer
      .then(async (result) => {
        const db = admin.firestore();
        log.info(`Got data of length ${result.length}`);
        const chunks = clunk(result, 499);
        log.info(`Created ${chunks.length} chunks`);
        const batches = chunks.map((chunk) => {
          const batch = db.batch();
          chunk.forEach((statement: StatementUpload) => {
            batch.set(db.collection("/statements").doc(), {
              ...statement,
              uid,
              accountId: 1,
            });
          });
          return batch;
        });

        for (const [index, commit] of batches.entries()) {
          try {
            await commit.commit();
            log.info(`Committed batch ${index}`);
          } catch (e) {
            log.error(`Error committing batch ${index}`);
          }
        }
      })
      .catch(function (error) {
        log.info("finished with error");
        log.error(error);
      })
      .finally(() => {
        log.info("finished");
        snapshot.ref.update({ ...snapshot.data(), parsed: true });
      });
  });
