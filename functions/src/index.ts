import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import clunk from 'lodash/chunk';
import prepareAggregatedData, {
  updateAggregatedData,
} from './utils/aggregatedData';
import getFileFromStorage from './utils/getFileFromStorage';
import parseHdfcFile from './utils/parseHdfcFile';
import { StatementUpload } from './utils/types';

admin.initializeApp();

const log = functions.logger;

export const parseFiles = functions.firestore
  .document('/files/{fileId}')
  .onCreate(async (snapshot) => {
    const { path, uid, accountId } = snapshot.data();
    const aggregatedData = prepareAggregatedData();
    const { updateSetup } = aggregatedData;

    const allBuffer: Promise<StatementUpload[]> = getFileFromStorage(path).then(
      (buffer) => {
        return parseHdfcFile(buffer);
      },
    );

    return allBuffer
      .then(async (result) => {
        const db = admin.firestore();
        log.info(`Got data of length ${result.length}`);
        const chunks = clunk(result, 499);
        log.info(`Created ${chunks.length} chunks`);
        const batches = chunks.map((chunk) => {
          const batch = db.batch();
          chunk.forEach((statement: StatementUpload) => {
            updateSetup(statement);
            batch.set(
              db
                .collection(`/users/${uid}/accounts/${accountId}/statements`)
                .doc(),
              {
                ...statement,
                date: statement.date.toString(),
                uid,
                accountId: accountId,
              },
            );
          });
          return batch;
        });

        for (const [index, commit] of batches.entries()) {
          try {
            await commit.commit();
            log.info(`Committed batch ${index}`);
          } catch (e) {
            log.error(`Error committing batch ${index}`);
            log.error(e);
          }
        }

        return updateAggregatedData({ uid, accountId, aggregatedData });
      })
      .catch(function (error) {
        log.error('finished with error');
        log.error(error);
      })
      .finally(() => {
        log.info('finished');
        admin.storage().bucket().file(path).delete();
        snapshot.ref.update({ ...snapshot.data(), parsed: true });
      });
  });
