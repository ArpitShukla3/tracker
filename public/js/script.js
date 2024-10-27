const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(function (position) {
    socket.emit("send-location", {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }),
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const map = L.map("map").setView([0, 0], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  const marker = {};
  socket.on("receive-location", (data) => {
    const {id,lat,lng} = data;
    map.setView([lat, lng]);
    if(marker[id]){
        marker[id].setLatLng([lat, lng]);
    }
    else
    {
        marker[id] = L.marker([lat, lng]).addTo(map);
    }
  });
  socket.on("user-disconnected", (id) => {
    if(marker[id]){
        marker[id].remove();
        delete marker[id];
        console.log("marker removed");
    }
  });
});