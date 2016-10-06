define([],function(){
	var EventEmitterImpl = function(){
		/**
		* Hash of event names and arrays of handler functions. Each function
		* associated with an event name is called whenever that event is triggered
		*
		* Example:
		* 'ui.channel.toggle': [
		*   function,
		*   function
		* ]
		*
		* @type {Object}
		*/
	   	return{
			eventSubscribers: {},

			/**
			* Whether or not to console.log events as they are triggered
			* @type {Boolean}
			*/
			logEvents: false,

			logIgnoredEvents: [],

			/**
			* Triggers an event and sends it to all subscribers of that event
			* If data is not an array, it will be wrapped in an array.
			*
			* @param  {String} eventName
			* @param  {Array} data
			*/
			trigger:function(eventName, data) {
				var
				subscribers = this.eventSubscribers[eventName],
				i, iMax,
				logThis = (this.logEvents && this.logIgnoredEvents.indexOf(eventName) === -1);

				// Arrayify data
				data = (data instanceof Array) ? data : [data];

				// No subscribers found for this event, don't bother.
				if (typeof subscribers === 'undefined') {
					if (logThis) {
						console.log('[EventDispatcher] No current subscribers for {' + eventName + '}');
					}
					return;
				}

				// Do some logging
				if (logThis) {
					console.log(
					'[EventDispatcher] {' +  eventName + '} triggered with data: ',
					data,
					' and sent to {' + subscribers.length + '} subscribers.'
					);
				}

				for (i = 0, iMax = subscribers.length; i < iMax; i += 1) {
					subscribers[i].callback.apply(this, data);
				}
			},

		  /**
		   * Add a single subscribtion: callback function to list of subscribers
		   * for eventName
		   *
		   * @param  {String}   eventName
		   * @param  {Function} callback
		   * @param  {Number} priority
		   */
			subscribeSingle:function(eventName, callback, priority) {
				var subscribers = this.eventSubscribers[eventName];

				priority = parseInt(priority || 0, 10);

				if (typeof subscribers === 'undefined') {
					subscribers = this.eventSubscribers[eventName] = [];
				}

				subscribers.push({callback: callback, priority: priority});

				// Re-sort subscribers so highest priority is first
				subscribers = subscribers.sort(function(a, b) {
					return b.priority - a.priority
				});
			},


			/**
			* Subscribe to a set of events with object syntax:
			* eventName: callback pairs
			*
			* @param  {Object} eventHash [description]
			*/
			subscribeHash:function(eventHash, priority) {
				var eventName;

				for (eventName in eventHash) {
					if (eventHash.hasOwnProperty(eventName)) {
						this.subscribeSingle(eventName, eventHash[eventName], priority);
					}
				}
			},


		  /**
		   * Add a callback function to the list of subscribers for this event
		   *
		   * @param  {String|Object} eventNameOrHash
		   * @param  {Function} callback
		   * @param {Number} priority
		   */
			subscribe: function(eventNameOrHash, callback, priority) {
				if (typeof eventNameOrHash === 'object') {
					return subscribeHash(eventNameOrHash);
				}

				return this.subscribeSingle(eventNameOrHash, callback);
			},


		  /**
		   * Remove a certain callback function from the subscribers
		   *
		   * The function provided mus be identical to the one passed to subscribe.
		   *
		   * @param  {String}
		   * @param  {Function} existingCallback
		   */
			unsubscribe:function(eventName, existingCallback) {
				var
				  subscribers = this.eventSubscribers[eventName],
				  callbackIndex;

				// If we don't know this event, don't even worry about it.
				if (typeof subscribers === 'undefined') { return; }

				callbackIndex = subscribers.indexOf(existingCallback);

				// Not found among subscribers, don't even worry about it.
				if (callbackIndex === -1) { return; }

				//remove from subscribers
				subscribers.splice(callbackIndex, 1);
			},
			/**
			* Unsubscribe all subscribers from an event
			*
			* @param  {String} eventName
			*/
			unsubscribeAll:function(eventName) {
				delete this.eventSubscribers[eventName];
			},
			toggleLogging:function(on) {
					// Make sure console.log is a thing.
				if (typeof console === 'undefined') {
					console = {log: function () {}};
				}

				if (typeof console.log !== 'function') {
					console.log = function () {};
				}
				this.logEvents = (typeof on === 'undefined') ? !this.logEvents : !!on;
			},
			dontLog:        function (eventName) {
				if (this.logIgnoredEvents.indexOf(eventName) === -1) {
					this.logIgnoredEvents.push(eventName);
				}
			}
		};
	};
	return EventEmitterImpl;
});