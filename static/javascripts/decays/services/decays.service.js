/**
 * EventGenerator
 * @namespace thinkster.decays.services
 */
(function () {
    'use strict';

    angular
	.module('thinkster.decays.services')
	.factory('GenerateEvent', GenerateEvent)
	.factory('DisplayEvent', DisplayEvent)
	.factory('AnalyzeEvent', AnalyzeEvent);

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
	var Display = {
	    curvedPathParams: curvedPathParams,
	    boundaryIntersectionAngle: boundaryIntersectionAngle,
	    getStringEventDisplay: getStringEventDisplay,
	    translatecmtoPixels: translatecmtoPixels,
	    translateCircleDatatoPixels: translateCircleDatatoPixels
	};

	return Display;

	////////////////////

	/*
	 * @name getAllPathParams
	 *
	 */

	
	function getStringEventDisplay(bFieldStrength, bFieldDirection, boundaries, interactionLocation, event){

	    var inChargedString = '';
	    var inNeutralString = '';
	    var outChargedString = '';
	    var outNeutralString = '';
	    var particleDirection;
	    var px, py;
	    px = event.parent.energy_momentum[1];
	    py = event.parent.energy_momentum[2];
	    if (event.parent.charge != 0) {
		particleDirection = inOut(bFieldDirection, event.parent.charge);
		inChargedString += curvedPathParams(bFieldStrength, boundaries, interactionLocation,
				      px, py, particleDirection, 'incoming');
	    } else {
		inNeutralString += straightPathParams(boundaries, interactionLocation, px, py, 'incoming');
	    }
	    var i, dP;
	    for (i=0; i<event.decay_products.length; i++) {
		dP = event.decay_products[i];
		px = dP.energy_momentum[1];
		py = dP.energy_momentum[2];
		if (dP.charge != 0) {
		    particleDirection = inOut(bFieldDirection, dP.charge);
		    outChargedString += curvedPathParams(bFieldStrength, boundaries, interactionLocation,
					  px, py, particleDirection, 'outgoing');
		} else {
		    outNeutralString += straightPathParams(boundaries, interactionLocation, px, py, 'outgoing');
		}
	    }

	    var dString = {'inCharged': inChargedString, 'inNeutral': inNeutralString,
			   'outCharged': outChargedString, 'outNeutral': outNeutralString};
	    return dString;

	}

	function inOut(bFieldDirection, charge){
	    if ((charge == 1 && bFieldDirection == 'in') || (charge == -1 && bFieldDirection == 'out')){
		return 'ccw';
	    } else {
		return 'cw';
	    }
	}
	
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
	 */
	
	function curvedPathParams(b_field, boundaries, interactionLocation, px, py, direction, inout) {
	    var p = Math.sqrt(px*px+py*py);
	    var r = p/(0.3*b_field);
	    var phi0, x0, y0, phiBorder;
	    var PI = Math.acos(-1);
	    var returnString;

	    if (direction == 'ccw') {
		phi0 = Math.atan2(-px, py); // phi0 = tan((-px)/py)
	    } else {
		phi0 = Math.atan2(px, -py); // phi0 = tan(px/(-py))
	    }
	    x0 = interactionLocation.x - r*Math.cos(phi0);
	    y0 = interactionLocation.y - r*Math.sin(phi0);

	    phiBorder = boundaryIntersectionAngle(x0, y0, r, phi0, boundaries, direction, inout);

	    returnString = arcString(x0, y0, r, phi0, phiBorder, boundaries, direction, inout);
	    return returnString;
 
	}

	function straightPathParams(boundaries, interactionLocation, px, py, inout) {
	    // find x and y for intersection with boundary
	    // call straightPathString and then return returnString
	    var returnString, edgeCoords;

	    edgeCoords = boundaryIntersectionStraight(interactionLocation.x,
						      interactionLocation.y,
						      px, py, boundaries, inout);

	    returnString = straightPathString(interactionLocation.x,
					      interactionLocation.y,
					      edgeCoords.x,
					      edgeCoords.y, boundaries, inout);
	    return returnString;
 
	}

	/**
	 * @desc determines the string that will create the arc in SVG
	 * @inputs - r is the radius of the circle
	 *         - boundaries contains the boundaries of the region
	 *         - (x0, y0) is the center of the circle
	 *         - phi0 is the angle between (x0, y0) and the interactionLocation
	 *         - direction is 'cw' or 'ccw', depending on the particle direction
	 *         - inout is 'incoming' or 'outgoing'
         * @returns string
	 */
	function arcString(x0, y0, r, phi0, phiBorder, boundaries, direction, inout) {
	    var PI = Math.acos(-1);
	    
	    var largeArcFlag = '0';
	    var sweepFlag;
	    var absDeltaPhi = Math.abs(phi0 - phiBorder);
	    
	    if (direction == 'ccw') {
		sweepFlag = '0';
	    } else {
		sweepFlag = '1';
	    }

	    if (inout == 'incoming') {
		var xFinal = x0 + r*Math.cos(phi0);
		var yFinal = y0 + r*Math.sin(phi0);
		var xInitial = x0 + r*Math.cos(phiBorder);
		var yInitial = y0 + r*Math.sin(phiBorder);
	    } else {
		var xInitial = x0 + r*Math.cos(phi0);
		var yInitial = y0 + r*Math.sin(phi0);
		var xFinal = x0 + r*Math.cos(phiBorder);
		var yFinal = y0 + r*Math.sin(phiBorder);
	    }
	    
	    if (absDeltaPhi > PI) {
		largeArcFlag = '1';
	    }
	    
	    var pixelFinal = translatecmtoPixels(xFinal, yFinal, boundaries);
	    var pixelInitial = translatecmtoPixels(xInitial, yInitial, boundaries);
	    var rPixels = translateRadiuscmtoPixels(r, boundaries);
	    var arrayToStringify = ['M', pixelInitial.x, pixelInitial.y, 'A', rPixels.toString(), rPixels.toString(),
				    '0', largeArcFlag, sweepFlag, pixelFinal.x, pixelFinal.y];
	    var arcString = stringifyArray(arrayToStringify);
	    return arcString;
	}

	function straightPathString(xInteraction, yInteraction, xEdge, yEdge, boundaries, inout) {

	    var pixelEdge = translatecmtoPixels(xEdge, yEdge, boundaries);
	    var pixelInteraction = translatecmtoPixels(xInteraction, yInteraction, boundaries);

	    var arrayToStringify = ['M', pixelInteraction.x, pixelInteraction.y, 'L', pixelEdge.x, pixelEdge.y];
	    var lineString = stringifyArray(arrayToStringify);
	    return lineString;
	}

	function translateCircleDatatoPixels(circleDatacm, boundaries) {
	    var center = translatecmtoPixels(circleDatacm.xc, circleDatacm.yc, boundaries);
	    var r = translateRadiuscmtoPixels(circleDatacm.r, boundaries);
	    var circleDataPx = {
		xcPx: center.x,
		ycPx: center.y,
		rPx:  r,
		xc:   circleDatacm.xc,
		yc:   circleDatacm.yc,
		r:    circleDatacm.r,
		CW:   true,
		incoming: true
	    };
	    return circleDataPx;
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
	 *         - direction is 'cw' or 'ccw'; gives the physical direction being traveled by the particle
	 *         - inout is 'incoming' or 'outgoing'
	 * @note for an incoming particle, travels backward along the route until a boundary is reached;
	 *       for an outgoing particle, travels forward along the route until a boundary is reached
         * @returns phi value
	 */
	function boundaryIntersectionAngle(x0, y0, r, phi0, boundaries, direction, inout) {
	    var phi;
	    var PI = Math.acos(-1);
	    var deltaPhiMax = 3*PI/2;
	    var phiStep = 0.01; //radians
	    var signStep;
	    var x, y;
	    x = x0 + r*Math.cos(phi0); // this is the interaction point
	    y = y0 + r*Math.sin(phi0);
	    if (!isInsideBoundingBox(x, y, boundaries)){
		return phi0;// hopefully this doesn't happen(!)
	    }

	    var inside = true;
	    phi = phi0;
	    var deltaPhi = 0;
	    if ((direction == 'ccw' && inout == 'incoming') || (direction == 'cw' && inout == 'outgoing')) {
		signStep = -1;
	    } else {
		signStep = 1;
	    }
	    
	    while (inside == true && Math.abs(deltaPhi) < deltaPhiMax) {
		deltaPhi += signStep*phiStep;
		phi = phi0 + deltaPhi;
		x = x0 + r*Math.cos(phi);
		y = y0 + r*Math.sin(phi);
		inside = isInsideBoundingBox(x, y, boundaries);
	    }
	    // phi now corresponds to a point slightly outside the bounding box, so reset it
	    phi = phi - signStep*phiStep;
	    return phi;
	}

	function boundaryIntersectionStraight(xInteraction, yInteraction, px, py, boundaries, inout) {

	    var unitX = px/Math.sqrt(px*px+py*py);
	    var unitY = py/Math.sqrt(px*px+py*py);
	    var edgeCoords;
	    var nStep = 0.01; //cm
	    var signStep;
	    var x, y;
	    if (!isInsideBoundingBox(xInteraction, yInteraction, boundaries)){
		edgeCoords = {'x': xInteraction, 'y': yInteraction};
		return edgeCoords;// hopefully this doesn't happen(!)
	    }
	    var inside = true;
	    if (inout == 'incoming'){
		signStep = -1;
	    } else {
		signStep = 1;
	    }
	    x = xInteraction;
	    y = yInteraction;
	    while (inside == true) {
		x += unitX*signStep*nStep;
		y += unitY*signStep*nStep;
		inside = isInsideBoundingBox(x, y, boundaries);
	    }
	    // (x,y) now corresponds to a point slightly outside the bounding box, so reset it
	    x -= unitX*signStep*nStep;
	    y -= unitY*signStep*nStep;
	    edgeCoords = {'x': x, 'y': y};
	    return edgeCoords;
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

    /**
     * @namespace thinkster.decays.services
     * @returns {Factory}
     */
    function AnalyzeEvent(DisplayEvent) {
	var Analysis = {
	    circleFitter:       circleFitter,
	    gatherDataFromDots: gatherDataFromDots,
	    initializeGrid:     initializeGrid,
	    fitCircleToData:    fitCircleToData
	};

	return Analysis;

	function initializeGrid(boundaries) {

	    var deltaX = (boundaries.xmax-boundaries.xmin)/(boundaries.numGridPointsX-1);
	    var deltaY = (boundaries.ymax-boundaries.ymin)/(boundaries.numGridPointsY-1);

	    var grid = [];

	    var x, y;
	    var i, j, coordsPx;
	    var index = 0;
	    for (j=0; j<boundaries.numGridPointsY; j++) {
		for (i=0; i<boundaries.numGridPointsX; i++) {
		    x = boundaries.xmin + i*deltaX;
		    y = boundaries.ymin + j*deltaY;
		    coordsPx = DisplayEvent.translatecmtoPixels(x, y, boundaries);
		    grid.push(
			{
			    index:     index,
			    activated: true,
			    x:         coordsPx.x,
			    y:         coordsPx.y,
			    xcm:       x,
			    ycm:       y,
			    useForFit: false,
			}
		    );
		    index++;
		}
	    }
	    return grid;
	}

	function fitCircleToData(dots, circles, boundaries) {
	    var circleInputData = gatherDataFromDots(dots, boundaries);
	    
	    var circleDatacm = circleFitter(circleInputData);
	    var error = false;
	    var errorMessage = '';
	    var dataDict;
	    if (circleDatacm.error) {
		errorMessage = circleDatacm.errorMessage;
		error = true;
	    } else {
		var circleDataPx = DisplayEvent.translateCircleDatatoPixels(circleDatacm, boundaries);
		circles.push(circleDataPx);
	    }
	    dataDict = {
		circles:      circles,
		error:        error,
		errorMessage: errorMessage
	    };
	    return dataDict;
	}

	
	function clearActivatedDots(dots) {
	    for (i=0; i<dots.length; i++) {
		dots[i].useForFit = false;
		dots[i].activated = false;
	    }	
	}

	function clearDotsForFit(dots) {
	    for (i=0; i<dots.length; i++) {
		dots[i].useForFit = false;
	    }	
	}
	
	////////////////////

	/*
	 * looks at the 'dots' array and determines which have been selected for fitting a circle
	 * returns a data list suitable for sending to circleFitter
	 */
	function gatherDataFromDots(dots, boundaries) {
	    var xArray = [];
	    var yArray = [];
	    var i;
	    for (i=0; i<dots.length; i++) {
		if (dots[i].useForFit == true) {
		    xArray.push(dots[i].xcm);
		    yArray.push(dots[i].ycm);
		}
	    }
	    var circleInputData = {
		x: xArray,
		y: yArray
	    }
	    return circleInputData;
	}
	
	/*
	 * @name circleFitter
	 * @input data has two lists: data.x and data.y
	 * @returns (x0, y0) and r (in cm) for the best-fit circle
	 * ADD SOME ERROR CHECKING!!!!  Need to check for colinear points, and that N >= 3.
	 *
	 */
	function circleFitter(data) {
	    var xBar = mean(data.x);
	    var yBar = mean(data.y);
	    var uList = [];
	    var vList = [];
	    var nMax = data.x.length;
	    var i;
	    var circleData;

	    if (nMax < 3 ) {
		circleData = {xc: 0, yc: 0, r: 0,
			      error: true,
			      errorMessage: 'You must choose at least three points.'
			     };
		return circleData;
	    }
	    
	    for (i=0; i < nMax; i++) {
		uList.push(data.x[i] - xBar);
		vList.push(data.y[i] - yBar);
	    }
	    
	    var Suu =  SCalculator([uList, uList]);
	    var Svv =  SCalculator([vList, vList]);
	    var Suv =  SCalculator([uList, vList]);
	    var Suuu = SCalculator([uList, uList, uList]);
	    var Svvv = SCalculator([vList, vList, vList]);
	    var Suvv = SCalculator([uList, vList, vList]);
	    var Svuu = SCalculator([vList, uList, uList]);
	    
	    var mInv = inverseTwoByTwo([[Suu, Suv], [Suv, Svv]]);
	    if (mInv.error) {
		circleData = {xc: 0, yc: 0, r: 0,
			      error: true,
			      errorMessage: 'You must choose non-colinear points.'
			     };
	    } else {
		var inverseMatrix = mInv.inverse;
		var coeffs = [(Suuu+Suvv)/2, (Svvv+Svuu)/2];
		var uc = inverseMatrix[0][0]*coeffs[0]+inverseMatrix[0][1]*coeffs[1];
		var vc = inverseMatrix[1][0]*coeffs[0]+inverseMatrix[1][1]*coeffs[1];
		var xc = uc + xBar;
		var yc = vc + yBar;
		var r = Math.sqrt(uc*uc + vc*vc + (Suu+Svv)/nMax);
		circleData = {xc: xc, yc: yc, r: r, error: false, errorMessage: ''};
	    }
	    return circleData;	    
	}

	function mean(list) {
	    var total = 0;
	    var i;
	    for (i=0; i<list.length; i++) {
		total += list[i];
	    }
	    return total/list.length;	
	}

	/*
	 * listOfLists could be [uList, uList, vList], for example
	 *
	 */
	function SCalculator(listOfLists) {
	    var numLists = listOfLists.length;
	    var i, j;
	    var sublistLengths = listOfLists[0].length; //they'd better be the same length!
	    var total = 0;
	    var product;
	    for (j=0; j < sublistLengths; j++){
		product = 1;
		for (i=0; i < numLists; i++){
		    product = product*listOfLists[i][j];
		}
		total += product;
	    }
	    return total;
	}

	/*
	 * MUST CHECK FIRST that the matrix is invertible!!!
	 *
	 */
	function inverseTwoByTwo(matrix) {
	    var a,b,c,d;
	    var eps = 0.000000001;
	    var error = false;
	    var returnObject;
	    a = matrix[0][0];
	    b = matrix[0][1];
	    c = matrix[1][0];
	    d = matrix[1][1];
	    var det = a*d - b*c;
	    if (Math.abs(det) < eps) {
		returnObject = {
		    error: true,
		    inverse: 0
		};
		return returnObject;
	    } else {
		var inverse = [[d/det, -b/det],[-c/det, a/det]];
		returnObject = {
		    error: false,
		    inverse: inverse
		};
		return returnObject;
	    }
	    
	}
	
    }
    
})();
