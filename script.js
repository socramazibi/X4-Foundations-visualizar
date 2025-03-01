document.addEventListener("DOMContentLoaded", function () {
    let tableData = [];
    let debounceTimeout;

    document.getElementById("csvFile").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const csv = Papa.parse(e.target.result, { header: true });
            tableData = csv.data;
            formatTimeColumn(tableData);
            populateCategoryFilter(tableData);
            displayTable(tableData);
        };
        reader.readAsText(file);
    });

    function formatTimeColumn(data) {
        data.forEach(row => {
            if (row.Time) {
                row.Time = convertirTiempoX4(parseFloat(row.Time)); // Convierte el tiempo
            }
        });
    }

    function convertirTiempoX4(segundos) {
        if (isNaN(segundos)) return ""; // Manejar valores inválidos

        const dias = Math.floor(segundos / 86400);
        const horas = Math.floor((segundos % 86400) / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = Math.floor(segundos % 60);

        return `Día ${dias}, ${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }

    function populateCategoryFilter(data) {
        const categoryFilter = document.getElementById("categoryFilter");
        categoryFilter.innerHTML = '<option value="">Todas las categorías</option>';

        const categories = new Set(data.map(row => row.Category).filter(Boolean));
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    function displayTable(data) {
        const tableHead = document.getElementById("tableHead");
        const tableBody = document.getElementById("tableBody");

        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const headRow = document.createElement("tr");
        headers.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            headRow.appendChild(th);
        });
        tableHead.appendChild(headRow);

        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(header => {
                const td = document.createElement("td");

                // Si la columna es "Text", agregamos la clase 'text-column'
                if (header === "Text") {
                    td.classList.add("text-column");
                }

                td.textContent = row[header] || "";
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });

        makeColumnsResizable();
    }

    function makeColumnsResizable() {
        const thElements = document.querySelectorAll('th');
        thElements.forEach(th => {
            const resizer = th.querySelector('::after');
            if (resizer) {
                resizer.addEventListener('mousedown', initResize, false);
            }
        });
    }

    function initResize(e) {
        e.preventDefault();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopResize);
    }

    function onMouseMove(e) {
        const th = e.target;
        th.style.width = `${e.pageX - th.offsetLeft}px`;
    }

    function stopResize() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', stopResize);
    }

    function debounce(func, delay) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(func, delay);
    }

    function filterTable() {
        debounce(() => {
            const filter = document.getElementById("filterInput").value.toLowerCase();
            const selectedCategory = document.getElementById("categoryFilter").value;

            const filteredData = tableData.filter(row =>
                (selectedCategory === "" || row.Category === selectedCategory) &&
                Object.values(row).some(value => value && value.toLowerCase().includes(filter))
            );

            displayTable(filteredData);
        }, 300);
    }

    document.getElementById("filterInput").addEventListener("input", filterTable);
    document.getElementById("categoryFilter").addEventListener("change", filterTable);
});
