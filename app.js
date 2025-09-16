const API_URL = "https://script.google.com/macros/s/AKfycbzcHEVVN_GkXzm5XQ7d58Swkt1RR4BzsZCtxewqs-wQXegXhw0rR3ogGhAWOHx3MsW-/exec"; // 👉 remplace par ton lien Apps Script
let chart;

async function fetchData() {
  document.getElementById("loader").classList.remove("hidden");
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // Total ventes + commandes
    let totalOrders = data.length;
    let totalSales = data.reduce((sum, row) => sum + (parseFloat(row["Total"]) || 0), 0);

    document.getElementById("totalOrders").textContent = totalOrders;
    document.getElementById("totalSales").textContent = totalSales.toLocaleString() + " CFA";

    // Fake conversion
    document.getElementById("conversionRate").textContent = ((totalOrders / 100) * 100).toFixed(1) + "%";

    // Graphe par date
    let salesByDate = {};
    data.forEach(row => {
      let date = row["Date"];
      let total = parseFloat(row["Total"]) || 0;
      if (!salesByDate[date]) salesByDate[date] = 0;
      salesByDate[date] += total;
    });

    const labels = Object.keys(salesByDate);
    const values = Object.values(salesByDate);

    updateChart(labels, values);

    // Stats supplémentaires
    document.getElementById("pendingOrders").textContent = totalOrders;
    document.getElementById("pendingPayments").textContent = totalOrders;

  } catch (err) {
    console.error(err);
  } finally {
    document.getElementById("loader").classList.add("hidden");
  }
}

function updateChart(labels, values) {
  const ctx = document.getElementById("myChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Ventes',
        data: values,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value / 1000 + 'k CFA'
          }
        }
      }
    }
  });
}

function applyQuickFilter() {
  const filter = document.getElementById("quickFilter").value;
  console.log("Filtre rapide:", filter);
  // TODO: Appliquer filtre sur data
}

fetchData();









// =============== Commandes (liste) ===============
function renderOrdersList(data) {
  const container = document.getElementById("orders-list");
  container.innerHTML = "";

  data.forEach((row, index) => {
    if (index === 0) return; // ignorer l’en-tête

    const id = index;
    const nom = row[0];
    const date = row[1];
    const total = row[row.length - 1]; // dernière colonne = total

    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <div><strong>N°${id}</strong> - ${nom}</div>
      <div>${total} FCFA</div>
      <div class="order-date">${date}</div>
    `;

    // rendre la ligne cliquable
    card.onclick = () => {
      window.location.href = `details.html?id=${id}`;
    };

    container.appendChild(card);
  });
}

// =============== Détails (page détail) ===============
function renderOrderDetails(data, id) {
  const container = document.getElementById("order-details");
  const row = data[id];
  if (!row) {
    container.innerHTML = "<p>Commande introuvable.</p>";
    return;
  }

  let html = "<ul class='details-list'>";
  data[0].forEach((title, i) => {
    html += `<li><strong>${title}:</strong> ${row[i]}</li>`;
  });
  html += "</ul>";

  container.innerHTML = html;
}
