function main() {
  let singaporeMap;
  window.addEventListener("DOMContentLoaded", async () => {
    init();

    // Script for conversion from base currency to target currency

    document.querySelector("#convert").addEventListener("click", async () => {
      let amount = parseInt(document.querySelector("#amount").value);

      let baseCurrency = document.querySelector("#base-currency").value;
      let targetCurrency = document.querySelector("#target-currency").value;

      console.log(baseCurrency, targetCurrency, amount);

      let currencyConversion = await axios.get(
        `https://v6.exchangerate-api.com/v6/634528519611d2105366c5aa/pair/${baseCurrency}/${targetCurrency}`
      );

      console.log(currencyConversion.data.conversion_rate);
      console.log(amount * currencyConversion.data.conversion_rate);

      document.querySelector("#result").value =
        amount * currencyConversion.data.conversion_rate;

        // Add table with "live" exchange rates of selected currencies
    let resLiveRates = await axios.get(
      `https://v6.exchangerate-api.com/v6/634528519611d2105366c5aa/latest/${baseCurrency}`
    );

    console.log(resLiveRates.data.conversion_rates);
    let tableBody = document.querySelector("#table-body");
    tableBody.innerHTML = "";

    let row1 = document.createElement("tr");
    let row2 = document.createElement("tr");

    for (const [currency, rate] of Object.entries(
      resLiveRates.data.conversion_rates
    )) {
      if (
        currency === "USD" ||
        currency === "SGD" ||
        currency === "MYR" ||
        currency === "IDR" ||
        currency === "AUD" ||
        currency === "HKD" ||
        currency === "THB" ||
        currency === "JPY" ||
        currency === "CNY" ||
        currency === "EUR"
      ) {
        let currencyCell = document.createElement("th");
        currencyCell.textContent = currency;

        let rateCell = document.createElement("td");
        rateCell.textContent = rate.toFixed(2);

        row1.appendChild(currencyCell);
        row2.appendChild(rateCell);

        tableBody.appendChild(row1);
        tableBody.appendChild(row2);
      }
    }

    });

    //ChartJS script for rendering values onto Canvas(Chart) in HTML
    // let historicRates = await axios.get("");

    // console.log(historicRates.data);

    // const ctx = document.getElementById("chart");
    // const labels = Object.keys(historicRates.data.rates);
    // const data = Object.values(historicRates.data.rates).map(
    //   (rate) => rate[targetCurrency]
    // );

    // new Chart(ctx, {
    //   type: "line",
    //   data: {
    //     labels: labels,
    //     datasets: [
    //       {
    //         label: `Exchange rates (${baseCurrency} to ${targetCurrency})`,
    //         data: data,
    //         borderWidth: 1,
    //       },
    //     ],
    //   },
    // });

    
    // Add marker cluster layer to the map denoting where the money changers are

    let resMoneyChangerLocat = await axios.get(
      "./data/LocationsofMoneyChangerGEOJSON.geojson"
    );
    console.log("hello");
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
        layer.bindPopup(`<h1>${nameOfShop}</h1>
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
