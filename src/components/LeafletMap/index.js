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

  handleClickMarker = () => {
    const { openDisplayBuilding, closeAllModals } = this.props;
    console.log('marker clicked');
    closeAllModals();
    openDisplayBuilding();
  }

  render() {
    const { closeAllModals, buildings } = this.props;
    const {
      coords, isGeolocationAvailable, isGeolocationEnabled, positionError, center, zoom, userLocalized, updateFormField,
    } = this.props;
    const southWest = L.latLng(-66.51326044311186, -172.26562500000003);
    const northEast = L.latLng(81.92318632602199, 190.54687500000003);
    const bounds = L.latLngBounds(southWest, northEast);
    // const defaultCenter = coords ? [coords.latitude, coords.longitude] : center;

    if (isGeolocationEnabled && coords && !userLocalized) {
      // eslint-disable-next-line no-unused-expressions
      updateFormField('center', [coords.latitude, coords.longitude]);
      updateFormField('userLocalized', true);
      updateFormField('zoom', 13);
    }


    console.log(this.props);
    return (
      <>
        <Menu />
        <RenseignementDonnees />
        <DisplayBuilding />
        <LeafletMap
          center={center}
          zoom={zoom}
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
            buildings.map(({ latitude, longitude, id }) => (
              <Marker
                position={[latitude, longitude]}
                icon={this.myPinUne}
                key={id}
                onClick={this.handleClickMarker}
              />
            ))
          }
          {coords !== null && (
            <>
              <Circle
                center={[coords.latitude, coords.longitude]}
                radius={coords.accuracy / 2}
                color="#d98c5f"
                fillColor="#f3b05f"
              />
              <Circle
                center={[coords.latitude, coords.longitude]}
                radius={0.5}
                color="#cc6b33"
                fillColor="cc6b33"
              />
            </>
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

  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: null,
  watchPosition: true,
})(Leaflet);
