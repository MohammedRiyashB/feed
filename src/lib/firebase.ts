import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, setDoc, updateDoc, increment, query, orderBy, limit, onSnapshot, serverTimestamp, where, getDocs, Timestamp, type QueryConstraint } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Object.values(config).every(Boolean);

const app = firebaseEnabled ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export type FeedUser = {
  uid: string;
  handle: string;
  name: string;
  avatar?: string;
  createdAt?: unknown;
};

export type FeedPost = {
  id: string;
  uid: string;
  name: string;
  handle: string;
  text: string;
  createdAt: unknown;
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  liked?: boolean;
  reposted?: boolean;
  bookmarked?: boolean;
};

export type FeedMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: unknown;
};

export async function ensureAuth() {
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
}

export function watchAuth(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function ensureUserProfile(user: User) {
  if (!db) return;
  const ref = doc(db, "users", user.uid);
  await setDoc(ref, {
    uid: user.uid,
    handle: user.displayName ? user.displayName.toLowerCase().replace(/[^a-z0-9_]/g, "") : `user_${user.uid.slice(0, 8)}`,
    name: user.displayName || "Feed user",
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function publishPost(user: User, text: string) {
  if (!db) throw new Error("Firebase is not configured");
  const profile = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid), limit(1)));
  const data = profile.docs[0]?.data();
  const handle = data?.handle || `user_${user.uid.slice(0, 8)}`;
  const name = data?.name || "Feed user";
  return addDoc(collection(db, "posts"), {
    uid: user.uid,
    name,
    handle: `@${handle}`,
    text,
    likes: 0,
    reposts: 0,
    replies: 0,
    views: 0,
    createdAt: serverTimestamp(),
  });
}

export function watchPosts(callback: (posts: FeedPost[]) => void, count = 50) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(count));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FeedPost, "id">) })));
  });
}

export async function reactToPost(postId: string, field: "likes" | "reposts", delta: 1 | -1) {
  if (!db) throw new Error("Firebase is not configured");
  await updateDoc(doc(db, "posts", postId), { [field]: increment(delta) });
}

export function watchUsers(callback: (users: FeedUser[]) => void, count = 50) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, "users"), orderBy("name", "asc"), limit(count));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<FeedUser, "uid">) })));
  });
}

export function conversationIdFor(a: string, b: string) {
  return [a, b].sort().join("__");
}

export async function sendMessage(user: User, conversationId: string, text: string) {
  if (!db) throw new Error("Firebase is not configured");
  return addDoc(collection(db, "conversations", conversationId, "messages"), {
    senderId: user.uid,
    text,
    createdAt: serverTimestamp(),
  });
}

export function watchMessages(conversationId: string, callback: (messages: FeedMessage[]) => void) {
  if (!db) {
    callback([]);
    return () => {};
  }
  const q = query(collection(db, "conversations", conversationId, "messages"), orderBy("createdAt", "asc"), limit(100));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, conversationId, ...(d.data() as Omit<FeedMessage, "id" | "conversationId">) })));
  });
}

export async function touchConversation(conversationId: string, members: string[]) {
  if (!db) throw new Error("Firebase is not configured");
  await setDoc(doc(db, "conversations", conversationId), {
    members,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
