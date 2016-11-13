import React from 'react';
import {render} from 'react-dom';
import {GoogleMapLoader, GoogleMap, Polyline} from 'react-google-maps';

export default function Map (props) {
  return (
    <section style={{height: "100%"}}>
      <GoogleMapLoader
        containerElement={
          <div
            {...props.containerElementProps}
            style={{
              height: "100%",
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => console.log(map)}
            defaultZoom={13}
            center={{ lat: props.run.start_latlng[0], lng: props.run.start_latlng[1] }}
            onClick={props.onMapClick}
          >
            <Polyline
              path={decodePath(props.run.map.summary_polyline)}
              levels={decodeLevels('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB')}
              strokeColor={'#e1f5fe'}
              strokeOpacity={1.0}
              strokeWeight={2}
            />
          </GoogleMap>
        }
      />
    </section>
  );
}

class Run extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onRunChange(this.props.run)
  }

  render () {
    var name = this.props.run.name;
    var date = this.props.run.start_date_local;

    return (
      <a onClick={this.handleClick}>{name} {getDate(date)}</a>
    )
  }
}

class RunList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <ol>
        {this.props.runs.map((run) => {
          return <li key={run.id}>
                    <Run run={run} onRunChange={this.props.onRunChange}/>
                  </li>
        })}
      </ol>
    )
  }
}

class RunStats extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
   return (
      <div>
        <h2>{this.props.run.name} Stats</h2>
        <ul>
          <li>{getDate(this.props.run.start_date_local)}</li>
          <li>{getDistance(this.props.run.distance)}</li>
        </ul>
      </div>
    )
  }
}

$.get('/runs', function (runs) {
  class RunTracker extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        run: runs[0]
      }

      this.handleRunChange = this.handleRunChange.bind(this);
    }

    handleRunChange(run) {
      this.setState({
        run: run
      });
    }

    render () {
      return (
        <div>
          <RunList runs={runs} onRunChange={this.handleRunChange}/>
          <Map run={this.state.run}/>
          <RunStats run={this.state.run}/>
        </div>
      )
    }
  }

  render(<RunTracker/>, document.getElementById('main'))
});

$.get('/beacon', function (res) {
  console.log(res);
});

function decodePath (pathString) {
  return google.maps.geometry.encoding.decodePath(pathString);
}

function decodeLevels (encodedLevelsString) {
  var decodedLevels = [];

  for (var i = 0; i < encodedLevelsString.length; ++i) {
    var level = encodedLevelsString.charCodeAt(i) - 63;
    decodedLevels.push(level);
  }
  return decodedLevels;
}

function getDistance (meters) {
  return (meters / 1609.34).toFixed(2) + ' Miles';
}

function getDate (date) {
  var d = new Date(date);

  return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
}
