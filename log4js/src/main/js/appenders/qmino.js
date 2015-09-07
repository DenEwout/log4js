/**
 * Created by Ewout on 7/09/2015. Similar to an ajax appender, except that it sends logging information
 * to a logging back-end when receiving logs of a configurable level. When a message exceeds the level threshold,
 * it is sent along with a configurable amount of previous logging messages (of any level) that came before the
 * threshold exceeding one.
 */
Log4js.QminoAppender = function (loggingUrl, ajaxThreshold, bufferSize) {
    this.browserConsoleAppender = new Log4js.BrowserConsoleAppender();
    this.ajaxThreshold = ajaxThreshold;
    this.bufferSize = bufferSize;
    this.buffer = [];
};

Log4js.QminoAppender.prototype = Log4js.extend(new Log4js.Appender(), {

    doAppend: function (loggingEvent) {
        this.browserConsoleAppender.doAppend(loggingEvent);
        if (this.buffer.length >= bufferSize) {
            this.buffer.shift();
        }
        this.buffer.push(loggingEvent);
        //TODO: logic for when log level is greater or equal than threshold.
    },
    doClear: function () {
        this.browserConsoleAppender.doClear();
        this.buffer = [];
    },
    setLayout: function (layout) {
        this.browserConsoleAppender.setLayout(layout);
    },
    setLogger: function (logger) {
        this.browserConsoleAppender.setLogger(logger);
    }
});