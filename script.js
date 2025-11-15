// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB3mqBFNep6ZIHhNMrUKVV14L5j9oMgAfs",
  authDomain: "abhi-events-db7e8.firebaseapp.com",
  projectId: "abhi-events-db7e8",
  storageBucket: "abhi-events-db7e8.firebasestorage.app",
  messagingSenderId: "674616910948",
  appId: "1:674616910948:web:77345352a19f9037736b71",
  measurementId: "G-XX4H973WC8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Review Form Handling
const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const reviewText = document.getElementById('reviewText').value;
  const rating = parseInt(document.getElementById('rating').value);
  const photoFile = document.getElementById('photo').files[0];

  let photoUrl = "";

  if (photoFile) {
    const storageRef = storage.ref('reviews/' + Date.now() + '_' + photoFile.name);
    const snapshot = await storageRef.put(photoFile);
    photoUrl = await snapshot.ref.getDownloadURL();
  }

  await db.collection("reviews").add({
    name,
    reviewText,
    rating,
    photoUrl,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  reviewForm.reset();
  loadReviews();
});

// Load reviews
async function loadReviews() {
  reviewsList.innerHTML = "";
  const snapshot = await db.collection("reviews").orderBy("timestamp", "desc").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    div.className = "review-card";
    div.innerHTML = `
      <h4>${data.name}</h4>
      <p>${"★".repeat(data.rating)}${"☆".repeat(5 - data.rating)}</p>
      <p>${data.reviewText}</p>
      ${data.photoUrl ? `<img src="${data.photoUrl}" alt="Review photo" style="max-width:200px;" />` : ""}
    `;
    reviewsList.appendChild(div);
  });
}

// Initial load
loadReviews();
