const loadNav = () => {
    document.querySelectorAll(".tabs-nav a").forEach(function (elm) {
        elm.addEventListener("click", function (event) {
            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
        });
    });
};

const loadPage = (page) => {
    fetch(`pages/${page}.html`)
        .then((respons) => {
            const content = document.querySelector("#body-content");
            if (respons.status == 200) {
                return Promise.resolve(respons);
            } else if (respons.status == 404) {
                content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
            } else {
                content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
            }
        })
        .then(text)
        .then((data) => {
            const content = document.querySelector("#body-content");
            content.innerHTML = data;
            if (page === "matches") {
                getMatchScheduled();
                getMatchFinished();
            }
            if (page === "standings") getStandings();
            if (page === "teams") getTeams();
            if (page === "mybookmark") getFavoriteTeam();
        })
        .catch(error);
};

document.addEventListener("DOMContentLoaded", function () {
    // Activate sidebar nav
    const elems = document.querySelectorAll(".tabs-nav");
    M.Tabs.init(elems);
    loadNav();

    // Load page content
    let page = window.location.hash.substr(1);
    if (page == "") page = "matches";
    loadPage(page);
});
