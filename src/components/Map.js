import React, { Component } from 'react';
import get from 'lodash.get';
import moment from 'moment';
import {
  Map as LeafletMap,
  TileLayer,
  Marker,
  LayersControl,
  LayerGroup,
  Tooltip,
  ScaleControl,
  Polyline,
  ZoomControl,
} from 'react-leaflet';
import L, { latLng, latLngBounds } from 'leaflet';
import { Position } from './Position';

const LAYER_KEY = 'map-layer';

export default class ReactMap extends Component {
  static getDerivedStateFromProps(props, state) {
    const bounds = latLngBounds([]);
    const positions = get(props, ['positions']) || [];

    positions.forEach(function (device) {
      const lat = get(device, 'latitude');
      const lng = get(device, 'longitude');

      if (lat || lng) {
        bounds.extend({ lat, lng });
        bounds.extend({ lat: lat + 0.001, lng: lng + 0.001 });
        bounds.extend({ lat: lat - 0.001, lng: lng - 0.001 });
      }
    });

    if (!bounds.isValid()) {
      // continental us
      bounds.extend(
        L.latLngBounds({ lat: 50, lng: -130 }, { lat: 20, lng: -60 }),
      );
    }

    return Object.assign({}, state, bounds.isValid() ? { bounds } : {});
  }

  state = {
    satellite: localStorage.getItem(LAYER_KEY) === 'Satellite',
    'Show current location': !(
      localStorage.getItem('Show current location') === 'false'
    ),
    bounds: null,
  };

  renderPositions = (position) => {
    const selectedDate = moment(this.props.selectedDate);
    const { id, name, batteryPercentage } = get(
      position,
      'deviceByDeviceId',
      {},
    );

    return (
      <Position
        key={`position-${position.id}`}
        {...position}
        id={id}
        name={name}
        batteryPercentage={batteryPercentage}
      />
    );
  };

  render() {
    const { positions } = this.props;
    const { bounds } = this.state;

    return (
      <LeafletMap
        ref={(map) => (this._map = map)}
        bounds={bounds}
        onBaselayerchange={(e) => {
          this.setState({ satellite: e.name === 'Satellite' });
          localStorage.setItem(LAYER_KEY, e.name);
        }}
        onOverlayadd={(e) => {
          this.setState({ [e.name]: true });
          localStorage.setItem(e.name, 'true');
        }}
        onOverlayremove={(e) => {
          this.setState({ [e.name]: false });
          localStorage.setItem(e.name, 'false');
        }}
        maxZoom={16}
        zoomControl={false}
        style={{ minHeight: 800, width: '100%' }}
      >
        <ScaleControl position="bottomleft" />
        <ZoomControl position="topright" />
        <LayersControl
          position="topleft"
          sortLayers={true}
          sortFunction={function (layerA, layerB, nameA, nameB) {
            const order = ['Map', 'Satellite', 'Show current location'];
            const idxA = order.indexOf(nameA),
              idxB = order.indexOf(nameB);

            return idxA > idxB ? +1 : idxA < idxB ? -1 : 0;
          }}
        >
          <LayersControl.BaseLayer name="Map" checked={!this.state.satellite}>
            <TileLayer
              crossOrigin
              tileSize={512}
              minZoom={1}
              maxZoom={20}
              zoomOffset={-1}
              url="https://d1y5pbzf4dj7w6.cloudfront.net/maps/streets/{z}/{x}/{y}@2x.png?key=9itgsP62snlBhRn8G4sH"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            name="Satellite"
            checked={this.state.satellite}
          >
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
          </LayersControl.BaseLayer>
          {(positions || []).length > 0 ? (
            <LayersControl.Overlay
              name="Show current location"
              checked={this.state['Show current location']}
            >
              <LayerGroup>
                {(positions || []).map(this.renderPositions)}
              </LayerGroup>
            </LayersControl.Overlay>
          ) : null}
        </LayersControl>
      </LeafletMap>
    );
  }
}
