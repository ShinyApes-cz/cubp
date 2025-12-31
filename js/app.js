// NEWS
const newsBox = document.getElementById("news");
if(newsBox){
  const raw = localStorage.getItem("news") || "Vítejte na oficiálním webu CUBP.\nSledujte novinky z profesionálního boxu.";
  const items = raw.split("\n");

  newsBox.innerHTML = items.map(n=>`
    <div class="news-card">
      <h4>${n}</h4>
      <p>Oficiální zpráva CUBP</p>
    </div>
  `).join("");
}

// CONTACT
function sendMsg(e){
  e.preventDefault();
  document.getElementById("msg").innerText="Zpráva byla odeslána ✔";
}

// HAMBURGER
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

if(burger){
  burger.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}

// Close mobile menu when clicking outside
document.addEventListener("click", function(e){
  const menu = document.getElementById("menu");
  const burger = document.getElementById("burger");

  if(!menu || !burger) return;

  if(
    menu.classList.contains("open") &&
    !menu.contains(e.target) &&
    !burger.contains(e.target)
  ){
    menu.classList.remove("open");
  }
});