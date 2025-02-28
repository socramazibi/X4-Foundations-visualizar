document.addEventListener("DOMContentLoaded", function () {
    let tableData = []; // Guardamos los datos originales
    let debounceTimeout; // Controla el tiempo de espera para la búsqueda

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

        // Crear filas (máximo 500 filas para evitar bloqueos)
        const maxRows = 500;
        data.slice(0, maxRows).forEach(row => {
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

    // Debounce para mejorar el rendimiento de la búsqueda
    function debounce(func, delay) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(func, delay);
    }

    // Filtrar datos en la tabla
    document.getElementById("filterInput").addEventListener("input", function () {
        debounce(() => {
            const filter = this.value.toLowerCase();
            const filteredData = tableData.filter(row =>
                Object.values(row).some(value => value && value.toLowerCase().includes(filter))
            );
            displayTable(filteredData);
        }, 300); // 300ms de espera antes de buscar
    });
});
