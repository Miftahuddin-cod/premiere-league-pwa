const base_url = "https://api.football-data.org/v2/competitions/PL/";
const standingsTotal = base_url + "standings?standingType=TOTAL";
const teams = base_url + "teams";
const matchScheduled = base_url + `matches?status=SCHEDULED`;
const matchFinished = base_url + `matches?status=FINISHED`;

// Blok kode yang akan di panggil jika fetch berhasil
const status = (response) => {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
};

// Blok kode untuk memparsing json menjadi array JavaScript
const json = (response) => {
    return response.json();
};

const text = (response) => {
    return response.text();
};

// Blok kode untuk meng-handle kesalahan di blok catch
const error = (error) => {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
};

const fetchApi = (url) => {
    return fetch(url, {
        headers: {
            "X-Auth-Token": "4a33568223774894ad85f073ed6f4074",
        },
    });
};

// Mengambil data pertandingan yang belum dimulai
const getMatchScheduled = () => {
    document.getElementById("scheduled-matches").innerHTML = preloader();
    if ("caches" in window) {
        caches
            .match(matchScheduled)
            .then(json)
            .then((data) => {
                renderMatchScheduled(data);
            });
    }

    fetchApi(matchScheduled)
        .then(status)
        .then(json)
        .then((data) => {
            renderMatchScheduled(data);
        })
        .catch(error);
};

// Menampilkan data pertandingan yang belum dimulai
const renderMatchScheduled = (data) => {
    let matches = data.matches;
    let content = "";
    for (let i = 0; i < 5; i++) {
        let date = new Date(matches[i].utcDate);
        content += `
                    <div class="row">
                        <div class="col s12 center-align tanggal">${date.toDateString()}</div>
                        <div class="col s5 center-align">${
                            matches[i].awayTeam.name
                        }</div>
                        <div class="col s2 center-align m-1">
                            <div class="score">- : -</div>
                        </div>
                        <div class="col s5 center-align">${
                            matches[i].homeTeam.name
                        }</div>
                        <div class="col s12 center-align">
                            <span class="jam">${date.getHours()} : ${date.getMinutes()}</span>
                        </div>
                    </div>
                    <div class="divider"></div>`;
    }
    document.getElementById("scheduled-matches").innerHTML = content;
};

// mengambil data pertandingan yang sudah selesai
const getMatchFinished = () => {
    document.getElementById("finished-matches").innerHTML = preloader();
    if ("caches" in window) {
        caches
            .match(matchFinished)
            .then(json)
            .then((data) => {
                renderMatchFinished(data);
            });
    }

    fetchApi(matchFinished)
        .then(status)
        .then(json)
        .then((data) => {
            renderMatchFinished(data);
        })
        .catch(error);
};

// menampilkan data pertandingan yang sudah selesai
const renderMatchFinished = (data) => {
    let matches = data.matches;
    let content = "";
    for (let i = 1; i <= 5; i++) {
        let match = matches[matches.length - i];
        let date = new Date(match.utcDate);
        let scoreHome = "";
        let scoreAway = "";
        if (match.score.penalties.homeTeam === null) {
            if (match.score.extraTime.homeTeam === null) {
                scoreHome = match.score.fullTime.homeTeam;
                scoreAway = match.score.fullTime.awayTeam;
            } else {
                scoreHome = match.score.extraTime.homeTeam;
                scoreAway = match.score.extraTime.awayTeam;
            }
        } else {
            scoreHome = match.score.penalties.homeTeam;
            scoreAway = match.score.penalties.awayTeam;
        }

        content += `
                    <div class="row">
                        <div class="col s12 center-align tanggal">${date.toDateString()}</div>
                        <div class="col s5 center-align">${
                            match.awayTeam.name
                        }</div>
                        <div class="col s2 center-align m-1">
                            <div class="score">${scoreAway} : ${scoreHome}</div>
                        </div>
                        <div class="col s5 center-align">${
                            match.homeTeam.name
                        }</div>
                        <div class="col s12 center-align">
                            <span class="jam">${date.getHours()} : ${date.getMinutes()}</span>
                        </div>
                    </div>
                    <div class="divider"></div>`;
    }
    document.getElementById("finished-matches").innerHTML = content;
};

// menampilkan loader ketika loading data
const preloader = () => {
    let loader = `
        <div class="center col s12 loader">
            <div class="preloader-wrapper small active ">
                <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
                </div>
            </div>
        </div>
    `;
    return loader;
};

// mengambil data klasemen
const getStandings = () => {
    document.getElementById("standings-club").innerHTML = preloader();
    if ("caches" in window) {
        caches
            .match(standingsTotal)
            .then(json)
            .then((data) => {
                groupContent(data.standings[0]);
            });
    }

    fetchApi(standingsTotal)
        .then(status)
        .then(json)
        .then((data) => {
            groupContent(data.standings[0]);
        })
        .catch(error);
};

// membuat table klasemen
const groupContent = (standing) => {
    let content = `
        <table class="responsive-table">
            <thead>
                <tr>
                    <th class="center-align">Position</th>
                    <th>Team<br/>&nbsp;</th>
                    <th class="center-align">Played</th>
                    <th class="center-align">Won</th>
                    <th class="center-align">Draw</th>
                    <th class="center-align">Lost</th>
                    <th class="center-align">GD</th>
                    <th class="center-align">Points</th>
                </tr>
            </thead>
            <tbody>
                ${groupListContent(standing.table)}
            </tbody>
        </table>
    `;
    document.getElementById("standings-club").innerHTML = content;
};

// menambahkan data klasemen ke table
const groupListContent = (table) => {
    let list = "";
    table.forEach(function (placement) {
        let logo = placement.team.crestUrl.replace(/^http:\/\//i, "https://");
        list += `
                <tr>
                    <td class="center-align">
                        ${placement.position}
                    </td>
                    <td style="display:flex; align-items:center;"><img src="${logo}" class="team-logo" style="margin-right:1rem"> ${placement.team.name}</td>
                    <td class="center-align">${placement.playedGames}</td>
                    <td class="center-align">${placement.won}</td>
                    <td class="center-align">${placement.draw}</td>
                    <td class="center-align">${placement.lost}</td>
                    <td class="center-align">${placement.goalDifference}</td>
                    <td class="center-align">${placement.points}</td>
                </tr>
            `;
    });
    return list;
};

// mengambil data team
const getTeams = () => {
    document.getElementById("list-teams").innerHTML = preloader();
    if ("caches" in window) {
        caches
            .match(teams)
            .then(json)
            .then((data) => {
                renderListTeams(data);
            });
    }

    fetchApi(teams)
        .then(status)
        .then(json)
        .then((data) => {
            renderListTeams(data);
        })
        .catch(error);
};

// menampilkan data team
const renderListTeams = (data) => {
    let teams = "";
    data.teams.forEach((team) => {
        let logo = team.crestUrl;
        if (logo !== null) {
            logo = logo.replace(/^http:\/\//i, "https://");
        }
        teams += `
                    <div class="col s12 m6 l4 col-club">
                        <div class="card club">
                            <div class="club-image">
                                <img src="${logo}">
                            </div>
                            <div class="card-content">
                                <div class="club-name">${team.name}</div>
                                <div class="center-align" style="margin-bottom:10px;">Founded ${team.founded}</div>
                                <div class="center-align">
                                    <a class="waves-effect waves-light btn" style="margin-bottom:10px;" href="${team.website}">Website</a>
                                    <button class="waves-effect waves-light btn" style="margin-bottom:10px;" onclick="addFavoriteTeam(${team.id},'${logo}','${team.name}','${team.website}','${team.founded}')">Favorite</button>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
    });
    document.getElementById("list-teams").innerHTML = teams;
};

// menampilkan data favorite team
const renderFavoriteTeams = (data) => {
    let teams = "";
    if (data == "") {
        teams = `<h6 class="center">Anda belum memilih tim favorite</h6>`;
    } else {
        data.forEach((team) => {
            let logo = team.logo;
            if (logo !== null) {
                logo = logo.replace(/^http:\/\//i, "https://");
            }
            teams += `
                    <div class="col s12 m6 l4 col-club">
                        <div class="card club">
                            <div class="club-image">
                                <img src="${logo}">
                            </div>
                            <div class="card-content">
                                <div class="club-name">${team.name}</div>
                                <div class="center-align">Founded ${team.founded}</div>
                                <div class="center-align">
                                    <a class="waves-effect waves-light btn" href="${team.website}">Website</a>
                                    <button class="waves-effect waves-light btn" onclick="deleteFavoriteTeam(${team.id}, '${team.name}')">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
            `;
        });
    }
    document.getElementById("list-favteams").innerHTML = teams;
};
