importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js",
);

if (workbox) {
    console.log(`Workbox berhasil dimuat`);
    workbox.precaching.precacheAndRoute([
        { url: "/index.html", revision: "1" },
        { url: "/css/materialize.min.css", revision: "1" },
        { url: "/css/style.css", revision: "1" },
        { url: "/js/materialize.min.js", revision: "1" },
        { url: "/js/main.js", revision: "1" },
        { url: "/js/idb.js", revision: "1" },
        { url: "/js/db.js", revision: "1" },
        { url: "/js/api.js", revision: "1" },
        { url: "/js/nav.js", revision: "1" },
        { url: "/img/icon.png", revision: "1" },
        { url: "/img/logo.png", revision: "1" },
        { url: "/img/android-icon-36x36.png", revision: "1" },
        { url: "/img/android-icon-48x48.png", revision: "1" },
        { url: "/img/android-icon-72x72.png", revision: "1" },
        { url: "/img/android-icon-96x96.png", revision: "1" },
        { url: "/img/android-icon-144x144.png", revision: "1" },
        { url: "/img/android-icon-192x192.png", revision: "1" },
        { url: "/img/apple-icon-180x180.png", revision: "1" },
        { url: "/manifest.json", revision: "1" },
    ]);

    workbox.routing.registerRoute(
        new RegExp("/pages/"),
        workbox.strategies.staleWhileRevalidate({
            cacheName: "pages",
        }),
    );

    workbox.routing.registerRoute(
        new RegExp("https://api.football-data.org/v2/competitions/PL/"),
        workbox.strategies.staleWhileRevalidate(),
    );
} else console.log(`Workbox gagal dimuat`);

self.addEventListener("push", function (event) {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    let options = {
        body: body,
        icon: "img/icon.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
    };
    event.waitUntil(
        self.registration.showNotification("Push Notification", options),
    );
});
