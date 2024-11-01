function main() {
  init();
  let currencyChoice = [];
  window.addEventListener("DOMContentLoaded", async () => {
    // currencyData = await loadData();

    //ChartJS script for rendering values onto Canvas(Chart) in HTML
    const ctx = document.getElementById("chart");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
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

    let markerClusterLayerGroup = L.markerClusterGroup();
    markerClusterLayerGroup.addTo(singaporeMap);

    let resMoneyChangerLocat = await axios.get("data\LocationsofMoneyChangerGEOJSON.geojson");
    console.log(resMoneyChangerLocat);
    let features = resMoneyChangerLocat.data.features;
    for (feature of features) {
      let pos = feature.geometry.coordinates
      let marker = L.marker(pos[1],pos[0])
      marker.addTo(markerClusterLayerGroup);

    }
})

  function init() {
    let singapore = [1.35, 103.82];
    let singaporeMap = L.map("map");
    singaporeMap.setView(singapore, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(singaporeMap);
  }
}

main();
