/* Prenota · service worker: mostra il promemoria che arriva dal computer del locale un'ora prima della prenotazione. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { t: "Prenotazione", b: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.t || "Prenotazione", {
    body: d.b || "", icon: "icona-192.png", badge: "icona-192.png", tag: d.tag || "tavolo",
    renotify: true, requireInteraction: true, data: { u: d.u || "prenota.html" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const u = new URL((e.notification.data && e.notification.data.u) || "prenota.html", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(lista => {
    for (const c of lista) if (c.url === u && "focus" in c) return c.focus();
    return self.clients.openWindow(u);
  }));
});
