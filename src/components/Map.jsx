import { useNavigate } from 'react-router-dom';
import { MapContainer , TileLayer , Marker , Popup, useMap, useMapEvents } from 'react-leaflet';

import styles from './Map.module.css';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useUrlPosition } from '../hooks/useUrlPosition';

function Map() {
  // const navigate = useNavigate();
  const { cities } = useCities();
  const [mapPosition , setMapPosition] = useState([40 , 0])
  const { isLoading: isLoadingPosition,
    position: geolocationPosition
    , getPosition } = useGeolocation();
  const [mapLat , mapLng] = useUrlPosition()
 
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat , mapLng])
    },
    [mapLat,mapLng]
  )

  useEffect(function () {
    if (geolocationPosition) setMapPosition([geolocationPosition.lat,
    geolocationPosition.lng]);
  },
    [geolocationPosition])

  return (
    <div className={styles.mapContainer}>
     {!geolocationPosition && <Button type='position' onClick={getPosition}>
        {isLoadingPosition? 'Loading...': 'Use your position'}
      </Button>}
      <MapContainer
        // center={[mapLat, mapLng]}
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        
        {cities.map((city) => <Marker
          position={[city.position.lat , city.position.lng]} key={city.id}>
          <Popup>
            <span>{city.emoji}</span> <span>{ city.cityName}</span>
          </Popup>
        </Marker>)}

        <ChangedCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
      </div>
  )
}

function ChangedCenter({ position}) {
  const map = useMap();
  map.setView(position , 8)
  return null
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({ //inbuilt react leaflet function for events
    click: (e) => { //e has the following properties and object used below
      //console.log(e);
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)//used to pass the lat and lng of the clicked position on map and pass it in the url to acess it using the search params hook

    }
  })
}


export default Map;