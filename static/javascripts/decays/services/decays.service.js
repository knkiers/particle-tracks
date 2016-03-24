/**
 * EventGenerator
 * @namespace thinkster.decays.services
 */
(function () {
    'use strict';

    angular
	.module('thinkster.decays.services')
	.factory('GenerateEvent', GenerateEvent);

    GenerateEvent.$inject = ['$http'];

    /**
     * @namespace Posts
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
	 */
	function get() {
	    return $http.get('/api/v1/generateevent/');
	}
    }
})();
