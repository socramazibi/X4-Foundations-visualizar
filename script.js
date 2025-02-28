document.getElementById("convertBtn").addEventListener("click", function () {
    const fileInput = document.getElementById("xmlFile").files[0];

    if (!fileInput) {
        alert("Selecciona un archivo XML.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(event.target.result, "text/xml");
        const entries = xml.getElementsByTagName("entry");

        if (entries.length === 0) {
            alert("No se encontraron entradas en el XML.");
            return;
        }

        const csvData = [["Time", "Category", "Title", "Text", "X", "Y", "Z"]];

        for (let entry of entries) {
            csvData.push([
                entry.getAttribute("time") || "",
                entry.getAttribute("category") || "",
                entry.getAttribute("title") || "",
                entry.getAttribute("text") || "",
                entry.getAttribute("x") || "",
                entry.getAttribute("y") || "",
                entry.getAttribute("z") || ""
            ]);
        }

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
