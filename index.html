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
            populateCategoryFilter(tableData);
            displayTable(tableData);
        };
        reader.readAsText(file);
    });

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
            th.style.padding = "8px";
            th.style.border = "1px solid black";
            headRow.appendChild(th);
        });
        tableHead.appendChild(headRow);

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

    function debounce(func, delay) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(func, delay);
    }

    function filterTable() {
        debounce(() => {
            const filter = document.getElementById("filterInput").value.toLowerCase();
            const selectedCategory = document.getElementById("categoryFilter").value;

            const filteredData = tableData.filter(row => {
                const matchesText = Object.values(row).some(value => value && value.toLowerCase().includes(filter));
                const matchesCategory = selectedCategory === "" || row.Category === selectedCategory;
                return matchesText && matchesCategory;
            });

            displayTable(filteredData);
        }, 300);
    }

    document.getElementById("filterInput").addEventListener("input", filterTable);
    document.getElementById("categoryFilter").addEventListener("change", filterTable);
});
