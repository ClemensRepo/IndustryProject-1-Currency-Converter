let singaporeMap;
function main() {
  let currencyChoice = [];
  window.addEventListener("DOMContentLoaded", async () => {
    init();

    //ChartJS script for rendering values onto Canvas(Chart) in HTML
    // let resLastestRates = await axios.request({
    //   "method": GET,
    //   "url": "https://data.fixer.io/api/latest
    //   ? access_key=8dc5ac75300cf53baa74a08db6d4ca15"
    // });

    const ctx = document.getElementById("chart");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "Exchange rates",
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Add marker cluster layer to the map denoting where the money changers are

    let resMoneyChangerLocat = await axios.get(
      "data/LocationsofMoneyChangerGEOJSON.geojson"
    );
    console.log(resMoneyChangerLocat.data);
    let features = resMoneyChangerLocat.data;

    let moneyChangerLayer = L.geoJSON(features, {
      onEachFeature: function (feature, layer) {
        let el = document.createElement("div");
        el.innerHTML = feature.properties.Description;
        let allTDs = el.querySelectorAll("td");
        let nameOfShop = allTDs[0].innerHTML;
        let postalCodeOfShop = allTDs[1].innerHTML;
        let addressOfShop = allTDs[2].innerHTML;
        marker.bindPopup(`<h1>${nameOfShop}</h1>
            <ul>
              <li>Postal Code ${postalCodeOfShop}</li>
              <li>Address ${addressOfShop}</li>
            </ul>  
        `);
      },
    });
    moneyChangerLayer.addTo(singaporeMap);
  });

  // Init function to intialise the map
  function init() {
    let singapore = [1.35, 103.82];
    singaporeMap = L.map("map");
    singaporeMap.setView(singapore, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(singaporeMap);
  }
}

main();

// let singaporeMap; // Define globally so it’s accessible in both init and DOMContentLoaded

// function main() {
//   let currencyChoice = [];

//   window.addEventListener("DOMContentLoaded", async () => {
//     init();
//     const ctx = document.getElementById("chart");

//     // ChartJS script for rendering values onto Canvas(Chart) in HTML
//     new Chart(ctx, {
//       type: "line",
//       data: {
//         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//         datasets: [
//           {
//             label: "Exchange rates",
//             data: [12, 19, 3, 5, 2, 3],
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true,
//           },
//         },
//       },
//     });

//     // Initialize marker cluster
//     let markerClusterLayerGroup = L.markerClusterGroup();
//     markerClusterLayerGroup.addTo(singaporeMap);

//     // Load geoJSON data and create markers
//     let resMoneyChangerLocat = await axios.get("data/LocationsofMoneyChangerGEOJSON.geojson");
//     console.log(resMoneyChangerLocat.data);
//     let features = resMoneyChangerLocat.data.features;

//     for (let feature of features) {
//       let pos = feature.geometry.coordinates;
//       let marker = L.marker([pos[1], pos[0]]); // Reverse the order to [lat, lng]
//       marker.addTo(markerClusterLayerGroup);
//     }
//   });

//   function init() {
//     let singapore = [1.35, 103.82];
//     singaporeMap = L.map("map"); // Assign to the globally defined singaporeMap
//     singaporeMap.setView(singapore, 13);

//     L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       maxZoom: 19,
//       attribution:
//         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//     }).addTo(singaporeMap);
//   }
// }

// main();

// marker cluster code

// let markerClusterLayerGroup = L.markerClusterGroup();
//     markerClusterLayerGroup.addTo(singaporeMap);

// for (let feature of features) {
//   let pos = feature.geometry.coordinates;
//   let marker = L.marker([pos[1],pos[0]]);
//   marker.addTo(markerClusterLayerGroup);
