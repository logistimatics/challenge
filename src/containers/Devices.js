import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import get from 'lodash.get';
import moment from 'moment';
import { DEVICE_LOCATIONS } from '../queries';
import Map from '../components/Map';
import ReactDatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";

const SuperDevice = (props) => (
  <div className="container">
    <div style={{ marginBottom: 300 }}>
      <div>lat,lng</div>
    </div>
    <div className="col-12">
      <Map devices={get(props, ['data', 'allDevices', 'nodes'], [])} />
    </div>
  </div>
);

const Devices = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date('2020-06-20'));
  const { loading, error, data } = useQuery(DEVICE_LOCATIONS, {
    variables: {
      lower: moment(selectedDate).startOf('D').toDate(),
      upper: moment(selectedDate).endOf('D').toDate()
    }
  });

  return (
    <div className="container">
      <div style={{ marginBottom: 300 }}>
        <ReactDatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
      </div>
      <div className="col-12">
        <Map
          selectedDate={selectedDate}
          positions={get(data, ['positionsByDateRange', 'nodes'], [])}
        />
      </div>
    </div>
  );
};

export default Devices;
