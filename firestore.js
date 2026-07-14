import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

const FIRESTORE_STATE_PATH = ["apps", "controleEmpresasTaxi"];

export async function saveCloudState(state) {
  await setDoc(doc(db, ...FIRESTORE_STATE_PATH), state, { merge: true });
}

export async function loadCloudState() {
  const snapshot = await getDoc(doc(db, ...FIRESTORE_STATE_PATH));
  return snapshot.exists() ? snapshot.data() : null;
}

export function listenCloudState(callback) {
  return onSnapshot(doc(db, ...FIRESTORE_STATE_PATH), (snapshot) => {
    if (snapshot.exists()) callback(snapshot.data());
  });
}
