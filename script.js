document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("csvFile").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const csv = Papa.parse(e.target.result, { header: true });
            displayTable(csv.data);
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
            headRow.appendChild(th);
        });
        tableHead.appendChild(headRow);

        // Crear filas
        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(header => {
                const td = document.createElement("td");
                td.textContent = row[header] || "";
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }
});
