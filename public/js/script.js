const socket =io();
/*
if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
        const {latitude , longitude} =position.coords;
       //console.log(`Received location from ${socket.id}:`, data); // Debug log
        socket.emit("send-location",{latitude,longitude});
    },
    (error)=>{
        console.error(error);
        
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    }
)
}*/
// Simulated location updates (for testing different locations)
setInterval(() => {
    const latitude = 37.7749 + (Math.random() * 0.02 - 0.01);  // Example: San Francisco
    const longitude = -122.4194 + (Math.random() * 0.02 - 0.01);
    
    console.log(`Simulated Location: ${latitude}, ${longitude}`);  // Debugging in console
    socket.emit("send-location", { latitude, longitude });
}, 5000);  // Sends a new location every 5 seconds


const map =L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"delhi",
}).addTo(map)
const markers = {};
/*
socket.on("receive-location",(data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude]);

   if (!latitude || !longitude) {
        console.error("Invalid location data received!");
        return;
    }

   // if (id === mySocketId) return; // Ignore self-location updates

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]= L.marker([latitude,longitude]).addTo(map)
    }
})
    */
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    // Only center the map when a new user joins
    if (!markers[id]) {
        map.setView([latitude, longitude]);
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        markers[id].setLatLng([latitude, longitude]);
    }
});
//. Debug the Received Locations in Console
socket.on("receive-location", (data) => {
    console.log(`User ${data.id}:`, data.latitude, data.longitude);
});
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});