import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {
  AggregatedData,
  AggregatedDataArgs,
  StatementUpload,
  SumTypesWithCount,
} from './types';

const log = functions.logger;

export const updateAggregatedData = async ({
  uid,
  accountId,
  aggregatedData,
}: AggregatedDataArgs): Promise<void> => {
  const { aggregatedSum, monthlySum, yearlySum } = aggregatedData;
  const db = admin.firestore();

  const proms = [];
  const collectionRef = db
    .collection('users')
    .doc(uid)
    .collection('accounts')
    .doc(accountId)
    .collection('aggregated-data');

  const prom = collectionRef
    .doc('overall')
    .get()
    .then((doc) => {
      const data = doc.data() || { totalDeposit: 0, totalWithdrawal: 0 };
      return doc.ref.set({
        type: 'overall',
        totalDeposit: data.totalDeposit + aggregatedSum.deposit,
        totalWithdrawal: data.totalWithdrawal + aggregatedSum.withdrawal,
      });
    });

  proms.push(prom);

  Object.entries(monthlySum).forEach(([monthYear, item]) => {
    log.info('Setting monthly data for ', monthYear);
    const monthlyRef = collectionRef
      .where('type', '==', 'month')
      .where('month', '==', item.month)
      .where('year', '==', item.year)
      .get();

    const prom = monthlyRef.then((querySnapshot) => {
      if (querySnapshot.empty) {
        return collectionRef.doc(monthYear).set({
          month: item.month,
          year: item.year,
          type: 'month',
          totalDeposit: item.deposit,
          totalWithdrawal: item.withdrawal,
        });
      } else {
        const data = querySnapshot.docs[0].data() || {
          totalDeposit: 0,
          totalWithdrawal: 0,
        };
        return querySnapshot.docs[0].ref.update({
          totalDeposit: data.totalDeposit + item.deposit,
          totalWithdrawal: data.totalWithdrawal + item.withdrawal,
        });
      }
    });

    proms.push(prom);
  });

  Object.entries(yearlySum).forEach(([year, item]) => {
    const yearlyRef = collectionRef
      .where('type', '==', 'year')
      .where('year', '==', item.year)
      .get();

    const prom = yearlyRef.then((querySnapshot) => {
      log.info('Setting yearly data for ', year);
      if (querySnapshot.empty) {
        return collectionRef.doc(year).set({
          year: item.year,
          type: 'year',
          totalDeposit: item.deposit,
          totalWithdrawal: item.withdrawal,
        });
      } else {
        const data = querySnapshot.docs[0].data() || {
          totalDeposit: 0,
          totalWithdrawal: 0,
        };
        return querySnapshot.docs[0].ref.update({
          totalDeposit: data.totalDeposit + item.deposit,
          totalWithdrawal: data.totalWithdrawal + item.withdrawal,
        });
      }
    });
    proms.push(prom);
  });

  return Promise.all(proms).then(() => {
    log.info(`Updated aggregated data for ${uid}`);
  });
};

const prepareAggregatedData = (): AggregatedData => {
  const aggregatedSum: SumTypesWithCount = {
    count: 0,
    type: 'overall',
    deposit: 0,
    withdrawal: 0,
  };

  const monthlySum: Record<string, SumTypesWithCount> = {};
  const yearlySum: Record<string, SumTypesWithCount> = {};

  const updateSetup = (statement: StatementUpload) => {
    const { date } = statement;
    if (!date.isValid()) {
      log.warn(`Invalid date ${statement.date.toString()}`);
    }
    aggregatedSum.deposit += statement.deposit ? statement.amount : 0;
    aggregatedSum.withdrawal += !statement.deposit ? statement.amount : 0;

    const monthYearRef = `monthly-${date.format('MM-YYYY')}`;
    const yearRef = `year-${statement.date.year()}`;

    if (monthlySum[monthYearRef]) {
      const item = monthlySum[monthYearRef];
      item.deposit += statement.deposit ? statement.amount : 0;
      item.withdrawal += !statement.deposit ? statement.amount : 0;
      item.count += 1;
    } else {
      monthlySum[monthYearRef] = {
        count: 1,
        type: 'month',
        deposit: statement.deposit ? statement.amount : 0,
        withdrawal: !statement.deposit ? statement.amount : 0,
        year: date.year(),
        month: date.month() + 1,
      };
    }
    if (yearlySum[yearRef]) {
      const item = yearlySum[yearRef];
      item.deposit += statement.deposit ? statement.amount : 0;
      item.withdrawal += !statement.deposit ? statement.amount : 0;
      item.count += 1;
    } else {
      yearlySum[yearRef] = {
        count: 1,
        type: 'year',
        deposit: statement.deposit ? statement.amount : 0,
        withdrawal: !statement.deposit ? statement.amount : 0,
        year: date.year(),
        month: date.month() + 1,
      };
    }
  };

  return {
    updateSetup,
    aggregatedSum,
    monthlySum,
    yearlySum,
  };
};

export default prepareAggregatedData;
