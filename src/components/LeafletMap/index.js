import React from 'react';
import PropTypes from 'prop-types';
import {
  Map as LeafletMap, TileLayer, Marker, Circle,
} from 'react-leaflet';
import { geolocated } from 'react-geolocated';
import L from 'leaflet';
import RenseignementDonnees from '../../containers/RenseignementDonnees';

import Menu from '../../containers/Menu';
import DisplayBuilding from '../../containers/DisplayBuilding';

import './leafletmap.scss';
// pour utiliser des punaises custom
import pins3 from '../../styles/images/pins3.png';
import pins8 from '../../styles/images/Pins8.png';

// Automatically toggles full screen when opening the map
const toggleFullScreen = () => {
  const doc = window.document;
  const docEl = doc.documentElement;
  const requestFullScreen = docEl.requestFullscreen
    || docEl.mozRequestFullScreen
    || docEl.webkitRequestFullScreen
    || docEl.msRequestFullscreen;
  const cancelFullScreen = doc.exitFullscreen
    || doc.mozCancelFullScreen
    || doc.webkitExitFullscreen
    || doc.msExitFullscreen;
  if (!doc.fullscreenElement
    && !doc.mozFullScreenElement
    && !doc.webkitFullscreenElement
    && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
};

// Création de la map avec React Leaflet
class Leaflet extends React.Component {
  // Props: openDataForm, closeAllModals, updateFormField
  myPinUne = L.icon({
    iconUrl: `${pins3}`,
    iconSize: [40, 40], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
  });

  myPinDeux = L.icon({
    iconUrl: `${pins8}`,
    iconSize: [40, 40], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
  });

  componentDidMount() {
    const { getArchitectures, getBuildings } = this.props;
    toggleFullScreen();
    getBuildings();
    getArchitectures();
  }

  handleRightClick = (e) => {
    const { updateFormField, openDataForm, closeAllModals } = this.props;
    console.log(e.latlng);
    updateFormField('clickedLat', e.latlng.lat);
    updateFormField('clickedLng', e.latlng.lng);
    closeAllModals();
    openDataForm(e.latlng);
  };

  handleClickMarker = (e) => {
    const { openDisplayBuilding, closeAllModals } = this.props;
    const { id } = e.target.options;
    closeAllModals();
    openDisplayBuilding(id);
  }

  render() {
    const { closeAllModals, buildings } = this.props;
    const {
      coords, isGeolocationAvailable, isGeolocationEnabled, positionError,
    } = this.props;
    const southWest = L.latLng(-66.51326044311186, -172.26562500000003);
    const northEast = L.latLng(81.92318632602199, 190.54687500000003);
    const bounds = L.latLngBounds(southWest, northEast);
    const defaultCenter = coords ? [coords.latitude, coords.longitude] : [46.7248003746672, 2.9003906250000004];
    console.log(this.props);
    return (
      <>
        <Menu />
        <RenseignementDonnees />
        <DisplayBuilding />
        <LeafletMap
          center={isGeolocationEnabled ? defaultCenter : [
            coords.latitude,
            coords.longitude,
          ]}
          // center={defaultCenter}
          zoom={13}
          maxZoom={19}
          minZoom={3}
          setView
          attributionControl
          zoomControl={false}
          doubleClickZoom
          scrollWheelZoom
          maxBounds={bounds}
          dragging
          animate
          infinite
          easeLinearity={0.35}
          onContextmenu={this.handleRightClick}
          onClick={closeAllModals}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {
            buildings.map(({
              latitude, longitude, delivered, id,
            }) => (
              <Marker
                position={[latitude, longitude]}
                icon={delivered ? this.myPinDeux : this.myPinUne}
                key={id}
                id={id}
                onClick={this.handleClickMarker}
              />
            ))
          }
          {coords !== null && (
            <Circle
              center={defaultCenter}
              radius={coords.accuracy / 2}
              color="#d98c5f"
              fillColor="#fff9ef"
            />
          )}
        </LeafletMap>
      </>
    );
  }
}

Leaflet.propTypes = {
  closeAllModals: PropTypes.func.isRequired,
  openDataForm: PropTypes.func.isRequired,
  updateFormField: PropTypes.func.isRequired,
  getArchitectures: PropTypes.func.isRequired,
  getBuildings: PropTypes.func.isRequired,
  buildings: PropTypes.arrayOf(PropTypes.object).isRequired,
  openDisplayBuilding: PropTypes.func.isRequired,
  coords: PropTypes.object.isRequired,
  isGeolocationAvailable: PropTypes.bool.isRequired,
  isGeolocationEnabled: PropTypes.bool.isRequired,
  positionError: PropTypes.number.isRequired,
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: null,
  watchPosition: true,
})(Leaflet);
