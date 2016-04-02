/**
 * EventGenerator
 * @namespace thinkster.decays.services
 */
(function () {
    'use strict';

    angular
	.module('thinkster.decays.services')
	.factory('GenerateEvent', GenerateEvent)
	.factory('DisplayEvent', DisplayEvent);

    GenerateEvent.$inject = ['$http'];



    
    /**
     * @namespace thinkster.decays.services
     * @returns {Factory}
     */
    function GenerateEvent($http) {
	var Event = {
	    get: get
	};

	return Event;

	////////////////////

	/**
	 * @name get
	 * @desc Get an event
	 * @returns {Promise}
	 * @memberOf thinkster.decays.services.GenerateEvent
	 * @reference http://stackoverflow.com/questions/13760070/
         *                 angularjs-passing-data-to-http-get-request
	 */
	function get(b_field, b_direction) {
	    return $http.get('/api/v1/generateevent/',{
		params: {
		    b_field: b_field,
		    b_direction: b_direction
		}
	    });
	}
    }

    /**
     * @namespace thinkster.decays.services
     * @returns {Factory}
     */
    function DisplayEvent() {
	var Event = {
	    pathParams: pathParams,
	    boundaryIntersectionAngle: boundaryIntersectionAngle
	};

	return Event;

	////////////////////

	/**
	 * @name get
	 * @desc Get an event
	 * @returns {Promise}
	 * @memberOf thinkster.decays.services.GenerateEvent
	 * @reference http://stackoverflow.com/questions/13760070/
         *                 angularjs-passing-data-to-http-get-request
	 */

	/** Math.atan2(y,x)
	 */

	/**
	 * @desc - direction is 'cw' or 'ccw', depending on the particle direction
	 *       - inout is 'incoming' or 'outgoing'
	 *       - (x0, y0) is the center of the circle
         *       - phi0 the angle from (x0, y0) to the interaction point, measured 
	 *         positive relative to the +x axis
         *       
	 */
	
	function pathParams(b_field, boundaries, interactionLocation, px, py, direction, inout) {
	    var p = Math.sqrt(px*px+py*py);
	    var r = p/(0.3*b_field);
	    var phi0, x0, y0, phiList;
	    var PI = Math.acos(-1);
	    var phiBorder;
	    if (direction == 'ccw' && inout == 'incoming') {
		phi0 = Math.atan2(-px, py); // phi0 = tan((-px)/py)
		x0 = interactionLocation.x - r*Math.cos(phi0);
		y0 = interactionLocation.y - r*Math.sin(phi0);
		phiBorder = boundaryIntersectionAngle(x0, y0, r, phi0, boundaries, direction, inout);
	    }

	    arcString = arcString(x0, y0, r, phi0, phiBorder, boundaries, interactionLocation, direction, inout);
	    return arcString;
 
	}

	/**
	 * @desc determines the string that will create the arc in SVG
	 * @inputs - r is the radius of the circle
	 *         - boundaries contains the boundaries of the region
	 *         - (x0, y0) is the center of the circle
         * @returns string
	 */
	function arcString(x0, y0, r, phi0, phiBorder, boundaries, interactionLocation, direction, inout) {
	    var PI = Math.acos(-1);
	    
	    var largeArcFlag = '0';
	    var deltaPhi = phi0 - phiBorder;
	    if (direction == 'ccw' && inout == 'incoming') {
		var xFinal = interactionLocation.x;
		var yFinal = interactionLocation.y;
		var xInitial = x0 + r*Math.cos(phiBorder);
		var yInitial = y0 + r*Math.sin(phiBorder);
		if (deltaPhi > PI) {// probably have to be more careful than this!!!
		    largeArcFlag = '1';
		}
		var sweepFlag = '0';
	    }
	    
	    var pixelFinal = translatecmtoPixels(xFinal, yFinal, boundaries);
	    var pixelInitial = translatecmtoPixels(xInitial, yInitial, boundaries);
	    var rPx = translateRadiuscmtoPixels(r, boundaries);
	    var arrayToStringify = ['M', pixelInitial.x, pixelInitial.y, 'A', rPx.toString(), rPx.toString(),
				    '0', largeArcFlag, sweepFlag, pixelFinal.x, pixelFinal.y];
	    var arcString = stringifyArray(arrayToStringify);
	    return arcString;
	}

	function translatecmtoPixels(x, y, boundaries) {
	    var xPx = boundaries.xminPx +
		(x-boundaries.xmin)*(boundaries.xmaxPx-boundaries.xminPx)/
		(boundaries.xmax-boundaries.xmin);
	    
	    var yPx = boundaries.yminPx -
		(y-boundaries.ymin)*(boundaries.yminPx-boundaries.ymaxPx)/
		(boundaries.ymax-boundaries.ymin);
	    
	    var pixelCoordsString = {'x': xPx.toString(), 'y': yPx.toString()};
	    return pixelCoordsString;
	}

	function translateRadiuscmtoPixels(r, boundaries) {//assume aspect ratio is 1!!!
	    return r*(boundaries.xmaxPx-boundaries.xminPx)/(boundaries.xmax-boundaries.xmin);
	}

	function stringifyArray(array) {
	    var returnString = '';
	    var i;
	    for (i=0; i<array.length; i++) {
		returnString += array[i]+' ';
	    }
	    return returnString;
	}

	/**
	 * @desc determines the first angle at which the circle in question intersects 
	 *       with a boundary; if there is no intersection by |Delta phi| = 3 pi/2, then
	 *       a value is put in by hand to correspond to |Delta phi| = 3 pi/2
	 * @inputs - r is the radius of the circle
	 *         - boundaries contains the boundaries of the region
	 *         - (x0, y0) is the center of the circle
         * @returns phi value
	 */
	function boundaryIntersectionAngle(x0, y0, r, phi0, boundaries, direction, inout) {
	    var phi;
	    var PI = Math.acos(-1);
	    var deltaPhiMax = 3*PI/2;
	    var phiStep = 0.01; //radians
	    var x, y;
	    x = x0 + r*Math.cos(phi0); // this is the interaction point
	    y = y0 + r*Math.sin(phi0);
	    if (!isInsideBoundingBox(x, y, boundaries)){
		return phi0;// hopefully this doesn't happen(!)
	    }

	    var inside = true;
	    phi = phi0;
	    var deltaPhi = 0;
	    while (inside == true && deltaPhi < deltaPhiMax) {
		if (direction == 'ccw' && inout == 'incoming') {
		    phi = phi - phiStep;
		    deltaPhi = (phi0 - phi + 6*PI) % (2*PI); // addin 6*PI to be on the safe side
		    x = x0 + r*Math.cos(phi);
		    y = y0 + r*Math.sin(phi);
		    inside = isInsideBoundingBox(x, y, boundaries);
		}
	    }
	    // phi now corresponds to a point slightly outside the bounding box, so reset it
	    phi = phi + phiStep;
	    return phi;
	}
	

	/**
	 * @desc determines whether or not a given coordinate is inside the bounding region
	 * @inputs - (x, y) are the coordinates of the point in question (in cm)
	 *         - boundaries contains the boundaries of the region
         * @returns boolean
	 */
	function isInsideBoundingBox(x, y, boundaries) {
	    if (x < boundaries.xmax &&
		x > boundaries.xmin &&
		y < boundaries.ymax &&
		y > boundaries.ymin) {
		return true;
	    } else {
		return false;
	    }
	}
	
    }


    
})();
