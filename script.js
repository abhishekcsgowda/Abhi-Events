// Firebase Config (replace with your values)
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
const storage = firebase.storage();

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
      ${data.photoUrl ? `<img src="${data.photoUrl}" alt="Review photo" />` : ""}
    `;
    reviewsList.appendChild(div);
  });
}

loadReviews();
