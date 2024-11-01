
function main() {
    let currencyData = [];
    window.addEventListener("DOMContentLoaded", async() =>{
        currencyData = await loadData();
    })
}

main();