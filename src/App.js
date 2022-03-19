import './App.css';
import { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, LayersControl, GeoJSON, Tooltip } from 'react-leaflet'
import L from 'leaflet';
import pinCodes from './data.json'
import plgns from './polygons.json'

let avg_lat=0, avg_long=0;
for(let i=0;i<pinCodes.length;i++){
  avg_lat+=(pinCodes[i].lat.valueOf())/pinCodes.length;
  avg_long+=(pinCodes[i].long.valueOf())/pinCodes.length;
}

const dCentre = [avg_lat, avg_long];
const dZoom = 6;
const { BaseLayer } = LayersControl;

const greenIcon = L.icon({
  iconUrl: 'https://cdn.pixabay.com/photo/2012/04/26/19/04/map-42871_960_720.png',

  iconSize: [28, 26], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [8, 26], // point of the icon which will correspond to marker's location
  popupAnchor: [-2, -22] // point from which the popup should open relative to the iconAnchor
});

function App() {
  const mapRef = useRef();
  const [curYear, setCurYear]= useState(2000);
  const collection=document.getElementsByClassName('polygons');
  const pop_data=[...collection];
  const [col, setCol]= useState(pop_data);
  const [dataset, setDataset]=useState(pinCodes.map(function(place){ return place.pop;}));

  const handleClick = (year) => {
    for(let i=0;i<pinCodes.length;i++){
      if(parseInt(pinCodes[i].pop[curYear])<parseInt(pinCodes[i].pop[year])){
        setCol('red')
      }
      else{
        setCol('green')
      }
    }
    setCurYear(year);
  }

  return (
    <div className='parent'>

      <div className='contain'>
        <div className='cont'>
          <p id='spText'>Move the slider to see data for different years. Data shown for: <strong>{curYear}</strong></p>
          <input type="range" className="year" min="2000" max="2021" step="1" id="yearUp" onChange={() => handleClick(document.getElementById('yearUp').value)}/>
        </div>
        <div className='cont2'>
          <p className='textDataset'> Select Dataset</p>
          <button className='btnsD' onClick={()=>setDataset(pinCodes.map(function(place){ return place.pop;}))}>Population</button>
          <button className='btnsD' onClick={()=>setDataset(pinCodes.map(function(place){ return place.temperature;}))}>Average Temperature (in Celsius)</button>
        </div>
      </div>

      <MapContainer ref={mapRef} center={dCentre} zoom={dZoom} scrollWheelZoom={true} className='map'>
        <LayersControl>
          <BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
          </BaseLayer>
          <BaseLayer name="NASA Gibs Blue Marble">
            <TileLayer
              url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
              attribution="&copy; NASA Blue Marble, image service by OpenGeo"
              maxNativeZoom={8}
            />
          </BaseLayer>
        </LayersControl>

        {pinCodes.map(place => (
          <Marker position={[place.lat, place.long]} icon={greenIcon} key={place.id}>
            <Tooltip className='popups' permanent={true} direction='top' opacity={100} offset={[10, 10]}>
              {place.name} <br /> 
              <div className='population'>Value: {dataset[place.id-1][curYear]}</div>
            </Tooltip>
          </Marker>
        ))}
        <GeoJSON data={plgns} className='polygons' pathOptions={{ color: col }} />

      </MapContainer>
    </div>
  );
}

export default App;