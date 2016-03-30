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
	
	function pathParams(b_field, boundaries, decayLocation, px, py, direction, inout) {
	    var p = Math.sqrt(px*px+py*py);
	    var r = p/(0.3*b_field);
	    if (direction == 'ccw' && inout == 'incoming') {
		var phi0 = Math.atan2(-px, py); // phi0 = tan((-px)/py)
		var x0 = gridVariables.xDecay - r*Math.cos(phi0);
		var y0 = gridVariables.yDecay - r*Math.cos(phi0);

		// now call a function that calculates phiInitial
		
	    }
	    
	}

	/**
	 * @desc calculates all angles at which the circle in question intersects with the boundary
	 * @inputs - r is the radius of the circle
	 *         - boundaries contains the boundaries of the region
	 *         - (x0, y0) is the center of the circle
         * @returns list of phi values
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
