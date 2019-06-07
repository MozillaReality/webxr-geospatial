/**
 * @license
 * webxr-ios-js
 * Copyright (c) 2019 Mozilla Inc. All Rights Reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. 
 */

/**
 * @license
 * webxr-polyfill
 * Copyright (c) 2017 Google
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.XRGeospatialAnchor = factory());
}(this, (function () { 'use strict';

let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;


const degree = Math.PI / 180;

function create() {
  let out = new ARRAY_TYPE(16);
  if(ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }
  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
















function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}







function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}

function create$1() {
  let out = new ARRAY_TYPE(9);
  if(ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }
  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}

function create$2() {
  let out = new ARRAY_TYPE(3);
  if(ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }
  return out;
}




function set$2(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add$2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract$2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}





















function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function transformMat3(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}















const forEach = (function() {
  let vec = create$2();
  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 3;
    }
    if(!offset) {
      offset = 0;
    }
    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }
    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
    }
    return a;
  };
})();

function MapzenTerrariumTerrainProvider(options) {
    this._token = options.token;
    this._url = options.url;
    var resource = Cesium.Resource.createIfNeeded(options.url);
    this._resource = resource;
    this._tilingScheme = options.tilingScheme;
    if (!Cesium.defined(this._tilingScheme)) {
        this._tilingScheme = new Cesium.WebMercatorTilingScheme({
            numberOfLevelZeroTilesX:1,
            numberOfLevelZeroTilesY:1,
            ellipsoid : Cesium.defaultValue(options.ellipsoid, Cesium.Ellipsoid.WGS84)
        });
    }
    this._heightmapWidth = 64;
    this._levelZeroMaximumGeometricError = Cesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(this._tilingScheme.ellipsoid, this._heightmapWidth, this._tilingScheme.getNumberOfXTilesAtLevel(0));
    this._proxy = options.proxy;
    this._terrainDataStructure = {
        heightScale : 1.0 / 256.0,
        heightOffset : -32768.0,
        elementsPerHeight : 3,
        stride : 4,
        elementMultiplier : 256.0,
        isBigEndian : true,
        lowestEncodedHeight : 0,
        highestEncodedHeight : 256 * 256 * 256 - 1
    };
    this._errorEvent = new Cesium.Event();
    var credit = options.credit;
    if (typeof credit === 'string') {
        credit = new Cesium.Credit(credit);
    }
    this._credit = credit;
    this._readyPromise = Promise.resolve(true);
    this._terrainPromises = {};
}
Object.defineProperties(MapzenTerrariumTerrainProvider.prototype, {
    errorEvent : {
        get : function() {
            return this._errorEvent;
        }
    },
    credit : {
        get : function() {
            return this._credit;
        }
    },
    tilingScheme : {
        get : function() {
            return this._tilingScheme;
        }
    },
    ready : {
        get : function() {
            return true;
        }
    },
    readyPromise : {
        get : function() {
            return this._readyPromise;
        }
    },
    hasWaterMask : {
        get : function() {
            return false;
        }
    },
    hasVertexNormals : {
        get : function() {
            return false;
        }
    }
});
MapzenTerrariumTerrainProvider.prototype.requestTileGeometry = function(x, y, level, request) {
    var url = this._url+level+'/'+x+'/'+y+'.png';
    var proxy = this._proxy;
    if (Cesium.defined(proxy)) {
        url = proxy.getURL(url);
    }
    var resource = this._resource.getDerivedResource({
        url : url,
        queryParameters : {
            cesium : true
        },
        request : request
    });
    var promise = resource.fetchImage({
        preferImageBitmap: true
    });
    if (!Cesium.defined(promise)) {
        return undefined;
    }
    var that = this;
    return promise.then(function(image) {
        return new Cesium.HeightmapTerrainData({
            buffer : Cesium.getImagePixels(image, that._heightmapWidth, that._heightmapWidth),
            width : that._heightmapWidth,
            height : that._heightmapWidth,
            childTileMask : level < 16 ? 0 : 15,
            structure : that._terrainDataStructure
        });
    });
};
MapzenTerrariumTerrainProvider.prototype.getLevelMaximumGeometricError = function(level) {
    return this._levelZeroMaximumGeometricError / (1 << level);
};
MapzenTerrariumTerrainProvider.prototype.getTileDataAvailable = function(x, y, level) {
    return level < 16 ? true : undefined;
};

const _global = typeof global !== 'undefined' ? global :
                typeof self !== 'undefined' ? self :
                typeof window !== 'undefined' ? window : {};

var XRAnchor = null;
var XRDevice = null;
if (_global["XRAnchor"] !== undefined) var XRAnchor = _global.XRAnchor;
if (_global["XRDevice"] !== undefined) var XRDevice = _global.XRDevice;
function _patchXRDevice() {
    XRDevice = _global.XRDevice;
    var __XRDevice_requestSession = XRDevice.prototype.requestSession;
    XRDevice.prototype.requestSession = async function (options) {
        let bindrequest = __XRDevice_requestSession.bind(this);
        let session = await bindrequest(options);
        if (window.hasOwnProperty("Cesium") && options.alignEUS && options.geolocation) {
            const onSessionEnd = () => {
                _XRsession = null;
                if (_watchID) {
                    navigator.geolocation.clearWatch(_watchID);
                    _watchID = 0;
                }
                resetState();
                session.removeEventListener('end', onSessionEnd);
            };
            session._useGeolocation = true;
            session.addEventListener('end', onSessionEnd);
            await useSession(session);
        }
        return session
    };
    var __XRDevice_endSession = XRDevice.prototype.endSession;
    XRDevice.prototype.endSession = function(sessionId) {
        let bindrequest = __XRDevice_endSession.bind(this);
        let ret = bindrequest(sessionId);
        if (session._useGeolocation) {
            XRGeospatialAnchor.closeSession();
        }
        return ret
    };
    var __XRDevice_supportsSession = XRDevice.prototype.supportsSession;
    XRDevice.prototype.supportsSession = async function (options={}) {
        let bindrequest = __XRDevice_supportsSession.bind(this);
        let newOptions = Object.assign({}, options);
        var _wantsGeo = false;
        if (options.hasOwnProperty("geolocation")) {
            _wantsGeo = true;
            delete newOptions.geolocation;
        }
        let ret = await bindrequest(options);
        if (!_wantsGeo || options.hasOwnProperty("alignEUS")) {
            return true
        } else {
            throw(null)
        }
    };
}
async function useSession(session) {
    _XRsession = session;
    if (!_eastUpSouthToFixedFrame) {
        _eastUpSouthToFixedFrame = Cesium.Transforms.localFrameToFixedFrameGenerator('east','up');
    }
    if (!defaultTerrainProvider) {
        defaultTerrainProvider = new MapzenTerrariumTerrainProvider({
            url : 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/',
            requestWaterMask : true,
            requestVertexNormals : true
        });
    }
    try {
        let _headLevelFrameOfReference = await session.requestFrameOfReference('head-model');
        _eyeLevelFrameOfReference = await session.requestFrameOfReference('eye-level');
        if (!("geolocation" in navigator)) {
            return false
        }
        _watchID = navigator.geolocation.watchPosition(updatePositionCallback, geoErrorCallback, _geo_options);
        return true;
    } catch (err) {
        console.error("Can't start geolocation to XR mapping", err);
        return false;
    }
}
const _geo_options = {
    enableHighAccuracy: true,
    maximumAge        : 30000
};
const _identity = create();
var _scratchVec3 = create$2();
var _scratch2Vec3 = create$2();
var _scratchMat4 = create();
var _scratchMat3 = create$1();
var _scratchCartesian = null;
var _XRsession = null;
var _geoOrigin = null;
var _geoOriginAnchor = null;
var _geoCartesian = null;
var _geoAnchorsWaiting = [];
var _eastUpSouthToFixedFrame = null;
var _fixedToLocal = create();
var _localToFixed = create();
var _eyeLevelFrameOfReference = null;
var _overrideGeolocation = false;
var _overrideCartesian = null;
var _overrideLocationAnchor = null;
var _overrideGeoOrientation = false;
var _overrideOrientationAnchor = null;
var _watchID = 0;
function currentGeoOriginAnchor() {
    return _overrideGeolocation ? _overrideLocationAnchor : _geoOriginAnchor
}
function currentGeoOriginCartesian() {
    
}
function resetState() {
    _geoOrigin = null;
    _geoOriginAnchor = null;
    _overrideGeolocation = false;
    _overrideGeoOrientation = false;
    _geoAnchorsWaiting = [];
}
async function getAltitude(cart) {
    var _altScratchCart = Cesium.Cartographic.clone(cart, _altScratchCart);
    await updateHeightFromTerrain(_altScratchCart);
    return _altScratchCart.height
}
var defaultTerrainProvider = null;
function updateHeightFromTerrain(cartographic) {
    return Promise.resolve(Cesium.sampleTerrain(defaultTerrainProvider, 15, [cartographic]).then(results => {
        return results[0]
    }))
}
async function cartographicToFixed(longitude, latitude, altitude=null) {
    if (!altitude) {
        let cart = Cesium.Cartographic.fromDegrees(longitude,latitude);
        altitude = await getAltitude(cart);
    }
    return Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
}
function updateECEFToLocal(cartesian) {
    _eastUpSouthToFixedFrame(cartesian, undefined, _localToFixed);
    Cesium.Matrix4.inverseTransformation(_localToFixed, _fixedToLocal);
}
 function sendNewGeoAnchorEvent (oldAnchor, newAnchor) {
    try {
        oldAnchor.dispatchEvent( "newGeoAnchor", {
            oldAnchor: oldAnchor,
            newAnchor: newAnchor
         });
    } catch(e) {
        console.error('newGeoAnchor event error', e);
    }
 }
 function updateGeoCartesian(cartesian, anchor) {
    updateECEFToLocal(cartesian);
    for (let i = 0; i < _geoAnchorsWaiting.length; i++) {
        const callback = _geoAnchorsWaiting[i];
        try {
            callback();
        } catch(e) {
            console.error("lazy finalization of geoanchor failed: ", e);
        }
    }
    _geoAnchorsWaiting = [];
    try {
        anchor.dispatchEvent( "updateCartesian");
    } catch(e) {
        console.error('updateCartesian event error', e);
    }
 }
var _useEstimatedElevationForViewer = false;
var _savedViewHeight = 0;
var _savedHeightOffset = 0;
async function _useEstimatedElevation(setting, offsetFromGround) {
    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
    if (_useEstimatedElevationForViewer != setting) {
        _useEstimatedElevationForViewer = setting;
        _savedHeightOffset = offsetFromGround;
        if (_geoOrigin) {
            if (_useEstimatedElevationForViewer) {
                _geoOrigin.coords.altitude = _savedViewHeight;
            }
            while (_updateOrigin) {
                await sleep(1);
                await updatePositionCallback(_geoOrigin, true);
            }
        }
    } else if (_useEstimatedElevation) {
        _updateOffsetFromGround(offsetFromGround);
    }
}
async function _updateOffsetFromGround (offsetFromGround) {
    if (_useEstimatedElevationForViewer) {
        var offsetDiff = offsetFromGround - _savedHeightOffset;
        _savedHeightOffset += offsetDiff;
        if (_geoOrigin) {
            _geoOrigin.coords.altitude += offsetDiff;
            let _headLevelFrameOfReference = await _XRsession.requestFrameOfReference('head-model');
            _headLevelFrameOfReference.getTransformTo(_eyeLevelFrameOfReference, _scratchMat4);
            getTranslation(_scratchVec3, _scratchMat4);
            getTranslation(_scratch2Vec3, currentGeoOriginAnchor().modelMatrix);
            subtract$2(_scratchVec3, _scratchVec3, _scratch2Vec3);
            var yAtDevice = _scratchVec3[1];
            transformMat4(_scratch2Vec3, _scratchVec3, _geoOrigin._localToFixed);
            _scratchCartesian = Cesium.Cartesian3.unpack(_scratch2Vec3, 0, _scratchCartesian);
            let cart = Cesium.Cartographic.fromCartesian(_scratchCartesian);
            let defaultHeight = await getAltitude(cart) + offsetFromGround;
            let diffXR = yAtDevice;
            let diffGeo = defaultHeight - _geoOrigin.coords.altitude;
            _scratchVec3[0] = _scratchVec3[2] = 0;
            _scratchVec3[1] = offsetDiff;
            _scratchVec3[1] += (diffGeo - diffXR);
            transformMat4(_geoCartesian, _scratchVec3, _geoOrigin._localToFixed);
            if (!_overrideGeolocation) {
                updateGeoCartesian(_geoCartesian, _geoOriginAnchor);
            }
        }
    }
}
var _updatingOrigin = false;
var _geoAnchorDeleted = false;
async function updatePositionCallback (position, force=false)
{
    if (!_updatingOrigin &&
        (!_geoOrigin || _geoAnchorDeleted || force ||
            _geoOrigin.coords.accuracy > position.coords.accuracy ||
            (_geoOrigin.coords.accuracy == position.coords.accuracy &&
                _geoOrigin.coords.altitudeAccuracy > position.coords.altitudeAccuracy))) {
        _updatingOrigin = true;
        position = {
            timestamp: position.timestamp,
            coords: {
                altitude: position.coords.altitude,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed
            }
        };
        try {
            if (_useEstimatedElevationForViewer) {
                _savedViewHeight = position.coords.altitude;
                let _scratchCartographic = Cesium.Cartographic.fromDegrees(position.coords.longitude, position.coords.latitude, position.coords.altitude);
                await updateHeightFromTerrain(_scratchCartographic);
                position.coords.altitude = _scratchCartographic.height + _savedHeightOffset;
                position.cartesian = Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, position.coords.altitude);
                position._fixedToLocal = create();
                position._localToFixed = create();
                _eastUpSouthToFixedFrame(position.cartesian, undefined, position._localToFixed);
                Cesium.Matrix4.inverseTransformation(position._localToFixed, position._fixedToLocal);
            }
            console.log("new geo anchor: ", position.coords);
            let _headLevelFrameOfReference = await _XRsession.requestFrameOfReference('head-model');
            let newAnchor = await _XRsession.addAnchor(_identity, _headLevelFrameOfReference);
            _geoAnchorDeleted = false;
            newAnchor.addEventListener("remove", _handleGeoAnchorDelete);
            newAnchor._isInternalGeoAnchor = true;
            if (!_overrideGeolocation && _geoOriginAnchor) {
                sendNewGeoAnchorEvent (_geoOriginAnchor, newAnchor);
                await _XRsession.removeAnchor(_geoOriginAnchor);
            }
            _geoOriginAnchor = newAnchor;
            _geoOrigin = position;
            _geoCartesian = await cartographicToFixed(position.coords.longitude, position.coords.latitude, position.coords.altitude);
            if (!_overrideGeolocation) {
                updateGeoCartesian(_geoCartesian, _geoOriginAnchor);
            }
            _updatingOrigin = false;
        } catch(e) {
            _updatingOrigin = false;
            console.error("error setting the geospatial origin: ", e);
        }
    }
}
function _handleGeoAnchorDelete() {
    console.log("geoAnchor deleted by system, will use next geospatial report");
    _geoAnchorDeleted = true;
}
function geoErrorCallback (positionError)
{
    switch(positionError.code) {
        case 1:
        case 2:
        case 3:
    }
    console.error("watchPosition failed: ", positionError.message);
}
function generateUID() {
    return 'geoAnchor-' + new Date().getTime() + '-' + Math.floor((Math.random() * Number.MAX_SAFE_INTEGER))
}
function enqueueOrExec(callback) {
    if (_geoOrigin) {
        callback();
    } else {
        _geoAnchorsWaiting.push(callback);
    }
}
class XRGeospatialAnchor extends XRAnchor {
    constructor(cartographic) {
		let uid = generateUID();
        super(_identity, uid);
        this._cartographic = cartographic;
        this._localCartesian = create$2();
        this._cartesian = Cesium.Cartographic.toCartesian(cartographic);
        this._newGeoOriginNotifier = this._newGeoAnchor.bind(this);
        this._updateCartesianNotifier = this._updateLocalCartesian.bind(this);
        this._updateLocalNotifier = this._updateLocalMatrix.bind(this);
        let anchor = currentGeoOriginAnchor();
        anchor.addEventListener("newGeoAnchor", this._newGeoOriginNotifier);
        anchor.addEventListener("updateCartesian", this._updateCartesianNotifier);
        anchor.addEventListener("update", this._updateLocalNotifier);
        this._updateLocalCartesian();
    }
    _newGeoAnchor(event) {
        event.oldAnchor.removeEventListener("newGeoAnchor", this._newGeoOriginNotifier);
        event.oldAnchor.removeEventListener("updateCartesian", this._updateCartesianNotifier);
        event.oldAnchor.removeEventListener("update", this._updateLocalNotifier);
        event.newAnchor.addEventListener("newGeoAnchor", this._newGeoOriginNotifier);
        event.newAnchor.addEventListener("updateCartesian", this._updateCartesianNotifier);
        event.newAnchor.addEventListener("update", this._updateLocalNotifier);
    }
    _updateLocalCartesian() {
        set$2(_scratchVec3, this._cartesian.x, this._cartesian.y, this._cartesian.z);
        transformMat4(this._localCartesian, _scratchVec3, _fixedToLocal);
        if (_overrideGeoOrientation) {
            fromMat4(_scratchMat3, _overrideOrientationAnchor.modelMatrix);
            transformMat3(this._localCartesian, this._localCartesian, _scratchMat3);
        }
        this._updateLocalMatrix();
    }
    _updateLocalMatrix() {
        getTranslation(_scratchVec3, currentGeoOriginAnchor().modelMatrix);
        add$2(_scratchVec3, _scratchVec3, this._localCartesian);
        fromTranslation(_scratchMat4, _scratchVec3);
        super.updateModelMatrix(_scratchMat4, currentGeoOriginAnchor.timeStamp);
    }
    get cartographic () {
        if (this._cartographic == null) {
            this._cartographic = Cesium.Cartographic.fromCartesian(this._cartesian);
        }
        return this._cartographic
    }
    set cartographic (cartographic) {
        this._cartographic = cartographic;
        this._cartesian = Cesium.Cartographic.toCartesian(cartographic);
        this._updateLocalCartesian();
    }
    get cartesian () { return this._cartesian}
    set cartesian (cartesian) {
        this._cartesian = cartesian;
        this._cartographic = null;
        this._updateLocalCartesian();
    }
    static getGeoOriginPose() {
        if (currentGeoOriginAnchor()) {
            return currentGeoOriginAnchor().modelMatrix
        } else {
            return _identity
        }
    }
    static getOriginCartesian() {
        return currentGeoOriginCartesian()
    }
    static createGeoAnchor(cartographic) {
        return new Promise((resolve, reject) => {
            if (!window.hasOwnProperty("Cesium")) {
                var e = "must load Cesium.js for XRGeospatialAnchor to work";
                console.error (e);
                reject(e);
            }
            const createAnchor = () => {
                resolve(new XRGeospatialAnchor(cartographic));
            };
            enqueueOrExec(createAnchor);
        })
    }
    static useEstimatedElevation(setting, offsetFromGround=0) {
        return _useEstimatedElevation(setting, offsetFromGround)
    }
    static updateOffsetFromGround(offsetFromGround) {
        return _updateOffsetFromGround(offsetFromGround)
    }
    static overrideGeoOrientation(anchor){
        _overrideGeoOrientation = true;
        _overrideOrientationAnchor = anchor;
        if (_overrideGeolocation) {
            updateGeoCartesian(_overrideCartesian, _overrideLocationAnchor);
        } else if (_geoOrigin) {
            updateGeoCartesian(_geoCartesian, _geoOriginAnchor);
        }
    }
    static overrideGeoLocation (cartesian, anchor) {
        if (!_overrideGeolocation && _geoOriginAnchor) {
            sendNewGeoAnchorEvent (_geoOriginAnchor, anchor);
        } else if (_overrideGeolocation) {
            sendNewGeoAnchorEvent (_overrideLocationAnchor, anchor);
        }
        _overrideGeolocation = true;
        _overrideCartesian = cartesian;
        _overrideLocationAnchor = anchor;
        updateGeoCartesian(_overrideCartesian, _overrideLocationAnchor);
    }
    static overrideGeoLocationOrientation(cartesian, anchor) {
        if (!_overrideGeolocation && _geoOriginAnchor) {
            sendNewGeoAnchorEvent (_geoOriginAnchor, anchor);
        } else if (_overrideGeolocation) {
            sendNewGeoAnchorEvent (_overrideLocationAnchor, anchor);
        }
        _overrideGeoOrientation = true;
        _overrideOrientationAnchor = anchor;
        _overrideGeolocation = true;
        _overrideCartesian = cartesian;
        _overrideLocationAnchor = anchor;
        updateGeoCartesian(_overrideCartesian, _overrideLocationAnchor);
    }
    static useDeviceGeolocation() {
        if (_overrideGeolocation && _geoOriginAnchor) {
            sendNewGeoAnchorEvent (_overrideLocationAnchor, _geoOriginAnchor);
        }
        _overrideGeoOrientation = false;
        _overrideOrientationAnchor = null;
        _overrideGeolocation = false;
        _overrideCartesian = null;
        _overrideLocationAnchor = null;
        if (_geoOrigin) {
            updateGeoCartesian(_geoCartesian, _geoOriginAnchor);
        }
    }
    static async getDefaultElevation(cartographic) {
        return await getAltitude(cartographic)
    }
    static getDeviceElevation () {
        return new Promise((resolve, reject) => {
            enqueueOrExec( () => {
                _XRsession.requestFrameOfReference('head-model').then(_headLevelFrameOfReference => {
                    _headLevelFrameOfReference.getTransformTo(_eyeLevelFrameOfReference,_scratchMat4);
                    getTranslation(_scratchVec3, _scratchMat4);
                    let deviceLocalY = _scratchVec3[1];
                    getTranslation(_scratchVec3, currentGeoOriginAnchor().modelMatrix);
                    let geoAnchorY = _scratchVec3[1];
                    let altitudeDiff = deviceLocalY - geoAnchorY;
                    resolve(_geoOrigin.coords.altitude + altitudeDiff);
                });
            });
        })
    }
    static async getDeviceCartographic() {
        return new Promise((resolve, reject) => {
            enqueueOrExec( () => {
                _XRsession.requestFrameOfReference('head-model').then(_headLevelFrameOfReference => {
                    _headLevelFrameOfReference.getTransformTo(_eyeLevelFrameOfReference, _scratchMat4);
                    getTranslation(_scratchVec3, _scratchMat4);
                    getTranslation(_scratch2Vec3, currentGeoOriginAnchor().modelMatrix);
                    subtract$2(_scratchVec3, _scratchVec3, _scratch2Vec3);
                    transformMat4(_scratchVec3, _scratchVec3, _localToFixed);
                    _scratchCartesian = Cesium.Cartesian3.unpack(_scratchVec3, 0, _scratchCartesian);
                    resolve(Cesium.Cartographic.fromCartesian(_scratchCartesian));
                });
            });
        })
    }
}
if (_global["XRGeospatialAnchr"] !== undefined) {
    console.warn(`XRGeospatialAnchor already defined on global.`);
} else if (_global["XRAnchor"] !== undefined && _global["XRDevice"] !== undefined) {
    _patchXRDevice();
    window["XRGeospatialAnchor"] = XRGeospatialAnchor;
}

return XRGeospatialAnchor;

})));
