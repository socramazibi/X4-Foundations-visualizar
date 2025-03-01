document.addEventListener("DOMContentLoaded", function () {
    let tableData = [];
    let debounceTimeout;

    // Subir el archivo CSV
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

    // Función para formatear el tiempo
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

    // Poblamos el filtro de categorías
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

    // Mostrar los datos en la tabla
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

            // Solo añadir la clase si la columna es 'Text'
            if (header === "Text") {
                th.classList.add("text-column");
            }

            headRow.appendChild(th);
        });
        tableHead.appendChild(headRow);

        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(header => {
                const td = document.createElement("td");
                td.textContent = row[header] || "";

                // Solo añadir la clase si la columna es 'Text'
                if (header === "Text") {
                    td.classList.add("text-column");
                }

                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    // Función para debouncing en los filtros
    function debounce(func, delay) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(func, delay);
    }

    // Filtrar la tabla
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

    // Cambio de tema
    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.style.setProperty('--background', '#f4f4f4');
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--table-bg', '#fff');
            document.documentElement.style.setProperty('--header-bg', '#ddd');
            document.documentElement.style.setProperty('--border-color', '#ccc');
        } else if (theme === 'dark') {
            document.documentElement.style.setProperty('--background', '#222');
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.documentElement.style.setProperty('--table-bg', '#333');
            document.documentElement.style.setProperty('--header-bg', '#444');
            document.documentElement.style.setProperty('--border-color', '#666');
        } else if (theme === 'blue') {
            document.documentElement.style.setProperty('--background', '#1b2a4e');
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.documentElement.style.setProperty('--table-bg', '#2a3d66');
            document.documentElement.style.setProperty('--header-bg', '#3b5998');
            document.documentElement.style.setProperty('--border-color', '#3b5998');
        }
        localStorage.setItem('theme', theme);
    }

    document.addEventListener("DOMContentLoaded", function () {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
    });
});
