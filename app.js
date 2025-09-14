// URL de ton script Apps Script déployé
const API_URL = "https://script.google.com/macros/s/AKfycbwQl7CNfZXh33P_n2Gk3-d-tjlQk0gXirHTyYjeov0WiqzzVOn-pWvXftX7zwbilqGC/exec";

// Données brutes
let allData = [];

// Initialiser le graphe
const ctx = document.getElementById('salesChart').getContext('2d');
let salesChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Ventes (FCFA)',
      data: [],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.2)',
      fill: true,
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Charger les données depuis Google Sheets
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    allData = await response.json();
    applyFilter('30days'); // filtre par défaut
  } catch (error) {
    console.error("Erreur chargement données :", error);
  }
}

// Appliquer un filtre de période
function applyFilter(type) {
  let filtered = [];
  const today = new Date();

  if (type === 'today') {
    filtered = allData.filter(row => formatDate(row.Date) === formatDate(today));
  }
  else if (type === '3days') {
    const past = new Date();
    past.setDate(today.getDate() - 2);
    filtered = allData.filter(row => new Date(row.Date) >= past);
  }
  else if (type === '7days') {
    const past = new Date();
    past.setDate(today.getDate() - 6);
    filtered = allData.filter(row => new Date(row.Date) >= past);
  }
  else if (type === '30days') {
    const past = new Date();
    past.setDate(today.getDate() - 29);
    filtered = allData.filter(row => new Date(row.Date) >= past);
  }
  else if (type === 'custom') {
    const start = new Date(document.getElementById('startDate').value);
    const end = new Date(document.getElementById('endDate').value);
    filtered = allData.filter(row => {
      const d = new Date(row.Date);
      return d >= start && d <= end;
    });
  }

  updateDashboard(filtered);
}

// Mettre à jour le tableau de bord
function updateDashboard(data) {
  const totalCommandes = data.length;
  const totalVentes = data.reduce((sum, row) => sum + Number(row.Total || 0), 0);

  document.getElementById('totalCommandes').textContent = totalCommandes;
  document.getElementById('totalVentes').textContent = totalVentes.toLocaleString() + " FCFA";

  // Grouper par date
  const grouped = {};
  data.forEach(row => {
    const d = formatDate(row.Date);
    grouped[d] = (grouped[d] || 0) + Number(row.Total || 0);
  });

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  salesChart.data.labels = labels;
  salesChart.data.datasets[0].data = values;
  salesChart.update();
}

// Utilitaire pour formater la date
function formatDate(d) {
  const date = new Date(d);
  return date.toISOString().split('T')[0]; // yyyy-mm-dd
}

// Charger les données au démarrage
fetchData();