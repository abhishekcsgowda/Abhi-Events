// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');

reviewForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const reviewText = document.getElementById('reviewText').value;
  const rating = parseInt(document.getElementById('rating').value);

  // Currently photo upload is skipped for simplicity (can add Firebase Storage later)
  await db.collection("reviews").add({
    name,
    reviewText,
    rating,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  reviewForm.reset();
  loadReviews();
});

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
    `;
    reviewsList.appendChild(div);
  });
}

loadReviews();
