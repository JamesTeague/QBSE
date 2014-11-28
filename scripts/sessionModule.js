/**
 * sessionModule.js
 * @file Holds sessionModule
 * @see SessionModule
 * @author James Teague II jtteague13@gmail.com
 * @since 10/13/2014
 */
/**
 * @module SessionModule
 * @summary Functions needed to maintain the session info.
 * @description Ability to freeze/unfreeze an object as well as 
 * wipe the fields of the session variable object. This method
 * is designed to be used with the session object.
 * @author James Teague II
 * @since 10/28/2014
 * @return {Object} Access to all member functions.
 */
var SessionModule = (function(){
	/**
	 * @function freeze
	 * @description Freezes an object.
	 * @param  {Object} obj object to be frozen
	 * @return {Boolean}     true if object is frozen, 
	 * otherwise false.
	 * @author James Teague II
	 * @since 10/28/2014
	 */
	var freeze = function (obj) {
		obj = Object.freeze(obj);
		if(Object.isFrozen(obj)){
			return true;
		}
		else{
			return false;
		}
	};
	/**
	 * @function defrost
	 * @description Unfreezes a frozen object.
	 * @param  {Object} obj object to be unfrozen
	 * @return {Object}     unfrozen object
	 * @author James Teague II
	 * @since 11/1/2014
	 */
	var defrost = function (obj) {
		if(Object.isFrozen(obj)){
			var _obj = {};
			for (var prop in obj) {
   				if(obj.hasOwnProperty(prop)) {
      				_obj[prop] = obj[prop];
   				}
			}
			if(!Object.isFrozen(_obj)){
				obj = _obj;
				return obj;
			}
			else{
				return _obj;
			}
		}
		else{
			return obj;
		}
		
	};
	/**
	 * @function destroySession
	 * @description Destroys a session object by clearing the memory.
	 * @requires sessvars
	 * @param  {Object} obj session object
	 * @return {Boolean}    true when memory is cleared.
	 * @author James Teague II
	 * @since 11/19/2014
	 */	
	var destroySession = function (obj) {
		if(obj.$){
			obj.$.clearMem();
			return true;
		}
		return false;
	};
	/**
	 * @function pruneTemporary
	 * @description removes the temporary information from the
	 * session object
	 * @requires sessvars
	 * @param  {Object} obj sessvars object
	 * @param  {Function} callback function to run on completion
	 * @return none
	 * @author James Teague II
	 * @since 11/26/2014
	 */
	var pruneTemporary = function (obj, callback) {
		callback = callback || null;
		var _obj = obj.sessionObj;
		obj.$.clearMem();
		obj.sessionObj = _obj;
		if(callback && typeof callback === "function"){
			callback;
		}
	}
	return {
		freeze: freeze,
		defrost: defrost,
		destroySession: destroySession,
		pruneTemporary: pruneTemporary
	};
})();