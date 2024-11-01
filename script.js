
function main() {
    
    init();
    let currencyChoice = [];
    window.addEventListener("DOMContentLoaded", async() =>{
        currencyData = await loadData();
    });

    function init() {
        let singapore = [1.35,103.82];
        let singaporeMap = L.map("map");
        singaporeMap.setView(singapore, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }
}

main();