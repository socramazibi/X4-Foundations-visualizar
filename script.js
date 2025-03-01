document.addEventListener("DOMContentLoaded", function () {
    // Estado global
    let tableData = [];
    let debounceTimeout;
    let sortOrderTime = -1; // Cambiado a -1 para ordenar de mayor a menor por defecto

    // Event Listeners
    document.getElementById("csvFile").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (!file) return;

        // Mostrar mensaje de carga
        document.getElementById('loadingMessage').style.display = 'block';

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const csv = Papa.parse(e.target.result, { header: true });
                tableData = csv.data;
                formatTimeColumn(tableData);
                populateCategoryFilter(tableData);
                displayTable(tableData);
            } catch (error) {
                console.error('Error al procesar el archivo:', error);
                alert('Error al procesar el archivo');
            } finally {
                // Ocultar mensaje de carga
                document.getElementById('loadingMessage').style.display = 'none';
            }
        };
        reader.readAsText(file);
    });

    function formatTimeColumn(data) {
        data.forEach(row => {
            if (row.Time) {
                row.Time = convertirTiempoX4(parseFloat(row.Time));
            }
        });
    }

    function convertirTiempoX4(segundos) {
        if (isNaN(segundos)) return "";

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
            if (header === 'Time') {
                // Ordenar los datos inicialmente
                if (data === tableData) {
                    const sortedData = [...data].sort((a, b) => {
                        const [diaA, horaA] = a.Time.split(', ');
                        const [diaB, horaB] = b.Time.split(', ');
                        
                        const numDiaA = parseInt(diaA.replace('Día ', ''));
                        const numDiaB = parseInt(diaB.replace('Día ', ''));
                        
                        if (numDiaA !== numDiaB) {
                            return sortOrderTime * (numDiaA - numDiaB);
                        }
                        
                        const [horasA, minutosA, segundosA] = horaA.split(':').map(Number);
                        const [horasB, minutosB, segundosB] = horaB.split(':').map(Number);
                        
                        const tiempoA = horasA * 3600 + minutosA * 60 + segundosA;
                        const tiempoB = horasB * 3600 + minutosB * 60 + segundosB;
                        
                        return sortOrderTime * (tiempoA - tiempoB);
                    });
                    data = sortedData;
                }

                th.addEventListener('click', () => {
                    sortOrderTime *= -1;
                    const sortedData = [...data].sort((a, b) => {
                        // Extraer días y tiempo
                        const [diaA, horaA] = a.Time.split(', ');
                        const [diaB, horaB] = b.Time.split(', ');
                        
                        // Obtener el número de día
                        const numDiaA = parseInt(diaA.replace('Día ', ''));
                        const numDiaB = parseInt(diaB.replace('Día ', ''));
                        
                        // Si los días son diferentes, ordenar por días
                        if (numDiaA !== numDiaB) {
                            return sortOrderTime * (numDiaA - numDiaB);
                        }
                        
                        // Si los días son iguales, convertir horas a segundos y comparar
                        const [horasA, minutosA, segundosA] = horaA.split(':').map(Number);
                        const [horasB, minutosB, segundosB] = horaB.split(':').map(Number);
                        
                        const tiempoA = horasA * 3600 + minutosA * 60 + segundosA;
                        const tiempoB = horasB * 3600 + minutosB * 60 + segundosB;
                        
                        return sortOrderTime * (tiempoA - tiempoB);
                    });
                    displayTable(sortedData);
                });
            }
            headRow.appendChild(th);
        });

        tableHead.appendChild(headRow);

        data.forEach(row => {
            const tr = document.createElement("tr");
            headers.forEach(header => {
                const td = document.createElement("td");
                if (header === 'Text') {
                    td.style.whiteSpace = 'pre-wrap';
                    td.style.maxWidth = '300px';
                    td.style.wordBreak = 'break-word';
                } else if (header === 'Title') {
                    td.className = 'title-column';
                }
                td.textContent = row[header] || "";
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    function filterTable() {
        const filter = document.getElementById("filterInput").value.toLowerCase();
        const selectedCategory = document.getElementById("categoryFilter").value;

        const filteredData = tableData.filter(row =>
            (selectedCategory === "" || row.Category === selectedCategory) &&
            Object.values(row).some(value => 
                value && value.toString().toLowerCase().includes(filter)
            )
        );

        displayTable(filteredData);
    }

    // Event listeners para filtrado
    document.getElementById("filterInput").addEventListener("input", filterTable);
    document.getElementById("categoryFilter").addEventListener("change", filterTable);

    // Función para cambiar el tema
    window.setTheme = function(theme) {
        document.body.className = theme + '-mode';
        localStorage.setItem('theme', theme);
    };

    // Aplicar tema guardado al cargar
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme('light'); // tema por defecto
    }
});
