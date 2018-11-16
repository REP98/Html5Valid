/*!
 * Html5 Validacion  de Formulario
 * Copyright 2018
 * Licensed MIT
 */
(function( factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define([ 'jquery' ], factory );
    } else {
        factory( jQuery );
    }
}(function( jQuery ) { 
'use strict';
	var $ = jQuery;
	
	window.HV_VERSION = '1.0';
	
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
	var widget_uuid = 0,
		widget_slice = Array.prototype.slice;

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

	$.widget = function (name, base, prototype) {
		var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
			proxiedPrototype = {},
			namespace = name.split(".")[0];

		name = name.split(".")[1];
		fullName = namespace + "-" + name;

		if (!prototype) {
			prototype = base;
			base = $.Widget;
		}

		// create selector for plugin
		$.expr[":"][fullName.toLowerCase()] = function (elem) {
			return !!$.data(elem, fullName);
		};

		$[namespace] = $[namespace] || {};
		existingConstructor = $[namespace][name];
		constructor = $[namespace][name] = function (options, element) {
			// allow instantiation without "new" keyword
			if (!this._createWidget) {
				return new constructor(options, element);
			}

			// allow instantiation without initializing for simple inheritance
			// must use "new" keyword (the code above always passes args)
			if (arguments.length) {
				this._createWidget(options, element);
			}
		};
		// extend with the existing constructor to carry over any static properties
		$.extend(constructor, existingConstructor, {
			version: prototype.version,
			// copy the object used to create the prototype in case we need to
			// redefine the widget later
			_proto: $.extend({}, prototype),
			// track widgets that inherit from this widget in case this widget is
			// redefined after a widget inherits from it
			_childConstructors: []
		});

		basePrototype = new base();
		// we need to make the options hash a property directly on the new instance
		// otherwise we'll modify the options hash on the prototype that we're
		// inheriting from
		basePrototype.options = $.widget.extend({}, basePrototype.options);
		$.each(prototype, function (prop, value) {
			if (!$.isFunction(value)) {
				proxiedPrototype[prop] = value;
				return;
			}
			proxiedPrototype[prop] = (function () {
				var _super = function () {
						return base.prototype[prop].apply(this, arguments);
					},
					_superApply = function (args) {
						return base.prototype[prop].apply(this, args);
					};
				return function () {
					var __super = this._super,
						__superApply = this._superApply,
						returnValue;

					this._super = _super;
					this._superApply = _superApply;

					returnValue = value.apply(this, arguments);

					this._super = __super;
					this._superApply = __superApply;

					return returnValue;
				};
			})();
		});
		constructor.prototype = $.widget.extend(basePrototype, {
			// TODO: remove support for widgetEventPrefix
			// always use the name + a colon as the prefix, e.g., draggable:start
			// don't prefix for widgets that aren't DOM-based
			widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
		}, proxiedPrototype, {
			constructor: constructor,
			namespace: namespace,
			widgetName: name,
			widgetFullName: fullName
		});

		// If this widget is being redefined then we need to find all widgets that
		// are inheriting from it and redefine all of them so that they inherit from
		// the new version of this widget. We're essentially trying to replace one
		// level in the prototype chain.
		if (existingConstructor) {
			$.each(existingConstructor._childConstructors, function (i, child) {
				var childPrototype = child.prototype;

				// redefine the child widget using the same prototype that was
				// originally used, but inherit from the new version of the base
				$.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
			});
			// remove the list of existing child constructors from the old constructor
			// so the old child constructors can be garbage collected
			delete existingConstructor._childConstructors;
		} else {
			base._childConstructors.push(constructor);
		}

		$.widget.bridge(name, constructor);

		return constructor;
	};

	$.widget.extend = function (target) {
		var input = widget_slice.call(arguments, 1),
			inputIndex = 0,
			inputLength = input.length,
			key,
			value;
		for (; inputIndex < inputLength; inputIndex++) {
			for (key in input[inputIndex]) {
				value = input[inputIndex][key];
				if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
					// Clone objects
					if ($.isPlainObject(value)) {
						target[key] = $.isPlainObject(target[key]) ?
							$.widget.extend({}, target[key], value) :
							// Don't extend strings, arrays, etc. with objects
							$.widget.extend({}, value);
						// Copy everything else by reference
					} else {
						target[key] = value;
					}
				}
			}
		}
		return target;
	};

	$.widget.bridge = function (name, object) {
		var fullName = object.prototype.widgetFullName || name;
		$.fn[name] = function (options) {
			var isMethodCall = typeof options === "string",
				args = widget_slice.call(arguments, 1),
				returnValue = this;

			if (isMethodCall) {
				this.each(function () {
					var methodValue,
						instance = $.data(this, fullName);
					if (options === "instance") {
						returnValue = instance;
						return false;
					}
					if (!instance) {
						return $.error("cannot call methods on " + name + " prior to initialization; " +
							"attempted to call method '" + options + "'");
					}
					if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
						return $.error("no such method '" + options + "' for " + name + " widget instance");
					}
					methodValue = instance[options].apply(instance, args);
					if (methodValue !== instance && methodValue !== undefined) {
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack(methodValue.get()) :
							methodValue;
						return false;
					}
				});
			} else {

				// Allow multiple hashes to be passed on init
				if (args.length) {
					options = $.widget.extend.apply(null, [options].concat(args));
				}

				this.each(function () {
					var instance = $.data(this, fullName);
					if (instance) {
						instance.option(options || {});
						if (instance._init) {
							instance._init();
						}
					} else {
						$.data(this, fullName, new object(options, this));
					}
				});
			}

			return returnValue;
		};
	};

	$.Widget = function (/* options, element */) {
	};
	$.Widget._childConstructors = [];

	$.Widget.prototype = {
		widgetName: "widget",
		widgetEventPrefix: "",
		defaultElement: "<div>",
		options: {
			disabled: false,

			// callbacks
			create: null
		},
		_createWidget: function (options, element) {
			element = $(element || this.defaultElement || this)[0];
			this.element = $(element);
			this.uuid = widget_uuid++;
			this.eventNamespace = "." + this.widgetName + this.uuid;

			this.bindings = $();
			this.hoverable = $();
			this.focusable = $();

			if (element !== this) {
				$.data(element, this.widgetFullName, this);
				this._on(true, this.element, {
					remove: function (event) {
						if (event.target === element) {
							this.destroy();
						}
					}
				});
				this.document = $(element.style ?
					// element within the document
					element.ownerDocument :
					// element is window or document
				element.document || element);
				this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
			}

			this.options = $.widget.extend({},
				this.options,
				this._getCreateOptions(),
				options);

			this._create();
			this._trigger("create", null, this._getCreateEventData());
			this._init();
		},
		_getCreateOptions: $.noop,
		_getCreateEventData: $.noop,
		_create: $.noop,
		_init: $.noop,

		destroy: function () {
			this._destroy();
			// we can probably remove the unbind calls in 2.0
			// all event bindings should go through this._on()
			this.element
				.unbind(this.eventNamespace)
				.removeData(this.widgetFullName)
				// support: jquery <1.6.3
				// http://bugs.jquery.com/ticket/9413
				.removeData($.camelCase(this.widgetFullName));
			this.widget()
				.unbind(this.eventNamespace)
				.removeAttr("aria-disabled")
				.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled");

			// clean up events and states
			this.bindings.unbind(this.eventNamespace);
			this.hoverable.removeClass("ui-state-hover");
			this.focusable.removeClass("ui-state-focus");
		},
		_destroy: $.noop,

		widget: function () {
			return this.element;
		},

		option: function (key, value) {
			var options = key,
				parts,
				curOption,
				i;

			if (arguments.length === 0) {
				// don't return a reference to the internal hash
				return $.widget.extend({}, this.options);
			}

			if (typeof key === "string") {
				// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
				options = {};
				parts = key.split(".");
				key = parts.shift();
				if (parts.length) {
					curOption = options[key] = $.widget.extend({}, this.options[key]);
					for (i = 0; i < parts.length - 1; i++) {
						curOption[parts[i]] = curOption[parts[i]] || {};
						curOption = curOption[parts[i]];
					}
					key = parts.pop();
					if (arguments.length === 1) {
						return curOption[key] === undefined ? null : curOption[key];
					}
					curOption[key] = value;
				} else {
					if (arguments.length === 1) {
						return this.options[key] === undefined ? null : this.options[key];
					}
					options[key] = value;
				}
			}

			this._setOptions(options);

			return this;
		},
		_setOptions: function (options) {
			var key;

			for (key in options) {
				this._setOption(key, options[key]);
			}

			return this;
		},
		_setOption: function (key, value) {
			this.options[key] = value;

			if (key === "disabled") {
				this.widget()
					.toggleClass(this.widgetFullName + "-disabled", !!value);

				// If the widget is becoming disabled, then nothing is interactive
				if (value) {
					this.hoverable.removeClass("ui-state-hover");
					this.focusable.removeClass("ui-state-focus");
				}
			}

			return this;
		},

		enable: function () {
			return this._setOptions({disabled: false});
		},
		disable: function () {
			return this._setOptions({disabled: true});
		},

		_on: function (suppressDisabledCheck, element, handlers) {
			var delegateElement,
				instance = this;

			// no suppressDisabledCheck flag, shuffle arguments
			if (typeof suppressDisabledCheck !== "boolean") {
				handlers = element;
				element = suppressDisabledCheck;
				suppressDisabledCheck = false;
			}

			// no element argument, shuffle and use this.element
			if (!handlers) {
				handlers = element;
				element = this.element;
				delegateElement = this.widget();
			} else {
				element = delegateElement = $(element);
				this.bindings = this.bindings.add(element);
			}

			$.each(handlers, function (event, handler) {
				function handlerProxy() {
					// allow widgets to customize the disabled handling
					// - disabled as an array instead of boolean
					// - disabled class as method for disabling individual parts
					if (!suppressDisabledCheck &&
						( instance.options.disabled === true ||
						$(this).hasClass("ui-state-disabled") )) {
						return;
					}
					return ( typeof handler === "string" ? instance[handler] : handler )
						.apply(instance, arguments);
				}

				// copy the guid so direct unbinding works
				if (typeof handler !== "string") {
					handlerProxy.guid = handler.guid =
						handler.guid || handlerProxy.guid || $.guid++;
				}

				var match = event.match(/^([\w:-]*)\s*(.*)$/),
					eventName = match[1] + instance.eventNamespace,
					selector = match[2];
				if (selector) {
					delegateElement.delegate(selector, eventName, handlerProxy);
				} else {
					element.bind(eventName, handlerProxy);
				}
			});
		},

		_off: function (element, eventName) {
			eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") +
				this.eventNamespace;
			element.unbind(eventName).undelegate(eventName);

			// Clear the stack to avoid memory leaks (#10056)
			this.bindings = $(this.bindings.not(element).get());
			this.focusable = $(this.focusable.not(element).get());
			this.hoverable = $(this.hoverable.not(element).get());
		},

		_delay: function (handler, delay) {
			function handlerProxy() {
				return ( typeof handler === "string" ? instance[handler] : handler )
					.apply(instance, arguments);
			}

			var instance = this;
			return setTimeout(handlerProxy, delay || 0);
		},

		_hoverable: function (element) {
			this.hoverable = this.hoverable.add(element);
			this._on(element, {
				mouseenter: function (event) {
					$(event.currentTarget).addClass("ui-state-hover");
				},
				mouseleave: function (event) {
					$(event.currentTarget).removeClass("ui-state-hover");
				}
			});
		},

		_focusable: function (element) {
			this.focusable = this.focusable.add(element);
			this._on(element, {
				focusin: function (event) {
					$(event.currentTarget).addClass("ui-state-focus");
				},
				focusout: function (event) {
					$(event.currentTarget).removeClass("ui-state-focus");
				}
			});
		},

		_trigger: function (type, event, data) {
			var prop, orig,
				callback = this.options[type];

			data = data || {};
			event = $.Event(event);
			event.type = ( type === this.widgetEventPrefix ?
				type :
			this.widgetEventPrefix + type ).toLowerCase();
			// the original event may come from any element
			// so we need to reset the target on the new event
			event.target = this.element[0];

			// copy original event properties over to the new event
			orig = event.originalEvent;
			if (orig) {
				for (prop in orig) {
					if (!( prop in event )) {
						event[prop] = orig[prop];
					}
				}
			}

			this.element.trigger(event, data);
			return !( $.isFunction(callback) &&
			callback.apply(this.element[0], [event].concat(data)) === false ||
			event.isDefaultPrevented() );
		}
	};

	$.each({show: "fadeIn", hide: "fadeOut"}, function (method, defaultEffect) {
		$.Widget.prototype["_" + method] = function (element, options, callback) {
			if (typeof options === "string") {
				options = {effect: options};
			}
			var hasOptions,
				effectName = !options ?
					method :
					options === true || typeof options === "number" ?
						defaultEffect :
					options.effect || defaultEffect;
			options = options || {};
			if (typeof options === "number") {
				options = {duration: options};
			}
			hasOptions = !$.isEmptyObject(options);
			options.complete = callback;
			if (options.delay) {
				element.delay(options.delay);
			}
			if (hasOptions && $.effects && $.effects.effect[effectName]) {
				element[method](options);
			} else if (effectName !== method && element[effectName]) {
				element[effectName](options.duration, options.easing, callback);
			} else {
				element.queue(function (next) {
					$(this)[method]();
					if (callback) {
						callback.call(element[0]);
					}
					next();
				});
			}
		};
	});

	var widget = $.widget;

	$.hv = {
		init:function(){
			var widgets = $("[data-role]");
			
			$.hv.loadwidget(widgets);
			
			var observer, observerOptions, fnobserver;

			observerOptions = {
				'childList': true,
				'subtree': true
			};
			
			fnobserver = function(mutations){
				mutations.map(function(record){

					if (record.addedNodes) {

						var obj, widgets, plugins;

						for(var i = 0, l = record.addedNodes.length; i < l; i++) {
							obj = $(record.addedNodes[i]);

							plugins = obj.find("[data-role]");

							if (obj.data('role') !== undefined) {
								widgets = $.merge(plugins, obj);
							} else {
								widgets = plugins;
							}

							if (widgets.length) {
								$.hv.loadwidget(widgets);
							}
						}
					}
				});
			};
			observer = new MutationObserver(fnobserver);
			observer.observe(document, observerOptions); 
		},
		loadwidget:function(widgets){
			$.each(widgets,function(){
				var $this = $(this), w = this;
				var roles = $this.data('role').split(/\s*,\s*/);
				roles.map(function (func) {
					try {
						if ($.fn[func] !== undefined && $this.data(func + '-initiated') !== true) {
							$.fn[func].call($this);
							$this.data(func + '-initiated', true);
						}
					} catch (e) {
						console.log(e.message, e.stack);
					}
				});
			})
		}
	};
	
	$.widget('hv.validate',{
		version: '1.0',
		options:{
			onError: function(){},
			onSuccess:function(){},
			classForm: "was-validated",
			classMsjError:'invalid-feedback',
			novalidate: true,
			allrequired:false,
			rule:{
				valido:'Formulario Valido',
				invalido:'Formulario Invalido',
				xhrError:'Error al enviar formulario',
				text:"Por favor ingrese un texto valido",
				email:'Ingrese una direccion de Correo valido',
				url:'Ingrese una Url valida',
				tel:'Ingrese un n&uacute;mero de tel&eacute;fono validos',
				number:'Este campo solo acepta numeros',
				color:'Campo de para colores',
				date:'Ingrese una fecha valida',
				datetime:'Ingrese una fecha y hora validas',
				time:'Ingrese una hora valida',
				seach:'Ingrese un texto valido',
				password:'Ingrese una Contraseña valida',
				equalTo:'No concuerdan las contraseñas',
				different:'Son identicas',
				ip:'IP invalida',
				decimal:'No es un decimal Valido',
				required:'Elemento Requerido'
			},
			online:true,
			result:'<span/>',
			event:'submit',
			xhr:false,
			output:'output',
			showOp:true,
			classEout: 'alert-danger',
			classVout: 'alert-success'
		},
		funcs: { 
			//Atributos
			required: function(val,el){
				var t = el.attr('type');
				switch(t){
					case 'checkbox' : return el.is(":checked"); break;
					case 'radio':
						var n = el.attr('name');
						var f = el.parents("form");
						var c = f.find('input[type=radio][name="'+ n +'"]:checked').length;
						return c === 1;
					break;
					case 'select-multiple': return val.trim() != null; break;
					default :return val.trim() !== ""; 
				}
			},
			minlength: function(val, len){
				if (len == undefined || isNaN(len) || len <= 0) {
					return false;
				}
				return val.trim().length >= len;
			},
			maxlength: function(val, len){
				if (len == undefined || isNaN(len) || len <= 0) {
					return false;
				}
				return val.trim().length <= len;
			},
			min: function(val, min_value){

				if (min_value == undefined || isNaN(min_value)) {
					return false;
				}
				if (!this.number(val)) {
					return false;
				}
				if (isNaN(val)) {
					return false;
				}
				return Number(val) >= Number(min_value);
			},
			max: function(val, max_value){
				if (max_value == undefined || isNaN(max_value)) {
					return false;
				}
				if (!this.number(val)) {
					return false;
				}
				if (isNaN(val)) {
					return false;
				}
				return Number(val) <= Number(max_value);
			},
			pattern: function(val, pat){
				if (pat == undefined) {
					return false;
				}
				var reg = new RegExp(pat);
				return reg.test(val);
			},
			//Tipos
			email: function(val){
				return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(val);
			},
			url: function(val){
				return /^(?:[a-z]+:)?\/\//i.test(val);
			},
			date: function(val){
				return !!(new Date(val) !== "Invalid Date" && !isNaN(new Date(val)));
			},
			number: function(val){
				return (val - 0) == val && (''+val).trim().length > 0;
			},
			number: function(val){
				return /^\d+$/.test(val);
			},
			color: function(val){
				return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val);
			},
			date: function(val){
				return /^\d{4}-(0[0-9]|1[0,1,2])-([0,1,2][0-9]|3[0,1])$/i.test(val);
			},
			time: function(val){
				return /^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$/i.test(val);
			},
			//Otros
			decimal:function(val){
				return /^([0-9]{0,3}(\,|\.){0,1}){0,2}[0-9]{1,3}(\,[0-9]{2}|\.[0-9]{2}){0,1}$/.test(val);
			},
			ip:function(val){
				return /^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/i.test(val);
			},
			equalTo:function(val,el){
				var n = el.attr("name");
				var f = el.parents("form")
				return $(f+'input[name="'+ n +'"]').val() === val;
			},
			different: function(val, otro){
				var n = el.attr("name");
				var f = el.parents("form")
				return $(f+'input[name="'+ n +'"]').val() !== val;
			}
		},
		_create:function(){
			var self = this, form = this.element, o = this.options, obj = ['xhr','rule'],fn = ['onError', 'onSuccess'];
			$.each(form.data(), function(key, value){
				if (key in o) {
					try {
						if($.inArray(key,obj) != -1){
							o[key]= eval("("+value+")");
						}
						else if($.inArray(key,fn) != -1){
							if (typeof window[value] === 'function') {
								o[key] = window[value];
							} else {
								var result = eval("(function(){"+value+"})");
								o[key] = result
							}
						}
						else{
							o[key] = $.parseJSON(value);
						}
					} catch (e) {
						o[key] = value;
					}
				}
			});;
			this.options = $.extend({},this.options,o);
			this._createValidator();
			form.data('validate',this);
		},
		_createValidator:function(){
			var self = this, form = this.element, o = this.options, inputs = form.find('[data-type-valid]');
			if(o.novalidate){
				form.attr("novalidate",'novalidate');
			}
			form.addClass(o.classForm);
			if(o.allrequired){
				form.find(":input").not(":submit").each(function(){
					var el = $(this);
					this.required = true;
				})
			}else{
				var er = form.find("[data-required]");
				er.each(function(){
					var el = $(this);
					this.required = true;
				})
			}
			
			inputs.on('focus', function(){ });
			if(o.online){
				self._onlineKey(inputs);
			}
			if(o.event != "submit"){
				var btn = form.find('[data-event="'+this.o.event+'"]');
				btn.on(o.event,function(e){
					e.preventDefault();
					self.send()
				});
			}
			else{
				form.on(o.event,function(e){
					e.preventDefault();
					return self.send();
				})
				form.on('invalid',function(e){
					console.log(this,e);
					$(this).addClass(self.o.classForm);
					self.o.onError.call(this,e.target,o.rule.invalido);
				})
			}
		},
		send:function(){
			var self = this, form = this.element, o = this.options, valido=false;
			var inputs = form.find(':input').not(":submit");
			var submit = form.find(':submit');
			var result = 0, i = 0;
			var l = inputs.length;
			do{
				var v = inputs[i];
				var input = $(v);
				var msj = input.data("msj") || o.rule[input.attr('type')];
				var func = [];
				var arg = [];
				if(msj != ""){
					v.setCustomValidity = msj;
				}
				if(input.attr("required")){
					valido = self.funcs.required(input.val(),input);
					msj = msj || o.rule.required;
				}
				else if(input.data("required")){
					valido = self.funcs.required(input.val(),input);
					msj = msj || o.rule.required;
				}
				
				if(input.data("typeValid")){
					var func = (!$.isUndefined(input.data("typeValid")))?String(input.data("typeValid")).split(","):[];
					$.each(func, function(i, v){
						var fn_name = String(func[i]).trim();
						var value = input.attr(fn_name);
						func[i] = fn_name;
						arg[i]= value;
					});
					var e = 0;
					for(var j in func){
						if(!valido) break;
						var fnName = func[j];
							e = j;
						var im = ['require','equalTo', 'different'];
						var _arg = (!$.isUndefined(arg[e]))?arg[e]:false;
						if($.inArray(fnName, im) != -1){ _arg = input; }
						valido = self.funcs[fnName.trim()](input.val(),_arg);
						msj = o.rule[fnName] || msj;
					}
				}else{
					for(var fn in self.funcs){
						if(!valido) break;
						var t = input.attr('type');
						var dos = ['minlength','maxlength', 'min', 'max','pattern'],
							im = ['required','equalTo', 'different'],
							v = input.val(),
							sv;
						if($.inArray(fn,dos) != -1){
							sv = input.attr(fn);
						}
						else if($.inArray(fn,im) != -1){
							sv = input;
						}
						if(input.attr(fn)){
							valido = self.funcs[fn.trim()](v,sv);
						}
						if(t == fn){
							valido = self.funcs[fn.trim()](v,sv);
						}
						if(!valido){msj = o.rule[fn] || msj;}
					}
				}
				if(!valido){
					if($.isFunction(o.onError)){
						o.onError.call(self,input,msj);
					}
					self._showError(input);
				}
				
				if(!valido){
					input.focus();
					return false;
				}
				result += !valido ? 1 : 0;
				i++;
			}while(i < l);
			if(valido){
				form.removeClass(o.classForm);
				if(o.xhr && !$.isUndefined(o.xhr)){
					if(!$.isPlainObject(o.xhr)){
						if(o.xhr){
							var xhr = {};
								xhr.type = form.attr("method") || 'GET';
								xhr.url = form.attr("action") || location.href;
								xhr.error = function(){
									o.onError.call(self,undefined,o.rule.xhrError);
								}
								
								xhr.success = "";
							o.xhr = xhr;
						}
					}
					if(!$.isFunction(o.xhr.success)){
						o.xhr.success = function(f){
							o.onSuccess.call(self.form,f);
						}; 
					}
					o.xhr.data = form.formval();
					$.ajax(o.xhr);
				}
				else if($.isFunction(o.onSuccess)){
					o.onSuccess.call(self,form,o.rule.valido);
				}
			}
			this._showOutMsj(form,valido);
			if(result !== 0){ return false }
			return valido;
		},
		_existError:function(el){
			var error = false;
			var clas = ".",
				cm = this.options.classMsjError.replace(" "," .");
				clas  += cm;
			var f = el.siblings(clas);
			if(f.length > 0){
				error = f;
			}
			return error;
		},
		_showError:function(el){
			var o = this.options;
			var msj = el.data("msj") || o.rule[el.attr('type')];
			el.focus();
			if(o.classMsjError){
				var error = o.result;
				if(this._existError(el)){
					error = this._existError(el);
				}
				else if(error.indexOf("#") != -1){ error = $(error); }
				else if(error != "") {
					error = $(error);
					error.insertAfter(el);
				}
				error.addClass(o.classMsjError);
				error.html(msj);
				el.on('input keydown change',function(){
					error.remove();
				})
			}
			return false;
		},
		_showOutMsj: function(form,valido){
			if(this.options.showOp){
				var outp, o = this.options;
				if(o.output.indexOf("#") != -1){
					outp = $(o.output);
				}
				else if(o.output == "output" ||o.output == 'role="output"'){
					outp = form.find(o.output);
				}
				else if(o.output != ""){
					outp = $(o.output);
					outp.appendTo(form);
				}
				if(outp.length > 0){
					outp.addClass("alert");
					if(valido){
						outp.html(o.rule.valido);
						outp.addClass(o.classVout).removeClass(o.classEout);
					}else{
						outp.html(o.rule.invalido);
						outp.addClass(o.classEout).removeClass(o.classVout);
					}
				}	
			}
		},
		_onlineKey:function(el){
			var self = this, o = this.options, type = el.attr("type"), select = el.is("select");
			if(select){
				el.on("input change",function(e){
					if(this.required){
						var valid = self.funcs.required($(this).val(),$(this));
						if(!valid){ self._showError(el) }
					}
				})
			}
			else if(type == "radio" || type == "checkbox"){
				el.on("input click",function(e){
					if(this.required){
						var valid = self.funcs.required("",$(this));
						if(!valid){ self._showError($(this)) }
					}
				})
			}
			else{
				el.on("input",function(e){
					var yo = $(this);
					var v = yo.val();
					var t = yo.attr("type");
					var f = self.funcs;
					var valid = true;
					if(t in f){
						self.funcs[t](v,yo);
					}
					$.each(f,function(fn,n){
						if(yo.attr(fn) && fn != "required"){
							valid = self.funcs[fn](v,yo.attr(fn));
						}
					})
					if(this.required){
						valid = self.funcs.required(v,yo);
					}
					if(!valid){
						self._showError(yo);
					}
					return valid;
				})
			}
		},
		_destroy: function () {
		},

		_setOption: function ( key, value ) {
			this._super('_setOption', key, value);
		}
	});
	
	
	$.fn.formval = function(){
		var forms = this, elemvalue = {}, l = forms.length;
		this.getatt = function(el){
			if($.isUndefined(el.attr('id')) && $.isUndefined(el.attr("name"))){
				var newid = $.uniqId('fv')
				el.attr('id',newid);
				return newid;				
			}else{
				return el.attr("name") || el.attr('id');
			}
		}
		forms.each(function(){
			var form = $(this);
			var item = form.find(":input").not(":submit");
			var elements = {};
			$.each(item,function(){
				var el = $(this);
				var e = forms.getatt(el);
				var v = el.val();
				if(this.type == "checkbox" || this.type == 'radio'){
					if(this.checked){
						elements[e] = v;
					}
				}else{
					elements[e] = v;
				}
			})
			elemvalue[forms.getatt(form)] = elements;
		});
		return elemvalue;
	}
	
	
	return $.hv.init();
}));
