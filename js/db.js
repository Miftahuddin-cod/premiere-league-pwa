// membuat database
let dbPromised = idb.open("premiere-league", 1, function (upgradeDb) {
    let objectStore = upgradeDb.createObjectStore("favoriteTeams", {
        keyPath: "id",
    });
});

// menampilkan notifikasi
const pushNotification = (judul, pesan) => {
    const title = judul;
    const options = {
        body: pesan,
        icon: "img/icon.png",
    };
    if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(title, options);
        });
    }
};

// menambahkan team favorite ke database
const addFavoriteTeam = (id, logo, name, website, founded) => {
    dbPromised
        .then((db) => {
            let tx = db.transaction("favoriteTeams", "readwrite");
            let store = tx.objectStore("favoriteTeams");
            let item = {
                id: id,
                logo: logo,
                name: name,
                website: website,
                founded: founded,
            };
            store.put(item);
            return tx.complete;
        })
        .then(() =>
            pushNotification(
                `Menambahkan Tm Favorite`,
                `Berhasil Menambahkan Tim ${name}`,
            ),
        )
        .catch(() =>
            pushNotification(
                `Menambahkan Tim Favorite`,
                `Gagal Menambahkan Tim ${name}`,
            ),
        );
};

// mengambil data favorite team dari database
const getFavoriteTeam = () => {
    dbPromised
        .then((db) => {
            let tx = db.transaction("favoriteTeams", "readonly");
            let store = tx.objectStore("favoriteTeams");
            return store.getAll();
        })
        .then((items) => {
            renderFavoriteTeams(items);
        })
        .catch(() => console.log("Gagagl Meload Data"));
};

// menghapus favorite team dari database
const deleteFavoriteTeam = (id, name) => {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("favoriteTeams", "readwrite");
            var store = tx.objectStore("favoriteTeams");
            store.delete(id);
            return tx.complete;
        })
        .then(function () {
            pushNotification(
                `Menghapus Tim Favorite`,
                `Berhasil Menghapus Tim ${name}`,
            );
            getFavoriteTeam();
        });
};
