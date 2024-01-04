
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: list.geometry.coordinates, // starting position [lng, lat]
  zoom: 8 // starting zoom
  });

  const marker = new mapboxgl.Marker({color:"red"})
  .setLngLat(list.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${list.title}</h4><p>Exact location after Booking</p>`)
  )
  .addTo(map);