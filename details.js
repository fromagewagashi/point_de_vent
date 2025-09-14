const API_URL = "https://script.google.com/macros/s/AKfycbwQl7CNfZXh33P_n2Gk3-d-tjlQk0gXirHTyYjeov0WiqzzVOn-pWvXftX7zwbilqGC/exec";

// Récupérer l'index passé dans l’URL
const urlParams = new URLSearchParams(window.location.search);
const orderId = parseInt(urlParams.get("id"), 10);

// Charger toutes les commandes et afficher la commande choisie
async function fetchOrderDetails() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const order = data[orderId];

    if (!order) {
      document.getElementById("orderDetails").innerHTML = "<p>Commande introuvable</p>";
      return;
    }

    document.getElementById("orderDetails").innerHTML = `
      <div class="kpi-card">
        <h2>${order.Nom || "Client inconnu"}</h2>
        <p><strong>Date :</strong> ${order.Date || "Non précisée"}</p>
        <p><strong>Total :</strong> ${Number(order.Total || 0).toLocaleString()} FCFA</p>
        <p><strong>Produits :</strong> ${order.Produits || "Non précisé"}</p>
        <p><strong>Quantité :</strong> ${order.Quantite || "Non précisée"}</p>
        <p><strong>Mode de paiement :</strong> ${order.Paiement || "Non précisé"}</p>
      </div>
    `;
  } catch (error) {
    console.error("Erreur chargement détails :", error);
  }
}

fetchOrderDetails();