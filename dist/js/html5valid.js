/*!
 * Html5 Validacion  de Formulario
 * version: 2
 * Copyright 2018
 * Licensed MIT
 */
( (factory) => {
	if ( typeof define === 'function' && define.amd ) {
        define([ 'jquery' ], factory );
    } else {
        factory( jQuery );
    }
},( (jQuery) => {
	'use strict';
	var $ = jQuery;

	if (typeof jQuery === 'undefined') {
		throw new Error('Html5Valid JavaScript requires jQuery');
	}
	$.isString = function (value){
		return value !== undefined && typeof value === 'string';
	}
	$.isUndefined = function (r){
		return (r === undefined || typeof r === undefined || r === 'undefined'); 
	}
	$.isBool = function (value){
		return value !== undefined && typeof value === 'boolean';
	}
	$.uniqId = function (prefix) {
		var d = new Date().getTime();
        var uuid = '6xx-yxx-4xxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return prefix+"-"+uuid;
    }

	$.cleanData = (function (orig) {
		return function (elems) {
			var events, elem, i;
			for (i = 0; (elem = elems[i]) != null; i++) {
				try {

					// Only trigger remove when necessary to save time
					events = $._data(elem, "events");
					if (events && events.remove) {
						$(elem).triggerHandler("remove");
					}

					// http://bugs.$.com/ticket/8235
				} catch (e) {
				}
			}
			orig(elems);
		};
	})($.cleanData);

	var HV = {
		version: 2.0,
		init:function(){
			var w = $('[data-role*="html5valid"]');
		}

	};
	return HV.init();
}))