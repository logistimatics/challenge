import React from 'react';
import moment from 'moment';
import {Marker, Tooltip,} from 'react-leaflet';
import {latLng,} from 'leaflet';

export const Position = (device) => {
    const {
        latitude,
        longitude,
        address,
        positionAt,
        id,
        name,
        batteryPercentage
    } = device;
    console.log('device', device)
    console.log('device', id, name, latitude, longitude, address, positionAt, batteryPercentage)
    if (latitude || longitude) {
        const lat = latitude;
        const lng = longitude

        return <Marker
            key={`${id}`}
            iconSize={100}
            position={latLng({lat, lng})}>
            <Tooltip
                permanent={true}
                direction="top"
                maxWidth={240}
                autoPan={false}
                closeButton={false}
                autoClose={false}
                closeOnClick={false}
                interactive={true}>
                <div>
                    <div><b>{name || 'Unknown device'}</b> {`(${Math.round(batteryPercentage)}%)`}</div>
                    {address ? <div className="small"><a
                        href={`https://maps.google.com/maps?q=${latitude},${longitude}`}>{address}</a></div> : null}
                    {positionAt ? <div
                        className="small">Updated: {moment(positionAt).format('ddd MMM D, h:mma')}</div> : null}
                </div>
            </Tooltip>
        </Marker>
    }

    console.log('nonono', latitude, longitude, address, positionAt, id, name, batteryPercentage)

}

