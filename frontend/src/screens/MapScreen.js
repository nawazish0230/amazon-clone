/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import LoadingBox from "../components/LoadingBox";
import {
  LoadScript,
  GoogleMap,
  StandaloneSearchBox,
  Marker,
} from "@react-google-maps/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { CART_ADDRESS_TYPE_CONFIRM } from "../constants/cartConstant";

const libs = ["places"];
const defaultLocation = { lat: 23.344101, lng: 85.309563 };

const MapScreen = () => {
  const dispatch = useDispatch();

  const [googleApiKey, setGoogleApiKey] = useState("");
  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(async () => {
    const { data } = await axios.get("/api/config/google");
    setGoogleApiKey(data);
    getUserCurrentLocation();
  }, []);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };

  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };

  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };

  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({
      lat: place.lat(),
      lng: place.lng(),
    });
    setLocation({
      lat: place.lat(),
      lng: place.lng(),
    });
  };

  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      alert("Sucess");
      dispatch({
        type: CART_ADDRESS_TYPE_CONFIRM,
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
    } else {
      alert("error");
    }
  };

  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("geolocation not supported by the browser");
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  return googleApiKey ? (
    <div className="full-container">
      <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{
            height: "100%",
            width: "100%",
          }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <div className="map-input-box">
              <input type="text" placeholder="Enter Your Address" />
              <button type="button" className="primary" onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </StandaloneSearchBox>
          <Marker position={location} onLoad={onMarkerLoad}></Marker>
        </GoogleMap>
      </LoadScript>
    </div>
  ) : (
    <LoadingBox></LoadingBox>
  );
};

export default MapScreen;
