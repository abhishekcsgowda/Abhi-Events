// ===== NAVBAR MOBILE =====
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ===== ACCORDION =====
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
  });
});

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyB3mqBFNep6ZIHhNMrUKVV14L5j9oMgAfs",
  authDomain: "abhi-events-db7e8.firebaseapp.com",
  projectId: "abhi-events-db7e8",
  storageBucket: "abhi-events-db7e8.firebasestorage.app",
  messagingSenderId: "674616910948",
  appId: "1:674616910948:web:77345352a19f9037736b71",
  measurementId: "G-XX4H973WC8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== REVIEWS =====
const reviewForm = document.getElementById('review-form');
const reviewsDisplay = document.getElementById('reviews-display');

// Load existing reviews
db.collection("reviews").orderBy("timestamp","desc").onSnapshot(snapshot=>{
  reviewsDisplay.innerHTML="";
  snapshot.forEach(doc=>{
    const data = doc.data();
    const div = document.createElement('div');
    div.classList.add('review-item');
    div.innerHTML = `
      <h4>${data.name} - ⭐ ${data.rating}</h4>
      <p>${data.text}</p>
      ${data.image ? `<img src="${data.image}" alt="Review Image" style="max-width:150px;border-radius:10px;">` : ''}
      <hr>
    `;
    reviewsDisplay.appendChild(div);
  });
});

// Submit new review
reviewForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('review-name').value;
  const text = document.getElementById('review-text').value;
  const rating = document.getElementById('review-rating').value;
  const imageFile = document.getElementById('review-image').files[0];

  let imageUrl = "";
  if(imageFile){
    const storageRef = firebase.storage().ref();
    const imageRef = storageRef.child('reviews/'+imageFile.name);
    await imageRef.put(imageFile);
    imageUrl = await imageRef.getDownloadURL();
  }

  db.collection("reviews").add({
    name,
    text,
    rating,
    image: imageUrl,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  reviewForm.reset();
  alert("Thank you for your review!");
});

// ===== BOOKING =====
const bookingForm = document.getElementById('booking-form');
const bookingConfirmation = document.getElementById('booking-confirmation');

bookingForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const customerName = document.getElementById('customer-name').value;
  const customerEmail = document.getElementById('customer-email').value;
  const eventType = document.getElementById('event-type').value;
  const eventDate = document.getElementById('event-date').value;
  const message = document.getElementById('event-message').value;

  // Save to Firestore
  await db.collection("bookings").add({
    customerName,
    customerEmail,
    eventType,
    eventDate,
    message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  // Show confirmation
  bookingForm.style.display="none";
  bookingConfirmation.style.display="block";

  // WhatsApp notification
  const whatsappMsg = `New Booking:\nName: ${customerName}\nEmail: ${customerEmail}\nEvent: ${eventType}\nDate: ${eventDate}\nMessage: ${message}`;
  const whatsappLink = `https://wa.me/+919353737776?text=${encodeURIComponent(whatsappMsg)}`;
  window.open(whatsappLink, '_blank');
});
