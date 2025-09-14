const API_URL = "https://script.google.com/macros/s/AKfycbwQl7CNfZXh33P_n2Gk3-d-tjlQk0gXirHTyYjeov0WiqzzVOn-pWvXftX7zwbilqGC/exec"; // URL de ton script Google Apps
let salesChart;

// Charger les données
async function fetchData(startDate, endDate) {
  try {
    let url = ${API_URL}?action=stats;
    if (startDate && endDate) {
      url += &start=${startDate}&end=${endDate};
    }

    const response = await fetch(url);
    const data = await response.json();

    // ✅ Mettre à jour les compteurs
    document.getElementById("totalOrders").textContent = data.totalOrders || 0;
    document.getElementById("totalSales").textContent = (data.totalSales || 0).toLocaleString() + " FCFA";

    // ✅ Graphe
    updateChart(data.dates, data.sales);
  } catch (error) {
    console.error("Erreur fetchData:", error);
  }
}

// Appliquer le filtre de dates
function applyFilter() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  fetchData(start, end);
}

// Mettre à jour le graphe
function updateChart(labels, values) {
  const ctx = document.getElementById("salesChart").getContext("2d");

  if (salesChart) {
    salesChart.destroy();
  }

  salesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Évolution des ventes (FCFA)",
        data: values,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.2)",
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Charger au démarrage
fetchData();
