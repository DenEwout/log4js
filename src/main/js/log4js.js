/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview log4js is a library to log in JavaScript in simmilar manner 
 * than in log4j for Java. The API should be nearly the same.
 * 
 * This file contains all log4js code and is the only file required for logging.
 * 
 * <h3>Example:</h3>
 * <pre>
 *  var log = new Log4js.getLogger("some-category-name"); //create logger instance
 *  log.setLevel(Log4js.Level.TRACE); //set the Level
 *  log.addAppender(new ConsoleAppender(log, false)); // console that launches in new window
 
 *  // if multiple appenders are set all will log
 *  log.addAppender(new ConsoleAppender(log, true)); // console that is inline in the page
 *  log.addAppender(new FileAppender("C:\\somefile.log")); // file appender logs to C:\\somefile.log
 * 
 *  ...
 * 
 *  //call the log
 *  log.trace("trace me" );
 * </pre>
 *
 * @version 0.3
 * @author Stephan Strittmatter - http://jroller.com/page/stritti
 * @author Seth Chisamore - http://www.chisamore.com
 * @since 2005-05-20
 * Website: http://log4js.berlios.de
 */
var Log4js = {
	
	/** 
	 * current version of log4js 
	 * @static
	 * @final
	 */
  	version: "0.3",
  	
  	/**
  	 * default format of date (ISO-8601)
  	 * @static
  	 * @final
  	 */
  	DEFAULT_DATE_FORMAT: "yyyy-MM-ddThh:mm:ssO",

	/**  
	 * map of loggers
	 * @static
	 * @final
	 * @private  
	 */
	loggerMap: null,
	
	/**
	 * Get a logger instance. Instance is cached on categoryName level.
	 * @param  {String} categoryName name of category to log to.
	 * @return {Logger} instance of logger for the category
	 * @static
	 */
	getLogger: function(categoryName) {
		if(Log4js.loggerMap === null || Log4js.loggerMap === "undefined"){
			Log4js.loggerMap = new Log4js.Map();
		}
		if (!Log4js.loggerMap.contains(categoryName))
		{
	   		Log4js.loggerMap.put(categoryName, new Log4js.Logger(categoryName));
		}
		return Log4js.loggerMap.get(categoryName); 
	},
	
	/**
	 * Get the default logger instance.
	 * @return {Logger} instance of default logger
	 * @static
	 */
	getDefaultLogger: function() {
		return Log4js.getLogger("[default]"); 
	},
	
  	/**
  	 * attatch an observer function to an elements event
  	 * @param element element to attach event
  	 * @param name name of event
  	 * @param observer observer method to be called
  	 * @private
  	 */
  	attachEvent: function (element, name, observer) {
		if (element.addEventListener) {
			element.addEventListener(name, observer, false);
    	} else if (element.attachEvent) {
			element.attachEvent('on' + name, observer);
    	}
	}
};


/**
 * Log4js.Level Enumeration. Do not use directly. Use static objects instead.
 * @constructor
 * @param {Number} level number of level
 * @param {String} levelString String representation of level
 * @private
 */
Log4js.Level = function(level, levelStr) {
	this.level = level;
	this.levelStr = levelStr;
};

Log4js.Level.prototype =  {
	/** 
	 * converts given String to corresponding Level
	 * @param {String} sArg String value of Level
	 * @param {Log4js.Level} defaultLevel default Level, if no String representation
	 * @return Level object
	 * @type Log4js.Level
	 */
	toLevel: function(sArg, defaultLevel) {                  
				
		if(sArg === null) {
			return defaultLevel;
		}
		
		if(typeof sArg == "string") { 
			var s = sArg.toUpperCase();
			if(s == "ALL") {return Log4js.Level.ALL;}
			if(s == "DEBUG") {return Log4js.Level.DEBUG;}
			if(s == "INFO") {return Log4js.Level.INFO;}
			if(s == "WARN") {return Log4js.Level.WARN;}
			if(s == "ERROR") {return Log4js.Level.ERROR;}
			if(s == "FATAL") {return Log4js.Level.FATAL;}
			if(s == "OFF") {return Log4js.Level.OFF;}
			if(s == "TRACE") {return Log4js.Level.TRACE;}
			return defaultLevel;
		} else if(typeof sArg == "number") {
			switch(sArg) {
				case ALL_INT: return Log4js.Level.ALL;
				case DEBUG_INT: return Log4js.Level.DEBUG;
				case INFO_INT: return Log4js.Level.INFO;
				case WARN_INT: return Log4js.Level.WARN;
				case ERROR_INT: return Log4js.Level.ERROR;
				case FATAL_INT: return Log4js.Level.FATAL;
				case OFF_INT: return Log4js.Level.OFF;
				case TRACE_INT: return Log4js.Level.TRACE;
				default: return defaultLevel;
			}
		} else {
			return defaultLevel;	
		}
	},	
	/** 
	 * @return  converted Level to String
	 * @type String
	 */		
	toString: function() {
		return this.levelStr;	
	},
	/** 
	 * @return internal Number value of Level
	 * @type Number
	 */			
	valueOf: function() {
		return this.level;
	}
};

// Static variables
/** 
 * @private
 */
Log4js.Level.OFF_INT = Number.MAX_VALUE;
/** 
 * @private
 */
Log4js.Level.FATAL_INT = 50000;
/** 
 * @private
 */
Log4js.Level.ERROR_INT = 40000;
/** 
 * @private
 */
Log4js.Level.WARN_INT = 30000;
/** 
 * @private
 */
Log4js.Level.INFO_INT = 20000;
/** 
 * @private
 */
Log4js.Level.DEBUG_INT = 10000;
/** 
 * @private
 */
Log4js.Level.TRACE_INT = 5000;
/** 
 * @private
 */
Log4js.Level.ALL_INT = Number.MIN_VALUE;

/** 
 * Logging Level OFF - all disabled
 * @type Log4js.Level
 * @static
 */
Log4js.Level.OFF = new Log4js.Level(Log4js.Level.OFF_INT, "OFF");
/** 
 * Logging Level Fatal
 * @type Log4js.Level
 * @static
 */
Log4js.Level.FATAL = new Log4js.Level(Log4js.Level.FATAL_INT, "FATAL");
/** 
 * Logging Level Error
 * @type Log4js.Level
 * @static
 */
Log4js.Level.ERROR = new Log4js.Level(Log4js.Level.ERROR_INT, "ERROR"); 
/** 
 * Logging Level Warn
 * @type Log4js.Level
 * @static
 */
Log4js.Level.WARN = new Log4js.Level(Log4js.Level.WARN_INT, "WARN"); 
/** 
 * Logging Level Info
 * @type Log4js.Level
 * @static
 */
Log4js.Level.INFO = new Log4js.Level(Log4js.Level.INFO_INT, "INFO");     
/** 
 * Logging Level Debug
 * @type Log4js.Level
 * @static
 */
Log4js.Level.DEBUG = new Log4js.Level(Log4js.Level.DEBUG_INT, "DEBUG");  
/** 
 * Logging Level Trace
 * @type Log4js.Level
 * @static
 */
Log4js.Level.TRACE = new Log4js.Level(Log4js.Level.TRACE_INT, "TRACE");  
/** 
 * Logging Level All - All traces are enabled
 * @type Log4js.Level
 * @static
 */
Log4js.Level.ALL = new Log4js.Level(Log4js.Level.ALL_INT, "ALL"); 

/**
 * Log4js CustomEvent
 * @constructor
 * @author Corey Johnson - original code in Lumberjack (http://gleepglop.com/javascripts/logger/)
 * @author Seth Chisamore - adapted for Log4js
 * @private
 */
Log4js.CustomEvent = function() {
	this.listeners = [];
};

Log4js.CustomEvent.prototype = {
 
 	/**
 	 * @param method method to be added
 	 */ 
	addListener : function(method) {
		this.listeners.push(method);
	},

 	/**
 	 * @param method method to be removed
 	 */ 
	removeListener : function(method) {
		var foundIndexes = this._findListenerIndexes(method);

		for(var i = 0; i < foundIndexes.length; i++) {
			this.listeners.splice(foundIndexes[i], 1);
		}
	},

 	/**
 	 * @param handler
 	 */ 
	dispatch : function(handler) {
		for(var i = 0; i < this.listeners.length; i++) {
			try {
				this.listeners[i](handler);
			}
			catch (e) {
				alert("Could not run the listener " + this.listeners[i] + ". \n" + e);
			}
		}
	},

	/**
	 * @private
	 * @param method
	 */
	_findListenerIndexes : function(method) {
		var indexes = [];
		for(var i = 0; i < this.listeners.length; i++) {			
			if (this.listeners[i] == method) {
				indexes.push(i);
			}
		}

		return indexes;
	}
};

/**
 * Models a logging event.
 * @constructor
 * @param {String} categoryName name of category
 * @param {Log4js.Level} level level of message
 * @param {String} message message to log
 * @param {Log4js.Logger} logger the associated logger
 * @author Seth Chisamore
 */
Log4js.LoggingEvent = function(categoryName, level, message, logger) {
	/**
	 * the timestamp of the Logging Event
	 * @type Date
	 * @private
	 */
	this.startTime = new Date();
	/**
	 * category of event
	 * @type String
	 * @private
	 */
	this.categoryName = categoryName || ".";
	/**
	 * the logging message
	 * @type String
	 * @private
	 */
	this.message = message || "";
	/**
	 * level of log
	 * @type Log4js.Level
	 * @private
	 */
	this.level = level || Log4js.Level.TRACE;
	/**
	 * reference to logger
	 * @type Log4js.Logger
	 * @private
	 */
	this.logger = logger;
};

Log4js.LoggingEvent.prototype = {	
	/**
	 * get the timestamp formatted as String.
	 * @return {String} formatted timestamp
	 * @see Log4js#setDateFormat()
	 */
	getFormattedTimestamp: function() {
		return this.logger.getFormattedTimestamp(this.startTime);
	}
};

/**
 * Logger to log messages to the defined appender.</p>
 * Default appender is Appender, which is ignoring all messages. Please
 * use setAppender() to set a specific appender (e.g. WindowAppender).
 * use {@see Log4js#getLogger(String)} to get an instance.
 * @constructor
 * @param name name of category to log to
 * @author Stephan Strittmatter
 */
Log4js.Logger = function(name) {
	this.loggingEvents = [];
	this.appenders = [];
	/** category of logger */
	this.category = name || "";
	/** level to be logged */
	this.level = Log4js.Level.FATAL;
	
	this.dateformat = Log4js.DEFAULT_DATE_FORMAT;
	this.dateformatter = new Log4js.DateFormatter();
	
	this.onlog = new Log4js.CustomEvent();
	this.onclear = new Log4js.CustomEvent();
	
	/** appender to write in */
	this.appenders.push(new Appender(this));
	
	// if multiple log objects are instanciated this will only log to the log object that is declared last
	// can't seem to get the attachEvent method to work correctly
	try {
		window.onerror = this.windowError.bind(this);
	} catch (e) {
		//log4jsLogger.fatal(e);
	}
};

Log4js.Logger.prototype = {

	/**
	 * add additional appender. DefaultAppender always is there.
	 * @param appender additional wanted appender
	 */
	addAppender: function(appender) {
		this.appenders.push(appender);
	},

	/**
	 * set Array of appenders. Previous Appenders are cleared and removed.
	 * @param {Array} appenders Array of Appenders
	 */
	setAppenders: function(appenders) {
		//clear first all existing appenders
		for(var i = 0; i < this.appenders.length; i++) {
			this.appenders[i].doClear();
		}
		
		this.appenders = appenders;
	},
	
	/**
	 * Set the Loglevel default is LogLEvel.TRACE
	 * @param level wanted logging level
	 */
	setLevel: function(level) {
		this.level = level;
	},
	
	/** main log method logging to all available appenders */
	log: function(message, logLevel) {
		var loggingEvent = new Log4js.LoggingEvent(this.category, logLevel, message, this);
		this.loggingEvents.push(loggingEvent);
		this.onlog.dispatch(loggingEvent);
	},
	
	/** clear logging */
	clear : function () {
		try{
			this.loggingEvents = [];
			this.onclear.dispatch();
		} catch(e){}
	},
	/** checks if Level Trace is enabled */
	isTraceEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.TRACE.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging trace messages */
	trace: function(message) {
		if (this.isTraceEnabled()) {
			this.log(message, Log4js.Level.TRACE);
		}
	},
	/** checks if Level Debug is enabled */
	isDebugEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.DEBUG.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging debug messages */
	debug: function(message) {
		if (this.isDebugEnabled()) {
			this.log(message, Log4js.Level.DEBUG);
		}
	},
	/** checks if Level Info is enabled */
	isInfoEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.INFO.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging info messages */
	info: function(message) {
		if (this.isInfoEnabled()) {
			this.log(message, Log4js.Level.INFO);
		}
	},
	/** checks if Level Warn is enabled */
	isWarnEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.WARN.valueOf()) {
			return true;
		}
		return false;
	},

	/** logging warn messages */
	warn: function(message) {
		if (this.isWarnEnabled()) {
			this.log(message, Log4js.Level.WARN);
		}
	},
	/** checks if Level Error is enabled */
	isErrorEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.ERROR.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging error messages */
	error: function(message) {
		if (this.isErrorEnabled()) {
			this.log(message, Log4js.Level.ERROR);
		}
	},
	/** checks if Level Fatal is enabled */
	isFatalEnabled: function() {
		if (this.level.valueOf() <= Log4js.Level.FATAL.valueOf()) {
			return true;
		}
		return false;
	},
	/** logging fatal messages */
	fatal: function(message) {
		if (this.isFatalEnabled()) {
			this.log(message, Log4js.Level.FATAL);
		}
	},
	
	/** capture main window errors and log as fatal */
	windowError: function(msg, url, line){
		var message = "Error in (" + (url || window.location) + ") on line "+ line +" with message (" + msg + ")";
		this.log(message, Log4js.Level.FATAL);	
	},
	
	/**
	 * Set the date format of logger. Following switches are supported:
	 * <ul>
	 * <li>yyyy - The year</li>
	 * <li>MM - the month</li>
	 * <li>dd - the day of month<li>
	 * <li>hh - the hour<li>
	 * <li>mm - minutes</li>
	 * <li>O - timezone offset</li>
	 * </ul>
	 * @param {String} format format String for the date
	 * @see #getTimestamp
	 */
	setDateFormat: function(format) {
	 	this.dateformat = format;
	},
	 
	/**
	 * Generates a timestamp using the format set in {Log4js.setDateFormat}.
	 * @param {Date} date the date to format
	 * @see #setDateFormat
	 * @return A formatted timestamp with the current date and time.
	 */
	getFormattedTimestamp: function(date) {
	  return this.dateformatter.formatDate(date, this.dateformat);
	}
};

/**
 * Interface for Appender.
 * Use this appender as "interface" for other appenders. It is doing nothing.
 *
 * @constructor
 * @param {Log4js.Logger} logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
function Appender(logger) {
	// add listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));
	/**
	 * set reference to calling logger
	 * @type Log4js.Logger
	 * @private
	 */
	this.logger = logger;
}

Appender.prototype = {
	/** 
	 * appends the given loggingEvent appender specific
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to append
	 */
	doAppend: function(loggingEvent) {
		return;
	},
	/** 
	 * clears the Appender
	 */
	doClear: function() {
		return;
	},
	
	/**
	 * Set the Layout for this appender.
	 * @param {Layout} layout Layout for formatting loggingEvent
	 */
	setLayout: function(layout){
		this.layout = layout;
	} 
};

/**
 * Interface for Layouts.
 * Use this Layout as "interface" for other Layouts. It is doing nothing.
 *
 * @constructor
 * @author Stephan Strittmatter
 */
function Layout() {return;}
Layout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return "";
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return null;
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return null;
	}
};

/**
 * Console Appender writes the logs to a console.  If "useWindow" is
 * set to "true" the console launches in another window otherwise
 * the window is inline on the page and toggled on and off with "Alt-D".

 * @constructor
 * @extends Appender
 * @param {Log4js.Logger} logger log4js instance this appender is attached to
 * @param {boolean} inline boolean value that indicates whether the console be placed inline, default is to launch in new window
 *
 * @author Corey Johnson - original console code in Lumberjack (http://gleepglop.com/javascripts/logger/)
 * @author Seth Chisamore - adapted for use as a log4js appender
 */
function ConsoleAppender(logger, inline) {
	// add  listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));
	/**
	 * set reference to calling logger
	 * @type Log4js.Logger
	 */
	this.logger = logger;
	/**
	 * @type Layout
	 */
	this.layout = new SimpleLayout();
	/**
	 * @type boolean
	 */
	this.inline = inline || false;

	/**
	 * @type String
	 */
	this.accesskey = "d";
	
	this.tagPattern = null;
		
	if(this.inline) {
		Log4js.attachEvent(window, 'load', this.initialize.bind(this));
	}
}
ConsoleAppender.superclass = Appender.prototype;
ConsoleAppender.prototype = {  

	commandHistory : [],
  	commandIndex : 0,

	/**
	 * Set the access key to show/hide the inline console (default &quote;d&quote;)
	 * @param key access key to show/hide the inline console
	 */	
	setAccessKey : function(key) {
		this.accesskey = key;
	},
	
	/**
	 * @private
	 */
  	initialize : function() {
		
		var doc = document;	
		var win = window;
		
		if(!this.inline) {
			window.top.consoleWindow = window.open("", this.logger.category, "left=0,top=0,width=700,height=700,scrollbars=no,status=no,resizable=no;toolbar=no");
			window.top.consoleWindow.opener = self;
			win = window.top.consoleWindow;
			doc = win.document;
			doc.open();
			doc.write("<!DOCTYPE html PUBLIC -//W3C//DTD XHTML 1.0 Transitional//EN ");
			doc.write("  http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>\n\n");
			doc.write("<html><head><title>" + this.logger.category + "</title>\n");
			doc.write("</head><body style=\"background-color:darkgray\"></body>\n");
			win.blur();
			win.focus();
		}
		
		this.docReference = doc;
		this.winReference = win;
		
		this.outputCount = 0;
		this.tagPattern = ".*";
	  
		// I hate writing javascript in HTML... but what's a better alternative
		this.logElement = doc.createElement('div');
		doc.body.appendChild(this.logElement);
		this.logElement.style.display = 'none';
		
		this.logElement.style.position = "absolute";
		this.logElement.style.left = '0px';
		this.logElement.style.width = '100%';
	
		this.logElement.style.textAlign = "left";
		this.logElement.style.fontFamily = "lucida console";
		this.logElement.style.fontSize = "100%";
		this.logElement.style.backgroundColor = 'darkgray';      
		this.logElement.style.opacity = 0.9;
		this.logElement.style.zIndex = 2000; 
	
		// Add toolbarElement
		this.toolbarElement = doc.createElement('div');
		this.logElement.appendChild(this.toolbarElement);     
		this.toolbarElement.style.padding = "0 0 0 2px";
	
		// Add buttons        
		this.buttonsContainerElement = doc.createElement('span');
		this.toolbarElement.appendChild(this.buttonsContainerElement); 
	
		if(this.inline) {
			var closeButton = doc.createElement('button');
			closeButton.style.cssFloat = "right";
			closeButton.style.styleFloat = "right"; // IE dom bug...doesn't understand cssFloat
			closeButton.style.color = "black";
			closeButton.innerHTML = "close";
			closeButton.onclick = this.toggle.bind(this);
			this.buttonsContainerElement.appendChild(closeButton);
		}
		
		var clearButton = doc.createElement('button');
		clearButton.style.cssFloat = "right";
		clearButton.style.styleFloat = "right"; // IE dom bug...doesn't understand cssFloat
		clearButton.style.color = "black";
		clearButton.innerHTML = "clear";
		clearButton.onclick = this.logger.clear.bind(this.logger);
		this.buttonsContainerElement.appendChild(clearButton);
	
		//Add Level Filter
		this.tagFilterContainerElement = doc.createElement('span');
		this.toolbarElement.appendChild(this.tagFilterContainerElement);
		this.tagFilterContainerElement.style.cssFloat = 'left';
		this.tagFilterContainerElement.appendChild(doc.createTextNode("Level Filter"));
		
		this.tagFilterElement = doc.createElement('input');
		this.tagFilterContainerElement.appendChild(this.tagFilterElement);
		this.tagFilterElement.style.width = '200px';                    
		this.tagFilterElement.value = this.tagPattern;    
		this.tagFilterElement.setAttribute('autocomplete', 'off'); // So Firefox doesn't flip out
		
		Log4js.attachEvent(this.tagFilterElement, 'keyup', this.updateTags.bind(this));
		Log4js.attachEvent(this.tagFilterElement, 'click', function() {this.tagFilterElement.select();}.bind(this));
		
		// Add outputElement
		this.outputElement = doc.createElement('div');
		this.logElement.appendChild(this.outputElement);  
		this.outputElement.style.overflow = "auto";              
		this.outputElement.style.clear = "both";
		this.outputElement.style.height = (this.inline) ? ("200px"):("650px");
		this.outputElement.style.width = "100%";
		this.outputElement.style.backgroundColor = 'black'; 
			  
		this.inputContainerElement = doc.createElement('div');
		this.inputContainerElement.style.width = "100%";
		this.logElement.appendChild(this.inputContainerElement);      
		
		this.inputElement = doc.createElement('input');
		this.inputContainerElement.appendChild(this.inputElement);  
		this.inputElement.style.width = '100%';
		this.inputElement.style.borderWidth = '0px'; // Inputs with 100% width always seem to be too large (I HATE THEM) they only work if the border, margin and padding are 0
		this.inputElement.style.margin = '0px';
		this.inputElement.style.padding = '0px';
		this.inputElement.value = 'Type command here'; 
		this.inputElement.setAttribute('autocomplete', 'off'); // So Firefox doesn't flip out
	
		Log4js.attachEvent(this.inputElement, 'keyup', this.handleInput.bind(this));
		Log4js.attachEvent(this.inputElement, 'click', function() {this.inputElement.select();}.bind(this));
		
		if(this.inline){
			window.setInterval(this.repositionWindow.bind(this), 500);
			this.repositionWindow();	
			// Allow acess key link          
			var accessElement = doc.createElement('button');
			accessElement.style.position = "absolute";
			accessElement.style.top = "-100px";
			accessElement.accessKey = this.accesskey;
			accessElement.onclick = this.toggle.bind(this);
			doc.body.appendChild(accessElement);
		} else {
			this.show();
		}
	},
	/**
	 * shows/hide an element
	 * @private
	 */
	toggle : function() {
		if (this.logElement.style.display == 'none') {
		 	this.show();
		} else {
			this.hide();
		}
	}, 
	/**
	 * @private
	 */
	show : function() {
		this.logElement.style.display = '';
	  	this.outputElement.scrollTop = this.outputElement.scrollHeight; // Scroll to bottom when toggled
 	  	this.inputElement.select();
	}, 
	/**
	 * @private
	 */	
	hide : function() {
		this.logElement.style.display = 'none';
	},  
	/**
	 * @private
	 * @param message
	 * @style
	 */	
	output : function(message, style) {

		// If we are at the bottom of the window, then keep scrolling with the output			
		var shouldScroll = (this.outputElement.scrollTop + (2 * this.outputElement.clientHeight)) >= this.outputElement.scrollHeight;
		
		this.outputCount++;
	  	style = (style ? style += ';' : '');	  	
	  	style += 'padding:1px;margin:0 0 5px 0';	     
		  
		if (this.outputCount % 2 === 0) {
			style += ";background-color:#101010";
		}
	  	
	  	message = message || "undefined";
	  	message = message.toString();
	  	
	  	this.outputElement.innerHTML += "<pre style='" + style + "'>" + message + "</pre>";
	  	
	  	if (shouldScroll) {				
			this.outputElement.scrollTop = this.outputElement.scrollHeight;
		}
	},
	
	/**
	 * @private
	 */
	updateTags : function() {
		
		var pattern = this.tagFilterElement.value;
	
		if (this.tagPattern == pattern) {
			return;
		}
		
		try {
			new RegExp(pattern);
		} catch (e) {
			return;
		}
		
		this.tagPattern = pattern;

		this.outputElement.innerHTML = "";
		
		// Go through each log entry again
		this.outputCount = 0;
		for (var i = 0; i < this.logger.loggingEvents.length; i++) {
  			this.doAppend(this.logger.loggingEvents[i]);
		}  
	},

	/**
	 * @private
	 */	
	repositionWindow : function() {
		var offset = window.pageYOffset || this.docReference.documentElement.scrollTop || this.docReference.body.scrollTop;
		var pageHeight = self.innerHeight || this.docReference.documentElement.clientHeight || this.docReference.body.clientHeight;
		this.logElement.style.top = (offset + pageHeight - this.logElement.offsetHeight) + "px";
	},

	/**
	 * @param loggingEvent event to be logged
	 * @see Appender#doAppend
	 */
	doAppend : function(loggingEvent) {
		
		if ((!this.inline) && (!this.winReference || this.winReference.closed)) {
			this.initialize();
		}
		
		if (this.tagPattern !== null && 
			loggingEvent.level.toString().search(new RegExp(this.tagPattern, 'igm')) == -1) {
			return;
		}
		
		var style = '';
	  	
		if (loggingEvent.level.toString().search(/ERROR/) != -1) { 
			style += 'color:red';
		} else if (loggingEvent.level.toString().search(/FATAL/) != -1) { 
			style += 'color:red';
		} else if (loggingEvent.level.toString().search(/WARN/) != -1) { 
			style += 'color:orange';
		} else if (loggingEvent.level.toString().search(/DEBUG/) != -1) {
			style += 'color:green';
		} else if (loggingEvent.level.toString().search(/INFO/) != -1) {
			style += 'color:white';
		} else {
			style += 'color:yellow';
		}
	
		this.output(this.layout.format(loggingEvent), style);	
	},

	/**
	 * @see Appender#doClear
	 */
	doClear : function() {
		this.outputElement.innerHTML = "";
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	/**
	 * @private
	 * @param e
	 */
	handleInput : function(e) {
		if (e.keyCode == 13 ) {      
			var command = this.inputElement.value;
			
			switch(command) {
				case "clear":
					this.logger.clear();  
					break;
					
				default:        
					var consoleOutput = "";
				
					try {
						consoleOutput = eval(this.inputElement.value);
					} catch (e) {  
						this.logger.error("Problem parsing input <" + command + ">" + e.message);
						break;
					}
						
					this.logger.trace(consoleOutput);
					break;
			}        
		
			if (this.inputElement.value !== "" && this.inputElement.value !== this.commandHistory[0]) {
				this.commandHistory.unshift(this.inputElement.value);
			}
		  
			this.commandIndex = 0;
			this.inputElement.value = "";                                                     
		} else if (e.keyCode == 38 && this.commandHistory.length > 0) {
    		this.inputElement.value = this.commandHistory[this.commandIndex];

			if (this.commandIndex < this.commandHistory.length - 1) {
      			this.commandIndex += 1;
      		}
    	} else if (e.keyCode == 40 && this.commandHistory.length > 0) {
    		if (this.commandIndex > 0) {                                      
      			this.commandIndex -= 1;
	    	}                       

			this.inputElement.value = this.commandHistory[this.commandIndex];
	  	} else {
    		this.commandIndex = 0;
    	}
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "ConsoleAppender[inline=" + this.inline + "]"; 
	 }
};

/**
 * Metatag Appender writing the logs to meta tags
 *
 * @extends Appender
 * @constructor
 * @param logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
function MetatagAppender(logger) {
	// add  listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));
	/**
	 * set reference to calling logger
	 * @type Log4js.Logger
	 */
	this.logger = logger;
	this.currentLine = 0;
}
MetatagAppender.prototype = {
	/**
	 * @param loggingEvent event to be logged
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		var now = new Date();
		var lines = loggingEvent.message.split("\n");
		var headTag = document.getElementsByTagName("head")[0];

		for (var i = 1; i <= lines.length; i++) {
			var value = lines[i - 1];
			if (i == 1) {
				value = loggingEvent.level.toString() + ": " + value;
			} else {
				value = "> " + value;
			}

			var metaTag = document.createElement("meta");
			metaTag.setAttribute("name", "X-log4js:" + this.currentLine);
			metaTag.setAttribute("content", value);
			headTag.appendChild(metaTag);
			this.currentLine += 1;
		}
	},
	/**
	 * do nothing
	 * @see Appender#doClear
	 */	
	doClear: function() {
		return;
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "MetatagAppender"; 
	 }
};

/**
 * AJAX Appender sending {@link Log4js.LoggingEvent}s asynchron via 
 * <code>XMLHttpRequest</code> to server.<br />
 * The {@link Log4js.LoggingEvent} is POSTed as response content and is 
 * formatted by the accociated layout. Default layout is {@link XMLLayout}. 
 * The <code>threshold</code> defines when the logs 
 * should be send to the server. By default every event is sent on its
 * own (threshold=1). If it is set to 10, then the events are send in groups of
 * 10 events.
 *
 * @extends Appender 
 * @constructor
 * @param {Log4js.Logger} logger log4js instance this appender is attached to
 * @param {String} loggingUrl url where appender will post log messages to
 * @author Stephan Strittmatter
 */
function AjaxAppender(logger, loggingUrl) {
	// add  listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));

	/**
	 * is still esnding data to server
	 * @type boolean
	 * @private
	 */
	this.isInProgress = false;
	
	/**
	 * set reference to calling logger
	 * @type Log4js.Logger
	 * @private
	 */
	this.logger = logger;
	
	/**
	 * @type XMLHttpRequest
	 * @private
	 */
	this.httpRequest = false;
	
	/**
	 * @type String
	 * @private
	 */
	this.loggingUrl = loggingUrl || "log4js.jsp";
	
	/**
	 * @type Integer
	 * @private
	 */
	this.threshold = 1;
	
	/**
	 * timeout when request is aborted.
	 * @private
	 */
	this.timeout = 2000;
	
	/**
	 * List of LoggingEvents which should be send after threshold is reached.
	 * @type Map
	 * @private
	 */
	this.loggingEventMap = new Log4js.FifoBuffer();

	/**
	 * @type Layout
	 * @private
	 */
	this.layout = new XMLLayout();
	
	this.httpRequest = this.getXmlHttpRequest();
}

AjaxAppender.prototype = {
	/**
	 * sends the logs to the server
	 * @param loggingEvent event to be logged
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		log4jsLogger.trace("> AjaxAppender.append");
	
		if (this.loggingEventMap.length() <= this.threshold || this.isInProgress === true) {
			this.loggingEventMap.push(loggingEvent);
		}
		
		if(this.loggingEventMap.length() >= this.threshold && this.isInProgress === false) {
			//if threshold is reached send the events and reset current threshold
			this.send();
		}
		
		log4jsLogger.trace("< AjaxAppender.append");
	},
	
	/** @see Appender#doClear */
	doClear: function() {
		log4jsLogger.trace("> AjaxAppender.doClear" );
		if(this.loggingEventMap.length() > 0) {
			this.send();
		}
		log4jsLogger.trace("< AjaxAppender.doClear" );
	},
	
	/** @see Appender#setLayout */
	setLayout: function(layout){
		this.layout = layout;
	},
	
	/**
	 * Set the threshold when logs have to be send. Default threshold is 1.
	 * @praram {int} threshold new threshold
	 */
	setThreshold: function(threshold) {
		log4jsLogger.trace("> AjaxAppender.setThreshold: " + threshold );
		this.threshold = threshold;
		log4jsLogger.trace("< AjaxAppender.setThreshold" );
	},
	
	/**
	 * Set the timeout in milli seconds until sending request is aborted.
	 * Default is 2000 ms.
	 * @param {int} milliseconds the new timeout
	 */
	setTimeout: function(milliseconds) {
		this.timeout = milliseconds;
	},
	
	/**
	 * send the request.
	 */
	send: function() {
		log4jsLogger.trace("> AjaxAppender.send");
		
		this.isInProgress = true;
		
		var content = this.layout.getHeader();
		
		for(var i = 0; i < this.loggingEventMap.length() && i < this.threshold; i++) {
			content +=  this.layout.format(this.loggingEventMap.pull());
		} 
		
		content += this.layout.getFooter();
		

		var appender = this;
		
		this.httpRequest.onreadystatechange = function() {
			appender.onReadyStateChanged.call(appender);
		};
		
		this.httpRequest.open("POST", this.loggingUrl, true);
		// set the request headers.
		this.httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//REFERER will be the top-level
		// URI which may differ from the location of the error if
		// it occurs in an included .js file
		this.httpRequest.setRequestHeader("REFERER", location.href);
 		this.httpRequest.setRequestHeader("Content-length", content.length);
		this.httpRequest.setRequestHeader("Connection", "close");
		this.httpRequest.send(content);
		
		var appender = this;
		
		try {
			window.setTimeout(function(){
				log4jsLogger.trace("> AjaxAppender.timeout");
				appender.httpRequest.onreadystatechange = function(){};
				appender.httpRequest.abort();
				//this.httpRequest = null;
				appender.isInProgress = false;
	
				if(appender.loggingEventMap.length() > 0) {
					appender.send();
				}
				log4jsLogger.trace("< AjaxAppender.timeout");
			}, this.timeout);
		} catch (e) {
			log4jsLogger.fatal(e);
		}
		log4jsLogger.trace("> AjaxAppender.send");
	},
	
	/**
	 * @private
	 */
	onReadyStateChanged: function() {
		log4jsLogger.trace("> AjaxAppender.onReadyStateChanged");
		var req = this.httpRequest;
		if (this.httpRequest.readyState != 4) { 
			log4jsLogger.trace("< AjaxAppender.onReadyStateChanged: readyState " + req.readyState + " != 4");
			return; 
		}
		
		var success = ((typeof req.status === "undefined") || req.status === 0 || (req.status >= 200 && req.status < 300));
		
		if (success) {
			log4jsLogger.trace("  AjaxAppender.onReadyStateChanged: success");

			//ready sending data
			this.isInProgress = false;

		} else {
			var msg = "  AjaxAppender.onReadyStateChanged: XMLHttpRequest request to URL " + this.loggingUrl + " returned status code " + httpRequest.status;
			log4jsLogger.error(msg);
		}
		
		log4jsLogger.trace("< AjaxAppender.onReadyStateChanged: readyState == 4");		
	},
	/**
	 * Get the XMLHttpRequest object independent of browser.
	 * @private
	 */
	getXmlHttpRequest: function() {
		log4jsLogger.trace("> AjaxAppender.getXmlHttpRequest");
		
		var httpRequest = false;

		try {		
			if (window.XMLHttpRequest) { // Mozilla, Safari, IE7...
					httpRequest = new XMLHttpRequest();
				if (httpRequest.overrideMimeType) {
					httpRequest.overrideMimeType(this.layout.getContentType());
				}
			} else if (window.ActiveXObject) { // IE
				try {
					httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
				}
			}
		} catch (e) {
			httpRequest = false
		}
		
		if (!httpRequest) {
			log4jsLogger.fatal(
				"Unfortunatelly your browser does not support AjaxAppender for log4js!");
		}
		
		log4jsLogger.trace("< AjaxAppender.getXmlHttpRequest");
		return httpRequest;
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "AjaxAppender[loggingUrl=" + this.loggingUrl + ", threshold=" + this.threshold + "]"; 
	 }
};

/**
 * File Appender writing the logs to a text file.
 * PLEASE NOTE - Only works in IE and Mozilla 
 * use ActiveX to write file on IE
 * use XPCom components  to write file on Mozilla
 * 
 * @extends Appender 
 * @constructor
 * @param logger log4js instance this appender is attached to
 * @param file file log messages will be written to
 * @author Seth Chisamore
 * @author Nicolas Justin njustin@idealx.com
 * @author Gregory Kokanosky gkokanosky@idealx.com
 */
function FileAppender(logger, file) {
	// add listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));
	/**
	 * set reference to calling logger
	 * @type Log4js.Logger
	 */
	this.logger = logger;
	this.layout = new SimpleLayout();
	this.isIE = true;
	
	this.file = file || "C:\\log4js.log";	
	
	try{
		this.fso = new ActiveXObject("Scripting.FileSystemObject");
	} catch(e){
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			this.fso =  Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			this.isIE = false; //mozilla & co
		} catch (e) {}
	}
}

FileAppender.prototype = {
	/**
	 * @param loggingEvent event to be logged
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		try {
			if( this.isIE ){
				// try opening existing file, create if needed
				var fileHandle = this.fso.OpenTextFile(this.file, 8, true);        
				// write out our data
				fileHandle.WriteLine(this.layout.format(loggingEvent));
				fileHandle.close();   
			} else {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				this.fso.initWithPath(this.file);
        			if(!this.fso.exists()) //create file if needed
	            			this.fso.create(0x00, 0600);
				
 				var fileHandle = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
        			fileHandle.init( this.fso, 0x04 | 0x08 | 0x10, 064, 0);
				var line = this.layout.format(loggingEvent);
        			fileHandle.write(line, line.length); //write data
        			fileHandle.close();
			}
		} catch (e) {}
	},
	/*
	 * @see Appender#doClear
	 */
	doClear: function() {
		try {
			if( this.isIE ){
				var fileHandle = this.fso.GetFile(this.file);
				fileHandle.Delete();
			} else {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				this.fso.initWithPath(this.file);
				if(this.fso.exists()) {
					this.fso.remove(false);
				}
			}
		} catch (e) {}
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "FileAppender[file=" + this.file + "]"; 
	 }
};

/**
 * Windows Event Appender writes the logs to the Windows Event log.
 * PLEASE NOTE - Only works in IE..uses ActiveX to write to Windows Event log
 *
 * @extends Appender 
 * @constructor
 * @param logger log4js instance this appender is attached to
 * @author Seth Chisamore
 */
function WindowsEventAppender(logger) {
	// add  listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));
	/**
	 * set reference to calling logger
	 * @type Log4js.Logger
	 */
	this.logger = logger;
	this.layout = new SimpleLayout();
	
	try {
		this.shell = new ActiveXObject("WScript.Shell");
	} catch(e) {}
}

WindowsEventAppender.prototype = {
	/**
	 * @param loggingEvent event to be logged
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		var winLevel = 4;
		
		// Map log level to windows event log level.
		// Windows events: - SUCCESS: 0, ERROR: 1, WARNING: 2, INFORMATION: 4, AUDIT_SUCCESS: 8, AUDIT_FAILURE: 16
		switch (loggingEvent.level) {	
			case Log4js.Level.FATAL:
				winLevel = 1;
				break;
			case Log4js.Level.ERROR:
				winLevel = 1;
				break;
			case Log4js.Level.WARN:
				winLevel = 2;
				break;
			default:
				winLevel = 4;
				break;
		}
		
		try {
			this.shell.LogEvent(winLevel, this.level.format(loggingEvent));
		} catch(e) {
				
		}
	},
	/**
	 * @see Appender#doClear
	 */
	doClear: function() {
		return;
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "WindowsEventAppender"; 
	 } 
};

/**
 * JS Alert Appender writes the logs to the JavaScript alert dialog box
 * @constructor
 * @extends Appender  
 * @param logger log4js instance this appender is attached to
 * @author S&eacute;bastien LECACHEUR
 */
function JSAlertAppender(logger) {
	// add listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));
	/**
	 * set reference to calling logger
	 * @type Log4js.Logger
	 */
	this.logger = logger;
	this.layout = new SimpleLayout();
}
 
JSAlertAppender.prototype = {
	/** 
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		alert(this.layout.getHeader() + this.layout.format(loggingEvent) + this.layout.getFooter());
	},
	/** 
	 * @see Appender#doClear
	 */
	doClear: function() {
		return;
	},
	
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	}, 
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "JSAlertAppender"; 
	 }	
};

/**
 * Appender writes the logs to the JavaScript console of Mozilla browser
 * More infos: http://kb.mozillazine.org/index.php?title=JavaScript_Console&redirect=no
 * PLEASE NOTE - Only works in Mozilla browser
 * @constructor
 * @extends Appender  
 * @param logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
function MozJSConsoleAppender(logger) {
	// add listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));

	this.logger = logger;
	this.layout = new SimpleLayout();
	netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	this.jsConsole = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	this.scriptError = Components.classes["@mozilla.org/scripterror;1"].createInstance(Components.interfaces.nsIScriptError);
}

MozJSConsoleAppender.superclass = Appender.prototype;
MozJSConsoleAppender.prototype = {
	/** 
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		this.scriptError.init(this.layout.format(loggingEvent), null, null, null, null, this.getFlag(loggingEvent), loggingEvent.categoryName);
		this.jsConsole.logMessage(this.scriptError);
	},
	/** 
	 * @see Appender#doClear
	 */
	doClear: function() {
		return;
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "MozJSConsoleAppender"; 
	 },
	 
	/**
	 * map Log4js.Level to jsConsole Flag
	 * @private
	 */	
	getFlag: function(loggingEvent)
	{
		var retval;
		switch (loggingEvent.level) {	
			case Log4js.Level.FATAL:
				retval = 2;//nsIScriptError.exceptionFlag = 2
				break;
			case Log4js.Level.ERROR:
				retval = 0;//nsIScriptError.errorFlag
				break;
			case Log4js.Level.WARN:
				retval = 1;//nsIScriptError.warningFlag = 1
				break;
			default:
				retval = 1;//nsIScriptError.warningFlag = 1
				break;
		}
		//nsIScriptError.strictFlag = 4
		
		return retval;		
	}
};

/**
 * Appender writes the logs to the JavaScript console of Opera browser
 * PLEASE NOTE - Only works in Opera browser
 * @constructor
 * @extends Appender  
 * @param logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
function OperaJSConsoleAppender(logger) {
	// add listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));

	this.logger = logger;
	this.layout = new SimpleLayout();

}

OperaJSConsoleAppender.superclass = Appender.prototype;
OperaJSConsoleAppender.prototype = {
	/** 
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		opera.postError(this.layout.format(loggingEvent));
	},
	/** 
	 * @see Appender#doClear
	 */
	doClear: function() {
		return;
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "OperaJSConsoleAppender"; 
	 }
};

/**
 * Appender writes the logs to the JavaScript console of Safari browser
 * PLEASE NOTE - Only works in Safari browser
 * @constructor
 * @extends Appender  
 * @param logger log4js instance this appender is attached to
 * @author Stephan Strittmatter
 */
function SafariJSConsoleAppender(logger) {
	// add listener to the logger methods
	logger.onlog.addListener(this.doAppend.bind(this));
	logger.onclear.addListener(this.doClear.bind(this));

	this.logger = logger;
	this.layout = new SimpleLayout();
}

SafariJSConsoleAppender.superclass = Appender.prototype;
SafariJSConsoleAppender.prototype = {
	/** 
	 * @see Appender#doAppend
	 */
	doAppend: function(loggingEvent) {
		window.console.log(this.layout.format(loggingEvent));
	},
	/** 
	 * @see Appender#doClear
	 */
	doClear: function() {
		return;
	},
	/**
	 * @see Appender#setLayout
	 */
	setLayout: function(layout){
		this.layout = layout;
	},
	
	/** 
	 * toString
	 */
	 toString: function() {
	 	return "SafariJSConsoleAppender"; 
	 }
};


/**
 * SimpleLayout consists of the level of the log statement, followed by " - " 
 * and then the log message itself. For example,
 * <code>DEBUG - Hello world</code>
 *
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function SimpleLayout() {
	this.LINE_SEP  = "\n";
	this.LINE_SEP_LEN = 1;
}
SimpleLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return loggingEvent.level.toString() + " - " + loggingEvent.message + this.LINE_SEP;
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	}
};
	
/**
 * BasicLayout is a simple layout for storing the loggs. The loggs are stored
 * in following format:
 * <pre>
 * categoryName~startTime [logLevel] message\n
 * </pre>
 *
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function BasicLayout() {
	this.LINE_SEP  = "\n";
}
BasicLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return loggingEvent.categoryName + "~" + loggingEvent.startTime.toLocaleString() + " [" + loggingEvent.level.toString() + "] " + loggingEvent.message + this.LINE_SEP;
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/plain".
	 * @type String
	 */
	getContentType: function() {
		return "text/plain";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	}
};

/**
 * HtmlLayout write the logs in Html format.
 *
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function HtmlLayout() {return;}
HtmlLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		return "<div style=\"" + this.getStyle(loggingEvent) + "\">" + loggingEvent.getFormattedTimestamp() + " - " + loggingEvent.level.toString() + " - " + loggingEvent.message + "</div>\n";
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/html".
	 * @type String
	 */
	getContentType: function() {
		return "text/html";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "<html><head><title>log4js</head><body>";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "</body></html>";
	},
	
	getStyle: function(loggingEvent)
	{
		var style;
		if (loggingEvent.level.toString().search(/ERROR/) != -1) { 
			style = 'color:red';
		} else if (loggingEvent.level.toString().search(/FATAL/) != -1) { 
			style = 'color:red';
		} else if (loggingEvent.level.toString().search(/WARN/) != -1) { 
			style = 'color:orange';
		} else if (loggingEvent.level.toString().search(/DEBUG/) != -1) {
			style = 'color:green';
		} else if (loggingEvent.level.toString().search(/INFO/) != -1) {
			style = 'color:white';
		} else {
			style = 'color:yellow';
		}	
		return style;
	}
};

/**
 * XMLLayout write the logs in XML format.
 * Layout is simmilar to log4j's XMLLayout:
 * <pre>
 * <log4js:event category="category" level="Level" client="Client" referer="ref" timestam="Date">
 * <log4js:message>Logged message</log4js:message>
 * </log4js:event>
 * </pre>
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function XMLLayout() {return;}
XMLLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {
		var content = "\t<log4js:event logger=\"";
		content += loggingEvent.categoryName + "\" level=\"";
		content += loggingEvent.level.toString() + "\" client=\"";
		content += navigator.userAgent + "\" referer=\"";
		content += location.href + "\" timestamp=\"";
		content += loggingEvent.getFormattedTimestamp() + "\">\n\t\t";
		content += "<log4js:message><![CDATA[" + loggingEvent.message + "]]></log4js:message>\n";	
 		content += "\t</log4js:event>\n";
        
      return content;
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/xml".
	 * @type String
	 */
	getContentType: function() {
		return "text/xml";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "<log4js:eventSet version=\"" + Log4js.version + 
			"\" xmlns:log4js=\"http://log4js.berlios.de/log4js/\">\n";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "</log4js:eventSet>\n";
	}
};

/**
 * JSONLayout write the logs in JSON format.
 * JSON library is required to use this Layout. See also {@link http://www.json.org}
 * @constructor
 * @extends Layout
 * @author Stephan Strittmatter
 */
function JSONLayout() {return;}
JSONLayout.prototype = {
	/** 
	 * Implement this method to create your own layout format.
	 * @param {Log4js.LoggingEvent} loggingEvent loggingEvent to format
	 * @return formatted String
	 * @type String
	 */
	format: function(loggingEvent) {        
        return JSON.stringify(loggingEvent);
	},
	/** 
	 * Returns the content type output by this layout. 
	 * @return The base class returns "text/xml".
	 * @type String
	 */
	getContentType: function() {
		return "text/json";
	},
	/** 
	 * @return Returns the header for the layout format. The base class returns null.
	 * @type String
	 */
	getHeader: function() {
		return "";
	},
	/** 
	 * @return Returns the footer for the layout format. The base class returns null.
	 * @type String
	 */
	getFooter: function() {
		return "";
	}
};

/**
 * Implementtion of java.HashMap
 * @private 
 */
Log4js.Map = function() {
	this.keys = new Array();
};

Log4js.Map.prototype = {
	/** */
    contains : function(key){
       var entry = this.findEntry(key);
       return !(entry === null || entry instanceof NullKey);
    },
    /** */
    get : function(key) {
     var entry = this.findEntry(key);
     if ( !(entry === null || entry instanceof NullKey) )
        return entry.value;
      else
        return null;
    },
    /** */
    put : function(key, value) {
      var entry = this.findEntry(key);
      if (entry){
        entry.value = value;
      } else {
        this.addNewEntry(key, value);
      }
    },
    /** */
    remove : function (key){
      for (var i=0;i<this.keys.length;i++){
        var entry = this.keys[i];
        if (entry instanceof NullKey) continue;
        if (entry.key == key){
            this.keys[i] = NullKey;
        }
      }        
    },
    /** */
    size : function() {
    	return this.keys.length;
    },
    /** */
    findEntry: function(key){
      for (var i=0;i<this.keys.length;i++){
        var entry = this.keys[i];
        if (entry instanceof NullKey) continue;
        if (entry.key == key){
            return entry;
        }
      }
      return null;
    },
    /** */
    addNewEntry: function(key, value){
        var entry = new Object();
        entry.key = key;
        entry.value = value;
        this.keys[this.keys.length] = entry; 
    }
};

/**
 * replace the entries of map in key array, removing the former value
 * @private
 */
function NullKey(){}
new NullKey();

/**
 * @private
 */
if (!Array.prototype.push) {
	/**
	 * Functions taken from Prototype library, didn't want to require for just few 
	 * functions.
	 * More info at {@link http://prototype.conio.net/}
	 * @private
	 */
	Array.prototype.push = function() {
		var startLength = this.length;
		for (var i = 0; i < arguments.length; i++) {
			this[startLength + i] = arguments[i];
		}
		return this.length;
	};
}

/**
 * @private
 */
if(!Function.prototype.bind) {
	/**
	 * Functions taken from Prototype library,  didn't want to require for just 
	 * few functions.
	 * More info at {@link http://prototype.conio.net/}
	 * @private
	 */	
	Function.prototype.bind = function(object) {
	  var __method = this;
	  return function() {
		return __method.apply(object, arguments);
	  };
	};
}

/**
 * ArrayList like java.ArrayList
 * @private
 */
Log4js.ArrayList = function()
{
  this.array = new Array();
};

Log4js.ArrayList.prototype = {
	/** 
	 * add Object to ArraList
	 * @param {Object} obj Object to be added
	 */
	add: function(obj){
		this.array[this.array.length] = obj;
	},
	/** */
	iterator: function (){
		return new Log4js.Iterator(this);
		},
  	/**
  	 * get size of the ArrayList
  	 * @return number of elements in the ArraList
  	 */
	length: function (){
		return this.array.length;
	},
  	/** 
  	 * get element of given index
  	 * @param {int} index of wanted object
  	 * @return {Object} element of index
  	 */
	get: function (index){
		return this.array[index];
	},
  	/** */
	addAll: function (obj)
	{
		if (obj instanceof Array) {
			for (var i=0;i<obj.length;i++) {
				this.add(obj[i]);
			}
		} else if (obj instanceof Log4js.ArrayList) {
			for (var j=0;j<obj.length();i++) {
				this.add(obj.get(j));
			}
		}
	},
	
	/**
	 * clone the current ArrayList
	 */
	clone: function() {
		var clonedArray =  new Log4js.ArrayList();
		for (var i = 0; i < this.array.length; i++) {
			clonedArray.add( this.get(i));
		}
		return clonedArray;
	}
};

/**
 * FIFO buffer
 * @private
 */
Log4js.FifoBuffer = function()
{
  this.array = new Array();
};

Log4js.FifoBuffer.prototype = {

	/**
	 * @param {Object} obj any object added to buffer
	 */
	push : function(obj) {
        this.array[this.array.length] = obj;
        return this.array.length;
	},
	
	/**
	 * @return first putted in Object
	 */
	pull : function() {
		if (this.array.length > 0) {
			var firstItem = this.array[0];
			for (var i = 0; i < this.array.length - 1; i++) {
				this.array[i] = this.array[i + 1];
			}
			this.array.length = this.array.length - 1;
			return firstItem;
		}
		return null;
	},
	
	length : function() {
		return this.array.length;
	}
};

/**
 * Iterator for ArrayList
 * @private
 */
Log4js.Iterator = function (arrayList){
	this.arrayList = arrayList;
	this.index = 0;
};
Log4js.Iterator.prototype = {
	hasNext: function (){
		return this.index < this.arrayList.length();
	},
	next: function() {
		return this.arrayList.get( index++ );
	}
};


/**
 * Date Formatter
 * @private
 */ 
Log4js.DateFormatter = function() {
	return;
};
Log4js.DateFormatter.prototype = {
	// addZero() and formatDate() are courtesy of Mike Golding:
	// http://www.mikezilla.com/exp0015.html
	/**
	 * Formats the given date by the given pattern.<br />
	 * Following switches are supported:
	 * <ul>
	 * <li>yyyy: The year</li>
	 * <li>MM: the month</li>
	 * <li>dd: the day of month<li>
	 * <li>hh: the hour<li>
	 * <li>mm: minutes</li>
	 * <li>O: timezone offset</li>
	 * </ul>
	 * @param {Date} vDate the date to format
	 * @param {String} vFormat the format pattern
	 * @return {String} formatted date string
	 * @static
	 */
	formatDate : function(vDate, vFormat) {
	  var vDay = this.addZero(vDate.getDate());
	  var vMonth = this.addZero(vDate.getMonth()+1);
	  var vYearLong = this.addZero(vDate.getFullYear());
	  var vYearShort = this.addZero(vDate.getFullYear().toString().substring(3,4));
	  var vYear = (vFormat.indexOf("yyyy")>-1?vYearLong:vYearShort);
	  var vHour  = this.addZero(vDate.getHours());
	  var vMinute = this.addZero(vDate.getMinutes());
	  var vSecond = this.addZero(vDate.getSeconds());
	  var vTimeZone = this.O(vDate);
	  var vDateString = vFormat.replace(/dd/g, vDay).replace(/MM/g, vMonth).replace(/y{1,4}/g, vYear);
	  vDateString = vDateString.replace(/hh/g, vHour).replace(/mm/g, vMinute).replace(/ss/g, vSecond);
	  vDateString = vDateString.replace(/O/g, vTimeZone);
	  return vDateString;
	},
		
	/**
	 * @private
	 * @static
	 */
	addZero : function(vNumber) {
	  return ((vNumber < 10) ? "0" : "") + vNumber;
	},
	
	/**
	 * Formates the TimeOffest
	 * Thanks to http://www.svendtofte.com/code/date_format/
	 * @private
	 */
	O : function (date) {
		// Difference to Greenwich time (GMT) in hours
		var os = Math.abs(date.getTimezoneOffset());
		var h = String(Math.floor(os/60));
		var m = String(os%60);
		h.length == 1? h = "0"+h:1;
		m.length == 1? m = "0"+m:1;
		return date.getTimezoneOffset() < 0 ? "+"+h+m : "-"+h+m;
	}
};

/**
 * internal Logger to be used
 * @private
 */
var log4jsLogger = Log4js.getLogger("log4js");
//log4jsLogger.addAppender(new ConsoleAppender(log4jsLogger, false));
//log4jsLogger.setLevel(Log4js.Level.ALL);