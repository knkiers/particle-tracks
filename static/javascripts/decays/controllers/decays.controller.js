/**
 * EventController
 * @namespace thinkster.decays.controllers
 * @references - some useful info on getting angular and svg to play together: 
 *               http://alexandros.resin.io/angular-d3-svg/
 *             - useful info regarding how to make an arc of a circle in svg:
 *               https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/
 *                       Paths?redirectlocale=en-US&redirectslug=SVG%2FTutorial%2FPaths#Arcs
 *             - including html tags:
 *               https://docs.angularjs.org/api/ng/directive/ngBindHtml
 *               http://stackoverflow.com/questions/14726938/angular-sanitize-ng-bind-html-not-working
 *
 * ISSUES: - when toggling B field, need to somehow adjust the event, too; in particular, if there is a chained
 *           event, everything will be messed up.  maybe just need to do a simple reversal of some sort...(?)
 * IDEAS:  - should think about using django's session object to store b_field and b_direction, instead of the cookie
 */
(function () {
    'use strict';

    angular
	.module('thinkster.decays.controllers',['ngSanitize'])
	.controller('EventController', EventController);
    
    EventController.$inject = ['$cookies','$scope', '$location', 'GenerateEvent', 'Authentication', 'DisplayEvent'];

    /**
     * @namespace EventController
     */
    function EventController($cookies, $scope, $location, GenerateEvent, Authentication, DisplayEvent) {
	var vm = this;

	vm.boundaries = { // very important that the x and y directions preserve the aspect ratio!!!
	    xmin: -5, // cm; boundaries of the display region
	    xmax: 5,  // cm
	    ymin: -5, // cm
	    ymax: 5,  // cm
	    xminPx: 50, // boundaries of the display region in pixels
	    xmaxPx: 450, // pixels
	    yminPx: 450, // pixels; yminPx is at the bottom of the plot region
	    ymaxPx: 50 // pixels
	}

	var interactionRegion = {
	    xmin: -1,
	    xmax: 1,
	    ymin: -1,
	    ymax: 1
	}

	// function that takes these things, as well as the momentum, computes beginning and ending point, radius, etc.
	
	vm.eventGenerated = false;

	activate();

	//vm.d = DisplayEvent.pathParams(170, boundaries, interactionLocation, 0, 120, 'ccw', 'outgoing');

	
	

	vm.graph = {'width': 500, 'height': 500};

	//vm.d = "M10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10"

	/**
	 * @name generateEvent
	 * @desc fetches data for a new random decay event
	 * @memberOf thinkster.decays.controllers.EventController
	 */
	vm.generateEvent = function() {
	    var b_field = vm.bFieldStrength;
	    var b_direction = vm.bFieldDirection;	    
	    GenerateEvent.get(b_field, b_direction).then(eventSuccessFn, eventErrorFn);
	}

	/**
	 * @name renderEvent
	 * @desc renders an existing event
	 * @memberOf thinkster.decays.controllers.EventController
	 */
	vm.renderEvent = function() {
	    

	}




	

	
	/**
	 * @name activate
	 * @desc Actions to be performed when this controller is instantiated
	 * @memberOf thinkster.decays.controllers.EventController
	 */
	function activate() {
	    if (!Authentication.isAuthenticated()) {
		$location.url('/login');
	    }

	    if (!$cookies.bFieldStrength) {
		vm.bFieldStrength = 50; // default is B = 50 kG
		$cookies.bFieldStrength = vm.bFieldStrength;
	    } else {
		vm.bFieldStrength = $cookies.bFieldStrength;
	    }

	    if (!$cookies.bFieldDirection) {
		vm.bFieldDirection = 'in'; // default is that the B field is pointing into the page
		$cookies.bFieldDirection = vm.bFieldDirection;
	    } else {
		vm.bFieldDirection = $cookies.bFieldDirection;
	    }
	    
	}
	
	/**
	 * @name eventSuccessFn
	 * @desc Update posts array on view
	 */
	function eventSuccessFn(data, status, headers, config) {
	    vm.eventGenerated = true;
	    /*
	     * something tells me that this is not the way to do this!!!  shouldn't it already be an object when it arrives?!?
	     * SOMETHING is broken -- on the second generate event function call, it says that arcString is not a function....  HUH?!?

	     */

	    vm.event = JSON.parse(data.data);

	    vm.HTML = 'I am an <code>HTML</code>string with ' + '<a href="#">links!</a> and other <em>stuff</em>';

	    vm.interactionLocation = {
		x: Math.random()*(interactionRegion.xmax-interactionRegion.xmin) + interactionRegion.xmin,
		y: Math.random()*(interactionRegion.ymax-interactionRegion.ymin) + interactionRegion.ymin
	    }

	    vm.d = DisplayEvent.getStringEventDisplay(vm.bFieldStrength,
						      vm.bFieldDirection,
						      vm.boundaries,
						      vm.interactionLocation,
						      vm.event);
	    
	}

	/**
	 * @name eventErrorFn
	 * @desc Show snackbar with error
	 */
	function eventErrorFn(data, status, headers, config) {
	    vm.eventGenerated = false;
	    //		Snackbar.error(data.error);
	}

	/**
	 * @name toggleBFieldDirection
	 * @desc Toggles between inward and outward pointing B fields
	 */
	vm.toggleBFieldDirection = function() {
	    if (!$cookies.bFieldDirection) {
		$cookies.bFieldDirection = 'in';
	    } else {
		if ($cookies.bFieldDirection == 'in') {
		    $cookies.bFieldDirection = 'out';
		} else {
		    $cookies.bFieldDirection = 'in';
		}
		vm.bFieldDirection = $cookies.bFieldDirection;
	    }
	}
    }

})();

/*
	function setAuthenticatedAccount(account) {
	    $cookies.authenticatedAccount = JSON.stringify(account);
	}

	/**
	 * @name unauthenticate
	 * @desc Delete the cookie where the user object is stored
	 * @returns {undefined}
	 * @memberOf thinkster.authentication.services.Authentication
	 
	function unauthenticate() {
	    delete $cookies.authenticatedAccount;
	}

*/
