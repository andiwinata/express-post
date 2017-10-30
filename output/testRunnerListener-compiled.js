"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getMeasureData = function getMeasureData() {
  return [window.performanceHeadStart || -1, window.performanceBaseLayoutDidMount || -1, window.performanceWindowLoad || -1, window.performanceDocumentDOMContentLoaded || -1,
  // start SPA
  window.onEnterDefault && window.onEnterDefault[0] || -1, window.metadataWillReceivePropsPathChange && window.metadataWillReceivePropsPathChange[0] || -1, window.baseLayoutWillUpdatePathChange && window.baseLayoutWillUpdatePathChange[0] || -1, window.baseLayoutDidUpdatePathChange && window.baseLayoutDidUpdatePathChange[0] || -1,
  // next SPA
  window.onEnterDefault && window.onEnterDefault[1] || -1, window.metadataWillReceivePropsPathChange && window.metadataWillReceivePropsPathChange[1] || -1, window.baseLayoutWillUpdatePathChange && window.baseLayoutWillUpdatePathChange[1] || -1, window.baseLayoutDidUpdatePathChange && window.baseLayoutDidUpdatePathChange[1] || -1].join("\t");
};

var testRunner = function testRunner() {
  window.addEventListener("performanceOnEnterDefault", function () {
    window.onEnterDefault = window.onEnterDefault ? [].concat(_toConsumableArray(window.onEnterDefault), [window.performance.now()]) : [window.performance.now()];
  });

  window.addEventListener("performanceMetadataWillReceivePropsPathChange", function () {
    window.metadataWillReceivePropsPathChange = window.metadataWillReceivePropsPathChange ? [].concat(_toConsumableArray(window.metadataWillReceivePropsPathChange), [window.performance.now()]) : [window.performance.now()];
  });

  window.addEventListener("performanceBaseLayoutWillUpdatePathChange", function () {
    window.baseLayoutWillUpdatePathChange = window.baseLayoutWillUpdatePathChange ? [].concat(_toConsumableArray(window.baseLayoutWillUpdatePathChange), [window.performance.now()]) : [window.performance.now()];
  });

  window.addEventListener("performanceBaseLayoutDidUpdatePathChange", function () {
    window.baseLayoutDidUpdatePathChange = window.baseLayoutDidUpdatePathChange ? [].concat(_toConsumableArray(window.baseLayoutDidUpdatePathChange), [window.performance.now()]) : [window.performance.now()];
  });

  var delay = function delay(t, message) {
    return function () {
      return new Promise(function (resolve, reject) {
        var wait = setTimeout(function () {
          clearTimeout(wait);
          resolve(message);
        }, t);
      });
    };
  };

  var main = function main() {
    delay(5000, "load wait finishes")().then(function () {
      console.log("after load function");
      // find target
      var node = document.querySelector(".StoryTile-storyTile-15r1L.StoryTile-storyTileSmall-1Wer5.TwelveStorySet-imgRight-8fq5r:last-child a") || document.querySelector('._15r1L._1Wer5._3TEmE.RZxGD._1Hu7j._8fq5r:last-child ._2XVos a:last-child');
      // click target to navigate
      node.click();
    }).then(delay(10000, "singlePageTransitionWait done, going to back delay")).then(function () {
      console.log("after single page transition function, going back now");
      // click back button
      history.back();
    }).then(delay(10000, "singlePageTransitionWait done, going to refresh delay")).then(function () {
      // store the data
      try {
        var val = window.localStorage.getItem("performanceMeasurement") || "";
        window.localStorage.setItem("performanceMeasurement", val + getMeasureData() + "\r\n");
      } catch (e) {
        console.log("Fail to store measurement data", e);
        console.error("Fail to store measurement data", e);
      }
      window.location.reload();
    });
  };

  // run script
  main();
};

if (document.readyState === "complete") {
  testRunner();
  console.log("testRunner running after missed load");
} else {
  window.addEventListener("load", testRunner);
}
