var webPush = require("web-push");

const vapidKeys = {
    publicKey:
        "BEbHNYHRRl6TYQr8V3g1Tm8nyUhSzBF2R4cz2cIEEVc7RmB8Wvf06tG5CtYKsrVCypFqVEjgBhIuzeIMi8YHHpY",
    privateKey: "sXghFMjS0UIHz_MFb6WC6DzxMLDQOmJd0y67Wx7-JZU",
};

webPush.setVapidDetails(
    "mailto:example@yourdomain.org",
    vapidKeys.publicKey,
    vapidKeys.privateKey,
);
var pushSubscription = {
    endpoint:
        "https://fcm.googleapis.com/fcm/send/cjO2l70RtAA:APA91bFTThve3vEl7zTiUB_6JDJ3wZTieM3QL8NXo_JhUhhRuotjlxmo1JDcq7RsGfy9PZRhU5hUBCvn5WBrG4m27i-SJv1-9eFrSeaTitPpeCWLAyl7Qqur15edemu5r8eMzEoW-2W3",
    keys: {
        p256dh:
            "BM2iDYaGe1r1eEsdFfEMNRAZz6aHnAt58Ka+77f/fzjYPdTmqNynDenFajn7NsefX9fwXPzzQAXxWyFQjOVzMRQ=",
        auth: "3mPudsjyYAHKH+QzWx4pCg==",
    },
};
var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
    gcmAPIKey: "1058369547605",
    TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
