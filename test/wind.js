var chai = require("chai");
var assert = chai.assert;
var sinon = require('sinon');

var Sk2nmea = require('..');

describe('apparent wind', function () {
  it('proper input converts', function (done) {
    var msg = JSON.parse('{"updates":[{"source":{},"timestamp":"2016-01-02T19:02:31.000Z","values":[{"path":"environment.wind.speedApparent","value":7.30},{"path":"environment.wind.angleApparent","value":0.5238}]}],"context":"vessels.10101010"}');
    var converter = new Sk2nmea();
    var callback = sinon.spy();
    converter.on('sentence', callback);
    converter.handleDelta(msg);
    assert(callback.calledWith("$IIMWV,030.01,R,7.30,M,*79"));
    done();
  });
});
