document.addEventListener("DOMContentLoaded", function () {
    let tableData = []; // Guardamos los datos originales

    document.getElementById("csvFile").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const csv = Papa.parse(e.target.result, { header: true });
            tableData = csv.data; // Guardamos los datos completos
            displayTable(tableData);
        };
        reader.readAsText(file);
    });

    function displayTable(data) {
        const tableHead = document.getElementById("tableHead");
        const tableBody = document.getElementById("tableBody");

        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        if (data.length === 0) return;

        // Crear encabezados
        const headers = Object.keys(data[0]);
        const headRow = document.createElement("tr");
        headers.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            th.style.padding = "8px";
            th.style.border = "1px solid black";
            headRow.appendChild(th);
        });
        tableHead.appendChild(headRow);

        // Crear filas
        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(header => {
                const td = document.createElement("td");
                td.textContent = row[header] || "";
                td.style.padding = "8px";
                td.style.border = "1px solid black";
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    // Filtrar datos en la tabla
    document.getElementById("filterInput").addEventListener("keyup", function () {
        const filter = this.value.toLowerCase();
        const filteredData = tableData.filter(row =>
            Object.values(row).some(value => value && value.toLowerCase().includes(filter))
        );
        displayTable(filteredData);
    });
});
