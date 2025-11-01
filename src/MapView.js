import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapView = () => {
  const apiKey = "8c7e0391bd4342f0910fb60ac1fab9bc"; // put your key here

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer center={[14.5995, 120.9842]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`}
          attribution='© OpenStreetMap contributors, © Geoapify'
        />

        <Marker position={[14.5995, 120.9842]}>
          <Popup>📍 Manila, Philippines</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
