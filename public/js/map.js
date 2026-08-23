const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});



const el = document.createElement('div');
el.className = "custom-marker";
el.innerHTML = `<i style="color:white;" class="fa-solid fa-circle-user fa-lg"></i>`;



// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker(el)
    .setLngLat(listing.geometry.coordinates)                //Listing.geometry.coordinates access by show.ejs top script
    .setPopup(new mapboxgl.Popup({offset: 35})
        .setHTML(`<h5>${listing.title}</h5> <p>Exact location here</p>`))
    .addTo(map);

