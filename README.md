# Geospatial Anchors for WebXR

All content in AR experiences needs to be anchored to something in the world, such as the user, an object, or a surface. One major class of content is content anchored at geospatial locations. Anchoring content at geospatial locations has been hampered by the geolocation API on modern phones; it's is relatively low accuracy (ranging for 2 - 50 meters), the error changes per location update, and updates happen slowly (typically once per second).  Using the raw gelocation data in the obvious way (i.e., compute the devices location relative to other geolocated content) results in geolocated content jumping around, sometimes dramatically, each second.

WebXR can help with two of these issues, the update speed and content appearing to jump around.  Since most geolocated content isn't precisely tied to an exact location (e.g., the geolocation of a restaurant is simply a point somewhere near that restaurant), the remaining inaccuracy is not often a significant problem.  We are not the first to observe this;  iOS developers, for example, have tried to combine [ARKit and CoreLocation](https://github.com/ProjectDent/ARKit-CoreLocation) since ARKit was released two years ago.

This library works in conjunction with WebXR, assuming three things:
- that the implementation of WebXR allows the developer to request that the coordinate system used by WebXR aligns with geospatial coordinates.  In the [WebXR Viewer](https://github.com/mozilla-mobile/webxr-ios) we allow the `alignEUS` option to control ARKit's ability to do this, so this library checks for the use of that session creation option.
- the existence of the [Web Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).  This is used for location.
- that [Cesium.js](https://cesiumjs.org) has been loaded, as the library uses Cesium.js for geospatial computations.   We use a stripped down version of Cesium.js that only includes the core math and data libraries, which you can find in the examples directory, or [here](https://github.com/blairmacintyre/cesium/tree/minimal-cesium-core)

(In theory, it may be possible to remove the requirement to have WebXR align with geospatial coordinates by doing the alignment in this library. This would require using the motion or sensor APIs to access the compass heading of the device, and set the orientation of the geospatial anchor nodes appropriately.  In practice, this will not work as well as having the platform do the alignment directly.)

## Setup

An app that wants to use geospatial anchors with WebXR should load Cesium.js, followed by the webxr-geospatial.js library.

```
    <script src="Cesium.js"></script>
    <script src="webxr-geospatial.js"></script>
```

When loaded, if WebXR exists and Cesium has been loaded, the library patches `requestSession` and `supportsSession` to look for the `geolocation` and `alignEUS` options.  If both are present, the library will attempt to initialize the Web GeoLocation API and use it to align WebXR coordinates with local geospatial coordinates.

To create an `XRGeospatialAnchor`, the developer should call `XRGeospatialAnchor.createGeoAnchor(cartographic)`, where `cartographic` is a Cesium `Cartographic` object.  If the `height` of the `cartographic` value is unknown, the developer should first call `let altitude = XRGeospatialAnchor.getDefaultElevation(cartographic)` and assign the `altitude` value to `cartographic.height`.  (A default value for height, such as 0, cannot denote `unknown` because height=0 is sea level).

## Aligning WebXR and Geospatial Coordinates

The library works be looking at the values returned by the web geolocation API, and attempting to align the WebXR coordinate system with the best location estimates.  In the default mode (see below for alternative modes), at any point in time there is a WebXR XRAnchor associated with a geolocation.  Together, these form the current `geoAnchor`.  The local coordinate system, which is assumed to be aligned with East-Up-South as best as the underlying platform can manage, is associated with a local geospatial coordinate from defined as a tangent plane to the earth located at the `geoAnchor`. 

All XRGeospatialAnchors are transformed into coordinates in the local geospatial coordinate frame, and updated when the `geoAnchor` changes.

The system currently uses a simple heuristic to update the `geoAnchor`. Each report from the Web Geolocation API includes a [Coordinates object](https://developer.mozilla.org/en-US/docs/Web/API/Coordinates) that includes both [horizontal](https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/accuracy) and [vertical](https://developer.mozilla.org/en-US/docs/Web/API/Coordinates/altitudeAccuracy) accuracy estimates.  When the accuracy of a new report is better than the accuracy of the current `geoAnchor`, a new `geoAnchor` is created using the report and the WebXR device location at the time of the report.  While this approach is not perfect (e.g., the accuracy values are estimates, and the actual accuracy of a report may be worse), it works reasonably well in practice.

## Other Modes of Operation

At times, it is useful to explicitly define the `geoAnchor`.  For example, if a trackable object is detected and at a known location (E.g., a wall of graffiti or known billboard) or if an application simply asks the user to stand at a known location (e.g., "to view the augmented historic site, begin by standing on the spot on the ground marked with an X").  This is especially useful indoors, where the accuracy of the location API is at its worst.

The API allows the developer to `overrideGeoLocation` to set the current geolocation of the user, `overrideGeoOrientation` to set the current orientation (overriding the WebXR orientation), or both (via `overrideGeoLocationOrientation`).  Normal operation can be restarted with `useDeviceGeolocation`.

## Default Elevation

Much geospatial data on the Web has only longitude and latitude associated with it.  To fill in missing altitude values, we use data from the [MapZen project](https://www.linuxfoundation.org/press-release/2019/01/mapzen-open-source-data-and-software-for-real-time-mapping-applications-to-become-a-linux-foundation-project/) to fill in missing Altitude values by interpolating across a global elevation dataset.  

If most of the data being used acquires its elevation this way, it may not be desirable to use the reported device altitude.  Altitude values are typically less accurate than long/lat values, and users would likely expect the data to align with their view of the world.  Therefore, developers can tell the library to `useEstimatedElevation` (including specifying an estimated height above the ground).

Using the default elevation for the user assumes that the user is at ground level.  If this is not the case, such as if the user is indoors in a multistory building, the system will still assume that the user is on ground level.  To ameliorate some side effects of this issue, as the user's WebXR coordinates change in Y over time, the system adjusts the `geoAnchor` so that the user's current height is mapped to the default elevation.  While not ideal, it ensures that geospatial data remains at a reasonable default elevation.