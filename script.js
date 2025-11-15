// Firebase config (replace with your Firebase config)
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

// Handle Review Form Submission
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

  reviewForm.reset();  // clear form
  loadReviews();  // reload reviews
});

// Load Reviews
async function loadReviews() {
  reviewsList.innerHTML = "";
  const snapshot = await db.collection("reviews").orderBy("timestamp", "desc").limit(3).get();
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

// Show more reviews
document.getElementById('see-more-reviews').addEventListener('click', function() {
  loadReviews();
});

// Toggle Contact and Pricing
document.getElementById('toggle-contact').addEventListener('click', function() {
  const contactInfo = document.getElementById('contact-info');
  contactInfo.style.display = contactInfo.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('toggle-pricing').addEventListener('click', function() {
  const pricingInfo = document.getElementById('pricing-info');
  pricingInfo.style.display = pricingInfo.style.display === 'block' ? 'none' : 'block';
});

// Handle Booking Form Submission
const bookingForm = document.getElementById('booking-form');
const bookingConfirmation = document.getElementById('booking-confirmation');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const customerName = document.getElementById('customer-name').value;
  const customerEmail = document.getElementById('customer-email').value;
  const eventType = document.getElementById('event-type').value;
  const eventDate = document.getElementById('event-date').value;

  // Save booking to Firestore (optional)
  db.collection("bookings").add({
    customerName,
    customerEmail,
    eventType,
    eventDate,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Show booking confirmation
  bookingForm.style.display = 'none';
  bookingConfirmation.style.display = 'block';

  // Create WhatsApp message with booking details
  const message = `
    New Booking Request:
    Name: ${customerName}
    Email: ${customerEmail}
    Event Type: ${eventType}
    Event Date: ${eventDate}
  `;

  // Encode the message to pass in the WhatsApp URL
  const whatsappLink = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`;

  // Redirect the user to WhatsApp with pre-filled booking details
  window.open(whatsappLink, '_blank');
});
