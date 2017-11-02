"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

window.FindReact = function (dom) {
  for (var key in dom) {
    if (key.startsWith("__reactInternalInstance$")) {
      var compInternals = dom[key]._currentElement;
      var compWrapper = compInternals._owner;
      var comp = compWrapper._instance;
      return comp;
    }
  }
  return null;
};

var testRunner = function testRunner() {
  var currentScenario = 1;

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

  getMeasureData = function getMeasureData() {
    return [window.performanceHeadStart || -1, window.performanceBaseLayoutDidMount || -1, window.performanceWindowLoad || -1, window.performanceDocumentDOMContentLoaded || -1,
    // start SPA
    window.onEnterDefault && window.onEnterDefault[0] || -1, window.metadataWillReceivePropsPathChange && window.metadataWillReceivePropsPathChange[0] || -1, window.baseLayoutWillUpdatePathChange && window.baseLayoutWillUpdatePathChange[0] || -1, window.baseLayoutDidUpdatePathChange && window.baseLayoutDidUpdatePathChange[0] || -1,
    // next SPA
    window.onEnterDefault && window.onEnterDefault[1] || -1, window.metadataWillReceivePropsPathChange && window.metadataWillReceivePropsPathChange[1] || -1, window.baseLayoutWillUpdatePathChange && window.baseLayoutWillUpdatePathChange[1] || -1, window.baseLayoutDidUpdatePathChange && window.baseLayoutDidUpdatePathChange[1] || -1].join("\t");
  };

  var homepageAdParam = "?ast_override_div=adspot-728x90_728x91_970x250_970x251-pos1:77272392,adspot-728x90_728x92_970x250_970x252-pos2:77272392,adspot-728x90_728x93_970x250_970x253-pos3:77272392,adspot-728x90_728x94_970x250_970x254-pos4:77272392,adspot-6x1-pos1:77272392,adspot-6x3-pos1:77272392,adspot-6x2-pos1:77272392,adspot-6x2-pos2:77272392,adspot-6x2-pos3:77272392,adspot-6x2-pos4:77272392";

  var articleAdParam = "?ast_override_div=adspot-728x90_728x91_970x250_970x251-pos1:77272465,adspot-728x90_728x92_970x250_970x252-pos2:77272465,adspot-300x250_300x253_300x600_300x603-pos3:77272465,adspot-N-300x164-pos1:77272465,adspot-6x2-pos1:77272465";

  var scenarioOne = function scenarioOne() {
    delay(5000, "load wait finishes")().then(function () {
      console.log("after load function");
      // find target
      var node = document.querySelector(".StoryTile-storyTile-15r1L.StoryTile-storyTileSmall-1Wer5.TwelveStorySet-imgRight-8fq5r:last-child a") || document.querySelector("._15r1L.KrNcv.KrNcv.P_wgq._1Hu7j:nth-child(4) ._2XVos a");
      // modify the url for the node
      var reactComp = FindReact(node);
      reactComp.props.to = "" + reactComp.props.to + articleAdParam;
      // click target to navigate
      node.click();
    });
  };

  var scenarioTwo = function scenarioTwo() {
    delay(10000, "singlePageTransitionWait done, going to back delay")().then(function () {
      console.log("after single page transition function, going back now");
      // click back button
      history.back();
    });
  };

  var scenarioThree = function scenarioThree() {
    delay(10000, "singlePageTransitionWait done, going to refresh delay")().then(function () {
      // store the data
      try {
        var val = window.localStorage.getItem("performanceMeasurement") || "";
        window.localStorage.setItem("performanceMeasurement", val + getMeasureData() + "\r\n");

        var count = parseInt(window.localStorage.getItem("performanceCount") || 0);
        window.localStorage.setItem("performanceCount", count + 1);
      } catch (e) {
        console.log("Fail to store measurement data", e);
        console.error("Fail to store measurement data", e);
      }
      window.location.reload();
    });
  };

  var scenarios = {
    1: scenarioOne,
    2: scenarioTwo,
    3: scenarioThree
  };

  var runScenario = function runScenario() {
    scenarios[currentScenario]();
  };

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
    currentScenario++;
    runScenario();
  });

  if (document.readyState === "complete") {
    runScenario();
    console.log("testRunner running after missed load");
  } else {
    window.addEventListener("load", function () {
      console.log("LOAD EVENT CALLED");
      runScenario();
    });
  }
};

testRunner();
