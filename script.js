document.getElementById("convertBtn").addEventListener("click", function () {
    const fileInput = document.getElementById("xmlFile").files[0];

    if (!fileInput) {
        alert("Selecciona un archivo XML.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const xml = event.target.result;
        const json = JSON.parse(xml2json(xml, { compact: true, spaces: 2 }));

        const entries = json.root.entry || []; 
        const csvData = [["Time", "Category", "Title", "Text", "X", "Y", "Z"]];

        entries.forEach(entry => {
            csvData.push([
                entry._attributes?.time || "",
                entry._attributes?.category || "",
                entry._attributes?.title || "",
                entry._attributes?.text || "",
                entry._attributes?.x || "",
                entry._attributes?.y || "",
                entry._attributes?.z || ""
            ]);
        });

        // Convertir a CSV
        const csvString = Papa.unparse(csvData);
        displayTable(csvData);
        enableDownload(csvString);
    };

    reader.readAsText(fileInput);
});

// Función para mostrar datos en tabla
function displayTable(csvData) {
    const tbody = document.getElementById("csvTable");
    tbody.innerHTML = "";

    csvData.slice(1).forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            td.classList.add("border", "p-2", "text-left");
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// Función para habilitar la descarga de CSV
function enableDownload(csvString) {
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.getElementById("downloadLink");

    downloadLink.href = url;
    downloadLink.classList.remove("hidden");
}

// Filtrado en la tabla
document.getElementById("filterInput").addEventListener("keyup", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#csvTable tr");

    rows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
    });
});