async function loadHTMLFromFile(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error("Error loading HTML:", error);
    }
}

async function getData(endpoint) {
    const url = `http://localhost:3000/api/${endpoint}`;
    try {
        const data = await fetch(url);
        const response = await data.json();
        return response;
    }
    catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
    }
}

function setActiveNavBtn(navBtn) {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    navBtn.classList.add("active");
}