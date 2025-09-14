// URL du script Apps Script qui renvoie les commandes
const API_URL = "https://script.google.com/macros/s/AKfycbwQl7CNfZXh33P_n2Gk3-d-tjlQk0gXirHTyYjeov0WiqzzVOn-pWvXftX7zwbilqGC/exec";

// Charger les commandes depuis Google Sheets
async function fetchOrders() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    displayOrders(data);
  } catch (error) {
    console.error("Erreur chargement commandes :", error);
  }
}

// Afficher les commandes sous forme de cartes
function displayOrders(data) {
  const container = document.getElementById("ordersList");
  container.innerHTML = "";

  data.forEach((row, index) => {
    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <p class="order-title">N° ${index + 1} - ${row.Nom || "Client inconnu"}</p>
      <p class="order-total">${Number(row.Total || 0).toLocaleString()} FCFA</p>
    `;

    // Quand on clique, on ouvre la page détails
    card.addEventListener("click", () => {
      window.location.href = `details.html?id=${index}`;
    });

    container.appendChild(card);
  });
}

// Charger les commandes au démarrage
fetchOrders();
