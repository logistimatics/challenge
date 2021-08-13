import React, { useState } from 'react';
import get from 'lodash.get';
import { withDeviceLocations } from '../queries';
import Map from '../components/Map';
import ReactDatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

const Devices = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date('06/24/2020'));
  return (
    <div className="container">
      <div style={{ marginBottom: 300 }}>
        <ReactDatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
      </div>
      <div className="col-12">
        <Map selectedDate={selectedDate} devices={get(props, ['data', 'allDevices', 'nodes'], [])} />
      </div>
    </div>
  );
}

export default withDeviceLocations(Devices);
