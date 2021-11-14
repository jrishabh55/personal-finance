import { doc, DocumentSnapshot, getDoc, getFirestore } from 'firebase/firestore';
import { OverallKPIData } from 'types/global';

const getAggregatedKpis = ({
  uid,
  accountId
}: {
  uid?: string;
  accountId?: string;
}): Promise<DocumentSnapshot<OverallKPIData>> => {
  if (!uid || !accountId) {
    return Promise.reject('Account id or uid is not provided');
  }

  const fireStore = getFirestore();
  const ref = doc(fireStore, `users/${uid}/accounts/${accountId}/aggregated-data/overall`);
  const aggregatedData = getDoc(ref);

  return aggregatedData as any;
};

export default getAggregatedKpis;
