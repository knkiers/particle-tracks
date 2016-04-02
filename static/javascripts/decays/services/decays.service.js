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
	    boundaryIntersectionAngles: boundaryIntersectionAngles
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

		phiList = boundaryIntersectionAngles(x0, y0, r, boundaries);
		if (phiList.length == 0) {
		    phiBorder = phi0 - 3*PI/2;
		} else {
		    var i;
		    var deltaPhi = 3*PI;// this will get reset
		    var deltaPhiTemp;
		    for (i = 0; i < phiList.length; i++) {
			deltaPhiTemp = (phi0 - phiList[i]+6*PI) % (2*PI);// adding 6*PI to be on the safe side
			if (deltaPhiTemp < deltaPhi) {
			    deltaPhi = deltaPhiTemp;
			    phiBorder = phi0 - deltaPhi;
			}
		    }
		}
		
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
	 * @desc calculates all angles at which the circle in question intersects with the boundary
	 * @inputs - r is the radius of the circle
	 *         - boundaries contains the boundaries of the region
	 *         - (x0, y0) is the center of the circle
         * @returns list of phi values

	 Duh -- make this much simpler.  Just step backwards/forwards 
	 from the interaction point along a given track until an edge is reached.
	 Easy-peasy.  Write a new function, isInsideBox.  When it turns
	 false, we've found our point.  If we go 3 Pi/2 without finding it, stop.


	 */
	function boundaryIntersectionAngles(x0, y0, r, boundaries) {
	    var phiList = [];
	    var dx, dy;
	    var xmin = boundaries.xmin;
	    var xmax = boundaries.xmax;
	    var ymin = boundaries.ymin;
	    var ymax = boundaries.ymax;
	    
	    if (x0 > xmin && xmin > x0-r) {// could be up to two intersections with the left boundary
		dy = Math.sqrt(r*r-(x0-xmin)*(x0-xmin));
		dx = xmin-x0;
		if (y0+dy < ymax) {
		    phiList.push(Math.atan2(dy,dx));
		}
		if (y0-dy > ymin) {
		    phiList.push(Math.atan2(-dy,dx));
		}
	    }
	    
	    if (x0 < xmax && xmax < x0+r) {// could be up to two intersections with the right boundary
		dy = Math.sqrt(r*r-(x0-xmax)*(x0-xmax));
		dx = xmax-x0;
		if (y0+dy < ymax) {
		    phiList.push(Math.atan2(dy,dx));
		}
		if (y0-dy > ymin) {
		    phiList.push(Math.atan2(-dy,dx));
		}
	    }

	    if (y0 > ymin && ymin > y0-r) {// could be up to two intersections with the bottom boundary
		dy = ymin-y0;
		dx = Math.sqrt(r*r-(y0-ymin)*(y0-ymin));
		if (x0+dx < xmax) {
		    phiList.push(Math.atan2(dy,dx));
		}
		if (x0-dx > xmin) {
		    phiList.push(Math.atan2(dy,-dx));
		}
	    }

	    if (y0 < ymax && ymax < y0+r) {// could be up to two intersections with the top boundary
		dy = ymax-y0;
		dx = Math.sqrt(r*r-(y0-ymax)*(y0-ymax));
		if (x0+dx < xmax) {
		    phiList.push(Math.atan2(dy,dx));
		}
		if (x0-dx > xmin) {
		    phiList.push(Math.atan2(dy,-dx));
		}
	    }

	    return phiList;

	}

	
    }


    
})();
