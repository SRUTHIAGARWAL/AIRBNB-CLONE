  // TO MAKE THE MAP APPEAR YOU MUST
            // ADD YOUR ACCESS TOKEN FROM
            // https://account.mapbox.com
           
            mapboxgl.accessToken = maptoken;
            console.log(maptoken);
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12', // Use the standard style for the map
                zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
                center:coordinates // center the map on this longitude and latitude
            });

            const marker=new mapboxgl.Marker({color : "red" })
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<p> ${listing.title} </br> ${listing.location} </p>`))
            .addTo(map);