// Penghitung pengunjung (Firebase Realtime Database).
// Satu perangkat dihitung sekali; angka dipakai bersama oleh semua halaman.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTP84envLIOFEkaEmjiuaguXQf3H8xp6k",
  authDomain: "myweb-923bc.firebaseapp.com",
  databaseURL: "https://myweb-923bc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myweb-923bc",
  storageBucket: "myweb-923bc.firebasestorage.app",
  messagingSenderId: "961360177015",
  appId: "1:961360177015:web:dcf20d50252175ea022372"
};

const el = document.getElementById("visitorCount");

try {
  const db = getDatabase(initializeApp(firebaseConfig));
  const visitorRef = ref(db, "visitorCount");

  let visited = false;
  try { visited = localStorage.getItem("telahBerkunjung") === "true"; } catch (e) {}

  if (!visited) {
    runTransaction(visitorRef, (n) => (n || 0) + 1);
    try { localStorage.setItem("telahBerkunjung", "true"); } catch (e) {}
  }

  onValue(visitorRef, (snap) => {
    if (el) el.textContent = (snap.val() || 0).toLocaleString("id-ID");
  });
} catch (e) {
  // Kalau Firebase gagal dimuat, sembunyikan kalimat penghitung daripada menampilkan "Memuat..."
  const line = el && el.closest("p");
  if (line) line.hidden = true;
}
