import { useEffect, useState } from "react";
import "./App.scss";
import { Textbox } from "./components/Textbox/Textbox";
import { Restaurants } from "./components/Resturants/Restaurants";
import { Map } from "./components/Map/Map";

function App() {
  const [location, setLocation] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [placesDetails, setPlacesDetails] = useState([]);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [firstTime, setFirstTime] = useState(true);

  const API_KEY = `AIzaSyAdykJxC4DxbPABX4pUcVCWdAkJByirVU0`;

  let map;
  let infowindow;
  let service;
  let geocoder;

  useEffect(() => {
    // Ask for user location
    if (firstTime) {
      onCurrentLocation();
    }

    if (lat !== 0 || lng !== 0) {
      renderMap();
    }
  }, [lat, lng]);

  const handleChange = (val) => {
    setLocation(val);
  };

  const onSearch = () => {
    setSearchLocation(location);
  };

  const onCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLocation("Current");
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    });
  };

  const renderMap = () => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`
    );

    window.initMap = initMap;
  };

  const initMap = () => {
    // Default Location
    let location = {
      lat,
      lng,
    };

    // Initialize Map
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: location,
      zoom: 15,
    });

    // Current Location Marker
    let marker = new window.google.maps.Marker({
      position: location,
      map: map,
      title: "You're Here!",
    });

    map.addListener("center_changed", () => {
      // 3 seconds after the center of the Map has changed, pan back to the
      // marker.
      window.setTimeout(() => {
        map.panTo(marker.getPosition());
      }, 5000);
    });

    map.addListener("click", (mapsMouseEvent) => {
      setFirstTime(false);
      setLat(mapsMouseEvent.latLng.lat());
      setLng(mapsMouseEvent.latLng.lng());
    });
    // Request Info: It will be used for Google Places API `PlacesServices` to get certain places that match our criteria
    let request = {
      location: location,
      type: ["restaurant"],
      radius: 5000,
    };
    infowindow = new window.google.maps.InfoWindow();
    service = new window.google.maps.places.PlacesService(map);
    geocoder = new window.google.maps.Geocoder();

    geocoder
      .geocode({ location: { lat, lng } })
      .then((response) => {
        if (response.results[0]) {
          setSearchLocation(response.results[0].formatted_address);
        } else {
          window.alert("No results found");
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));

    service.nearbySearch(request, fetchRestaurants);
  };

  const fetchRestaurants = (results, status) => {
    setPlacesDetails([]);
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      let placesInfo = [];
      let fields = [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "rating",
        "user_ratings_total",
        "reviews",
        "photo",
        "place_id",
        "geometry",
      ];

      // Get Places Details
      results.map((place) => {
        setTimeout(() => {
          if (placesInfo.length <= 10) {
            service.getDetails(
              { placeId: place.place_id, fields },
              async function (placeInfo, status) {
                if (
                  status === window.google.maps.places.PlacesServiceStatus.OK
                ) {
                  debugger;
                  setTimeout(() => {}, 1000);
                  placesInfo.push(placeInfo);
                  // Update All Places & Add Markersx
                  setPlacesDetails((prev) => {
                    return [...new Set([...prev, ...placesInfo])];
                  });
                  addMarkers(placesInfo);
                }
              }
            );
          }
        }, 500);
      });
    }
  };

  const createMarker = (place) => {
    var marker = new window.google.maps.Marker({
      map: map,
      title: place.name,
      icon: {
        url: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
        anchor: new window.google.maps.Point(10, 10),
        scaledSize: new window.google.maps.Size(20, 20),
      },
      position: place.geometry.location,
    });

    marker.addListener("click", function () {
      var request = {
        reference: place.reference,
      };

      let placePicture = place.photos
        ? place.photos[0].getUrl({ maxWidth: 300, maxHeight: 300 })
        : "https://via.placeholder.com/300";

      let content = `
        <h2>${place.name}</h2>
        <img src=${placePicture}>
        <ul>
          <li>${place.formatted_address}</li>
          <li>${place.formatted_phone_number}</li>
        </ul>
      `;
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });
  };

  const addMarkers = (placesDetails) => {
    placesDetails.forEach(createMarker);
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Nearby Restaurants App</h1>
        <h3 id="location">
          {firstTime
            ? "Showing restaurants near you. Select another location on map to show restaurants around that. (You can view it  below or on the map. Click on the number to place call.)"
            : "Showing restaurants around the selected location. (You can view it  below or on the map. Click on the number to place call.)"}
        </h3>

        {/*<Textbox*/}
        {/*  type="text"*/}
        {/*  value={location}*/}
        {/*  onChange={handleChange}*/}
        {/*  placeholder="Search"*/}
        {/*  label="Location"*/}
        {/*  onSearch={onSearch}*/}
        {/*  useCurrent={onCurrentLocation}*/}
        {/*/>*/}
        <h2 id="location"> Your chosen location: {searchLocation} </h2>
        <div id="row">
          {placesDetails?.length > 0 ? (
            <Restaurants placesData={placesDetails} />
          ) : (
            <h3 id="location"> No Restaurants found within 5KM Radius</h3>
          )}
          <Map />
        </div>
      </header>
    </div>
  );
}

function loadScript(url) {
  let index = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
