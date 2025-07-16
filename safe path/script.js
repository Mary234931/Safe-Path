var map = L.map('map').setView([30.030, 31.280], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// بيانات الحوادث لكل محافظة
var accidentData = {
  cairo: [
    { lat: 30.050, lon: 31.290, info: "Minor crash on Cairo Ring Road", type: "minor", date: "2025-07-10" },
    { lat: 30.020, lon: 31.270, info: "Major crash - avoid this area", type: "major", date: "2025-07-12" }
  ],
  asyut: [
    { lat: 27.190, lon: 31.170, info: "Blocked road near Asyut Ring", type: "block", date: "2025-07-11" },
    { lat: 27.200, lon: 31.160, info: "Minor crash near El-Ghanayem Exit", type: "minor", date: "2025-07-13" }
  ]
};

// طرق آمنة لكل محافظة
var safeRoutes = {
  cairo: [
    {
      name: "Cairo Safe Route",
      path: [
        [30.015, 31.260],
        [30.025, 31.270],
        [30.035, 31.280]
      ]
    }
  ],
  asyut: [
    {
      name: "Asyut Safe Route",
      path: [
        [27.185, 31.160],
        [27.195, 31.165],
        [27.205, 31.170]
      ]
    }
  ]
};

var currentCity = "cairo";

// رسم الحوادث
function showAccidents(accidents) {
  accidents.forEach(function(accident) {
    L.marker([accident.lat, accident.lon], { title: accident.type })
      .addTo(map)
      .bindPopup(`${accident.info}<br>Date: ${accident.date}`);
  });
}

// رسم الطرق الآمنة
function showSafeRoutes(routes) {
  routes.forEach(function(route) {
    L.polyline(route.path, { color: 'green', weight: 4 })
      .addTo(map)
      .bindPopup(route.name);
  });
}

// تغيير المدينة
function changeCity() {
  currentCity = document.getElementById("city").value;
  updateMap();
}

// تصفية حسب النوع والتاريخ
function applyFilters() {
  updateMap();
}

// تحديث الخريطة بالكامل
function updateMap() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  // تحديث المركز حسب المدينة
  if (currentCity === "cairo") {
    map.setView([30.030, 31.280], 11);
  } else if (currentCity === "asyut") {
    map.setView([27.190, 31.170], 12);
  }

  var selectedType = document.getElementById("type").value;
  var selectedDate = document.getElementById("date").value;

  var filteredAccidents = accidentData[currentCity].filter(function(accident) {
    var matchType = selectedType === "all" || accident.type === selectedType;
    var matchDate = !selectedDate || accident.date === selectedDate;
    return matchType && matchDate;
  });

  showAccidents(filteredAccidents);
  showSafeRoutes(safeRoutes[currentCity]);
}

// تحميل أول مرة
updateMap();
document.getElementById("reportForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const type = document.getElementById("reportType").value;
  const date = document.getElementById("reportDate").value;
  const lat = parseFloat(document.getElementById("reportLat").value);
  const lon = parseFloat(document.getElementById("reportLon").value);
  const desc = document.getElementById("reportDesc").value;

  const newAccident = {
    lat: lat,
    lon: lon,
    info: desc,
    type: type,
    date: date
  };

  accidentData[currentCity].push(newAccident);
  updateMap();
  alert("Accident reported successfully!");
  document.getElementById("reportForm").reset();
});
var map = L.map('map').setView([30.030, 31.280], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var accidentData = {
  cairo: [
    { lat: 30.035, lon: 31.285, info: "Major accident on Ring Road", type: "major", date: "2025-07-14" },
    { lat: 30.020, lon: 31.270, info: "Blocked road - avoid", type: "block", date: "2025-07-14" }
  ],
  asyut: [
    { lat: 27.190, lon: 31.170, info: "Minor crash in Asyut", type: "minor", date: "2025-07-14" }
  ]
};

var safeRoutes = {
  cairo: [
    {
      name: "Safe Route - Cairo",
      path: [
        [30.015, 31.260],
        [30.025, 31.270],
        [30.035, 31.280]
      ]
    }
  ],
  asyut: [
    {
      name: "Safe Route - Asyut",
      path: [
        [27.185, 31.160],
        [27.195, 31.165],
        [27.205, 31.170]
      ]
    }
  ]
};

var currentCity = "cairo";

function showAccidents(accidents) {
  accidents.forEach(function(accident) {
    L.marker([accident.lat, accident.lon])
      .addTo(map)
      .bindPopup(`${accident.info}<br>Date: ${accident.date}`);
  });
}

function showSafeRoutes(routes) {
  routes.forEach(function(route) {
    L.polyline(route.path, { color: 'green', weight: 4 })
      .addTo(map)
      .bindPopup(route.name);
  });
}

function changeCity() {
  currentCity = document.getElementById("city").value;
  updateMap();
}

function applyFilters() {
  updateMap();
}

function updateMap() {
  map.eachLayer(function(layer) {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });

  if (currentCity === "cairo") {
    map.setView([30.030, 31.280], 11);
  } else if (currentCity === "asyut") {
    map.setView([27.190, 31.170], 12);
  }

  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;

  const filtered = accidentData[currentCity].filter(function(a) {
    const matchType = type === "all" || a.type === type;
    const matchDate = !date || a.date === date;
    return matchType && matchDate;
  });

  showAccidents(filtered);
  showSafeRoutes(safeRoutes[currentCity]);
  checkProximity(filtered);
}

// حساب المسافة بين نقطتين
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
}

// فحص قرب المستخدم
function checkProximity(accidents) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      L.marker([userLat, userLon])
        .addTo(map)
        .bindPopup("You are here");

      accidents.forEach(function(accident) {
        const dist = getDistance(userLat, userLon, accident.lat, accident.lon);
        if (dist < 0.05) {
          document.getElementById("notification").classList.add("show");
        }
      });
    });
  }
}

updateMap();