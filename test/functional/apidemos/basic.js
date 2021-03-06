/*global it:true */
"use strict";

var path = require('path')
  , appPath = path.resolve(__dirname, "../../../sample-code/apps/ApiDemos/bin/ApiDemos-debug.apk")
  , badAppPath = path.resolve(__dirname, "../../../sample-code/apps/ApiDemos/bin/ApiDemos-debugz.apk")
  , appPkg = "com.example.android.apis"
  , appAct = ".ApiDemos"
  , appAct2 = "ApiDemos"
  , appAct3 = "com.example.android.apis.ApiDemos"
  , appAct4 = ".Blargimarg"
  , driverBlock = require("../../helpers/driverblock.js")
  , describeWd = driverBlock.describeForApp(appPath, "android", appPkg, appAct)
  , describeWd2 = driverBlock.describeForApp(appPath, "android", appPkg, appAct2)
  , describeWd3 = driverBlock.describeForApp(appPath, "android", appPkg, appAct3)
  , describeWd4 = driverBlock.describeForApp(appPath, "android", appPkg, appAct4)
  , describeBad = driverBlock.describeForApp(badAppPath, "android", appPkg,
      appAct)
  , should = require('should');

describeWd('basic', function(h) {
  it('should get device size', function(done) {
    h.driver.getWindowSize(function(err, size) {
      should.not.exist(err);
      size.width.should.be.above(0);
      size.height.should.be.above(0);
      done();
    });
  });
  it('should die with short command timeout', function(done) {
    var params = {timeout: 3};
    h.driver.execute("mobile: setCommandTimeout", [params], function(err) {
      should.not.exist(err);
      var next = function() {
        h.driver.elementByName('Animation', function(err) {
          should.exist(err);
          [13, 6].should.include(err.status);
          done();
        });
      };
      setTimeout(next, 4000);
    });
  });
  it('should not fail even when bad locator strats sent in', function(done) {
    h.driver.elementByLinkText("foobar", function(err) {
      should.exist(err);
      err.status.should.equal(13);
      err.cause.value.origValue.should.eql("Sorry, we don't support the 'link text' locator strategy yet");
      h.driver.elementByName("Animation", function(err, el) {
        should.not.exist(err);
        should.exist(el);
        done();
      });
    });
  });
  it('should be able to get current activity', function(done) {
    h.driver.execute("mobile: currentActivity", function(err, activity) {
      should.not.exist(err);
      activity.should.include("ApiDemos");
      done();
    });
  });
});

describeWd2('activity style: no period', function(h) {
  it('should should still find activity', function(done) {
    done();
  });
}, null, null, null, {expectConnError: true});

describeWd3('activity style: fully qualified', function(h) {
  it('should still find activity', function(done) {
    done();
  });
});

describeWd4('activity style: non-existent', function(h) {
  it('should throw an error', function(done) {
    should.exist(h.connError);
    var err = JSON.parse(h.connError.data);
    err.value.origValue.should.include("Activity used to start app doesn't exist");
    done();
  });
}, null, null, null, {expectConnError: true});

describeBad('bad app path', function(h) {
  it('should throw an error', function(done) {
    should.exist(h.connError);
    var err = JSON.parse(h.connError.data);
    err.value.origValue.should.include("Error locating the app");
    done();
  });
}, null, null, null, {expectConnError: true});
