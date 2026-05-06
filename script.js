const message = "Anh biết anh đã làm em buồn... và anh thật sự xin lỗi 💔";
const typingTarget = document.getElementById("typing-text");
const reactionBox = document.getElementById("reaction-box");
const btnAngry = document.getElementById("btn-angry");
const btnOk = document.getElementById("btn-ok");
const mistakeInput = document.getElementById("mistakeInput");
const mistakeMood = document.getElementById("mistakeMood");
const mistakeSubmitBtn = document.getElementById("mistakeSubmitBtn");
const mistakeList = document.getElementById("mistakeList");
const mistakeFeedback = document.getElementById("mistakeFeedback");
const bgMusic = document.getElementById("bg-music");
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let typingIndex = 0;
let db = null;
let firestoreApi = null;
let musicStarted = false;

const firebaseConfig = {
  apiKey: "AIzaSyDwLtPs3Op3c5nqwbXdwz9jnWfiTnqWVKI",
  authDomain: "sorry-babe-bbc44.firebaseapp.com",
  projectId: "sorry-babe-bbc44",
  storageBucket: "sorry-babe-bbc44.firebasestorage.app",
  messagingSenderId: "828447323867",
  appId: "1:828447323867:web:303e3985a6a7ae32b43efe"
};

function playMusic() {
  if (musicStarted) return;
  if (!bgMusic) return;

  bgMusic.volume = 0.75;
  bgMusic.play()
    .then(() => {
      musicStarted = true;
    })
    .catch((error) => {
      console.log("Khong the phat nhac luc nay.", error);
    });
}

function stopMusic() {
  if (!bgMusic) return;
  bgMusic.pause();
  bgMusic.currentTime = 0;
  musicStarted = false;
}

function triggerMusicFromInteraction() {
  if (musicStarted) return;
  playMusic();
}

function setupMusic() {
  if (mistakeSubmitBtn) {
    mistakeSubmitBtn.addEventListener("click", triggerMusicFromInteraction, { once: true });
  }
}

function startMusic() {
  if (musicStarted) return;
  playMusic();
}

function typeMessage() {
  if (typingIndex <= message.length) {
    typingTarget.textContent = message.slice(0, typingIndex);
    typingIndex += 1;
    setTimeout(typeMessage, 50);
  }
}

function spawnHeart(intense = false) {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.35 ? "❤" : "💖";
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.animationDuration = `${intense ? 3 + Math.random() * 2 : 6 + Math.random() * 3}s`;
  heart.style.fontSize = `${16 + Math.random() * 14}px`;
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 9000);
}

function confettiBurst() {
  const colors = ["#ff9ec4", "#d6c2ff", "#ffd88f", "#ffffff", "#ffb5de"];
  const pieces = isMobile ? 40 : 70;
  for (let i = 0; i < pieces; i += 1) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.style.left = `${Math.random() * 100}vw`;
    bit.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    bit.style.animationDuration = `${1.2 + Math.random() * 1.6}s`;
    bit.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 3000);
  }
}

function showBegging() {
  startMusic();
  reactionBox.className = "reaction-box show begging";
  reactionBox.innerHTML = `
    <p><span class="begging-emoji">🥺</span> Ỏ cảm ơn em nha</p>
  `;
}

function showCelebrate() {
  startMusic();
  reactionBox.className = "reaction-box show celebrate";
  reactionBox.innerHTML = "<p>Yêu em nhiều lắm ❤️ Cảm ơn em đã tha lỗi cho anh.</p>";
  confettiBurst();

  const bursts = isMobile ? 14 : 24;
  for (let i = 0; i < bursts; i += 1) {
    setTimeout(() => spawnHeart(true), i * 80);
  }
}

async function sendMistake() {
  startMusic();
  if (!mistakeInput || !firestoreApi || !db) return;
  const text = mistakeInput.value.trim();
  if (!text) return;

  const mood = mistakeMood ? mistakeMood.value : "";
  const payload = {
    text,
    createdAt: firestoreApi.serverTimestamp()
  };
  if (mood) payload.mood = mood;

  await firestoreApi.addDoc(firestoreApi.collection(db, "mistakes"), payload);
  mistakeInput.value = "";
  if (mistakeMood) mistakeMood.value = "";
  if (mistakeFeedback) {
    mistakeFeedback.textContent = "Anh biết lỗi của mình rồi, anh đã đọc và sẽ cố gắng hơn từng ngày... ❤️";
    setTimeout(() => {
      if (mistakeFeedback.textContent === "Anh biết lỗi rồi... ❤️") {
        mistakeFeedback.textContent = "";
      }
    }, 2200);
  }
}

async function initFirebaseFeatures() {
  try {
    const appModule = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js");
    const fsModule = await import("https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js");

    const app = appModule.initializeApp(firebaseConfig);
    db = fsModule.getFirestore(app);
    firestoreApi = fsModule;
  } catch (error) {
    if (mistakeFeedback) {
      mistakeFeedback.textContent = "Không kết nối được Firebase.";
    }
    console.error(error);
  }
}

btnAngry.addEventListener("click", showBegging);
btnOk.addEventListener("click", showCelebrate);
if (mistakeSubmitBtn) {
  mistakeSubmitBtn.addEventListener("click", sendMistake);
}
if (mistakeInput) {
  mistakeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendMistake();
    }
  });
}
if (mistakeList) {
  mistakeList.style.display = "none";
}

if (!prefersReducedMotion) {
  const heartInterval = isMobile ? 1600 : 1100;
  setInterval(() => {
    if (!document.hidden) {
      spawnHeart(false);
    }
  }, heartInterval);
}

typeMessage();
initFirebaseFeatures();
setupMusic();
