import { APIProvider, InfoWindow, Map, Marker, useMarkerRef } from '@vis.gl/react-google-maps';
import { useState } from 'react';

export type Poi ={ key: string, location: google.maps.LatLngLiteral, color?: string }

export const PoiMarkers = (props: {pois: Poi[]}) => {
  return (
    <>
      {/*props.pois.map( (poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}>
        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))*/
      props.pois.map( (poi: Poi) => (
        <PoiMarker key={poi.key} poi ={poi}/>
      ))}
    </>
  );
};

export const PoiMarker = (props: {poi:Poi}) => {
// `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow (if you're using the Marker component, you
  // can use the `useMarkerRef` hook instead).
      const [markerRef, marker] = useMarkerRef();

      const [infoWindowShown, setInfoWindowShown] = useState(false);

      // clicking the marker will toggle the infowindow
      const handleMarkerClick = ()=>{
        setInfoWindowShown(!infoWindowShown)
      };

      // if the maps api closes the infowindow, we have to synchronize our state
      const handleClose = () => setInfoWindowShown(false);
      return (
        <>
            <Marker
              key={props.poi.key}
              position={props.poi.location}
              onClick={handleMarkerClick}
              ref={markerRef}
                icon={{
                    //url: "./src/assets/open1.png", // Replace with your image path
                    path:"M11,.5A10.43,10.43,0,0,0,.5,10.86C.5,21.21,11,29.5,11,29.5s10.5-8.29,10.5-18.64A10.43,10.43,0,0,0,11,.5Z",
                    fillColor:props.poi.color,
                    scaledSize: new window.google.maps.Size(25, 25) // Set desired width and height in pixels
                }}
              >        
            </Marker>
            {
                infoWindowShown && (
                                    <InfoWindow anchor={marker} onClose={handleClose}>
                                    <h2>Prueba!</h2>
                                    <p>Esto es una prueba.</p>
                                    </InfoWindow>
                                )
            }
            </>
      )
}