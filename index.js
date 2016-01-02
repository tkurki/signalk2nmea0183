var EventEmitter = require('events');
var nmea = require("nmea");
var Qty = require('js-quantities');

var rad2degrees = Qty.swiftConverter('rad', 'deg');

function Signalk2nmea(opts) {
  EventEmitter.call(this);
}

require('util').inherits(Signalk2nmea, EventEmitter);

var valueHandlers = {
  "environment.wind.angleApparent": function(pathValue, sentences) {
    sentences.MWVapparent.angle = rad2degrees(pathValue.value)
  },
  "environment.wind.speedApparent": function(pathValue, sentences) {
    sentences.MWVapparent.speed = pathValue.value
  }
}

Signalk2nmea.prototype.handleDelta = function(delta) {
  var sentences = {
    MWVapparent: {
      type: "wind",
      units: "M",
      valid: "A",
      reference: "R"
    }
  };
  if (delta.updates) {
    delta.updates.forEach(function(update) {
      if (update.values) {
        update.values.forEach(function(pathValue) {
          if (valueHandlers[pathValue.path]) {
            valueHandlers[pathValue.path](pathValue, sentences);
          }
        });
      }
    });
  }
  this.emit('sentence', nmea.encode("II", sentences.MWVapparent));
}

module.exports = Signalk2nmea;
