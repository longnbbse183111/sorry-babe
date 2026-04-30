const message = "Anh biết anh đã làm em buồn... và anh thật sự xin lỗi 💔";
const typingTarget = document.getElementById("typing-text");
const reactionBox = document.getElementById("reaction-box");
const btnAngry = document.getElementById("btn-angry");
const btnOk = document.getElementById("btn-ok");
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let typingIndex = 0;

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
  reactionBox.className = "reaction-box show begging";
  reactionBox.innerHTML = `
    <p><span class="begging-emoji">🥺</span> Ỏ cảm ơn em nha</p>
  `;
}

function showCelebrate() {
  reactionBox.className = "reaction-box show celebrate";
  reactionBox.innerHTML = "<p>Yêu em nhiều lắm ❤️ Cảm ơn em đã tha lỗi cho anh.</p>";
  confettiBurst();

  const bursts = isMobile ? 14 : 24;
  for (let i = 0; i < bursts; i += 1) {
    setTimeout(() => spawnHeart(true), i * 80);
  }
}

btnAngry.addEventListener("click", showBegging);
btnOk.addEventListener("click", showCelebrate);

if (!prefersReducedMotion) {
  const heartInterval = isMobile ? 1600 : 1100;
  setInterval(() => {
    if (!document.hidden) {
      spawnHeart(false);
    }
  }, heartInterval);
}
typeMessage();
