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

      //ChartJS script for rendering values onto Canvas(Chart) in HTML

      // let historicRates = await axios.get(`https://api.currencylayer.com/timeframe?access_key=425457f6ef3619d5cd757b918771061d&currencies=USD,GBP,EUR&start_date=2010-03-01&end_date=2010-04-01`);
      // console.log(historicRates.data);

      async function fetchHistoricRates() {
        try {
          let today = new Date();
          let todayYear = today.getFullYear();
          let todayMonth = today.getMonth() + 1;
          let todayDate = today.getDate();
          const response = await axios.get(
            `https://api.currencylayer.com/timeframe?access_key=0fe1c403e481e51b45c941764f6f4da8&currencies=${baseCurrency},${targetCurrency}&start_date=${todayYear}-${todayMonth}-${todayDate}&end_date=${
              todayYear - 1
            }-${todayMonth}-${todayDate}`
          );

          return response.data.quotes;
        } catch (error) {
          console.error("Error fetching historical rates:", error);
          return null;
        }
      }

      // Generate a list of dates (monthly) for the past 5 years
      // function generateDateRange() {
      //     const today = new Date();
      //     const dates = [];
      //     for (let i = 0; i < 60; i++) { // 60 months = 5 years
      //         const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      //         dates.push(date.toISOString().split("T")[0]); // YYYY-MM-DD format
      //     }
      //     return dates.reverse();
      // }

      // Prepare and render the chart
      async function renderChart() {
        console.log(fetchHistoricRates());

        const exchangeData = {};
        for (const [date, rate] of Object.entries(fetchHistoricRates)) {
          exchangeData[date] = rate.(baseCurrency + targetCurrency);
        }

        console.log(exchangeData);

        const labels = Object.keys(exchangeData);
        const values = Object.values(exchangeData);

        // const label = Object.keys(fetchHistoricRates());
        // const values = object.values(Object.keys(fetchHistoricRates()))[baseCurrency + targetCurrency];

        // Create chart
        const ctx = document.getElementById("chart").getContext("2d");
        new Chart(ctx, {
          type: "line",
          data: {
            labels: labels, // X-axis: Dates
            datasets: [
              {
                label: `Exchange Rate (${baseCurrency} to ${targetCurrency})`,
                data: values, // Y-axis: Exchange rates
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: `Historical Exchange Rate: ${baseCurrency} to ${targetCurrency}`,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
              },
              y: {
                title: {
                  display: true,
                  text: `Rate (${baseCurrency} to ${targetCurrency})`,
                },
              },
            },
          },
        });
      }

      // Initialize
      renderChart();

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
        layer.bindPopup(`<h3>${nameOfShop}</h3>
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
