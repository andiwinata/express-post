window.FindReact = function(dom) {
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

const testRunner = () => {
  let currentScenario = 1;

  const delay = (t, message) => () => {
    return new Promise((resolve, reject) => {
      const wait = setTimeout(() => {
        clearTimeout(wait);
        resolve(message);
      }, t);
    });
  };

  getMeasureData = () => {
    return [
      window.performanceHeadStart || -1,
      window.performanceBaseLayoutDidMount || -1,
      window.performanceWindowLoad || -1,
      window.performanceDocumentDOMContentLoaded || -1,
      // start SPA
      (window.onEnterDefault && window.onEnterDefault[0]) || -1,
      (window.metadataWillReceivePropsPathChange &&
        window.metadataWillReceivePropsPathChange[0]) ||
        -1,
      (window.baseLayoutWillUpdatePathChange &&
        window.baseLayoutWillUpdatePathChange[0]) ||
        -1,
      (window.baseLayoutDidUpdatePathChange &&
        window.baseLayoutDidUpdatePathChange[0]) ||
        -1,
      // next SPA
      (window.onEnterDefault && window.onEnterDefault[1]) || -1,
      (window.metadataWillReceivePropsPathChange &&
        window.metadataWillReceivePropsPathChange[1]) ||
        -1,
      (window.baseLayoutWillUpdatePathChange &&
        window.baseLayoutWillUpdatePathChange[1]) ||
        -1,
      (window.baseLayoutDidUpdatePathChange &&
        window.baseLayoutDidUpdatePathChange[1]) ||
        -1
    ].join("\t");
  };

  const homepageAdParam = `?ast_override_div=adspot-728x90_728x91_970x250_970x251-pos1:77272392,adspot-728x90_728x92_970x250_970x252-pos2:77272392,adspot-728x90_728x93_970x250_970x253-pos3:77272392,adspot-728x90_728x94_970x250_970x254-pos4:77272392,adspot-6x1-pos1:77272392,adspot-6x3-pos1:77272392,adspot-6x2-pos1:77272392,adspot-6x2-pos2:77272392,adspot-6x2-pos3:77272392,adspot-6x2-pos4:77272392`;

  const articleAdParam = `?ast_override_div=adspot-728x90_728x91_970x250_970x251-pos1:77272465,adspot-728x90_728x92_970x250_970x252-pos2:77272465,adspot-300x250_300x253_300x600_300x603-pos3:77272465,adspot-N-300x164-pos1:77272465,adspot-6x2-pos1:77272465`;

  const scenarioOne = () => {
    delay(5000, "load wait finishes")().then(() => {
      console.log("after load function");
      // find target
      const node =
        document.querySelector(
          ".StoryTile-storyTile-15r1L.StoryTile-storyTileSmall-1Wer5.TwelveStorySet-imgRight-8fq5r:last-child a"
        ) ||
        document.querySelector(
          "._15r1L.KrNcv.KrNcv.P_wgq._1Hu7j:nth-child(4) ._2XVos a"
        );
      // modify the url for the node
      const reactComp = FindReact(node);
      reactComp.props.to = `${reactComp.props.to}${articleAdParam}`;
      // click target to navigate
      node.click();
    });
  };

  const scenarioTwo = () => {
    delay(
      10000,
      "singlePageTransitionWait done, going to back delay"
    )().then(() => {
      console.log("after single page transition function, going back now");
      // click back button
      history.back();
    });
  };

  const scenarioThree = () => {
    delay(
      10000,
      "singlePageTransitionWait done, going to refresh delay"
    )().then(() => {
      // store the data
      try {
        const val = window.localStorage.getItem("performanceMeasurement") || "";
        window.localStorage.setItem(
          "performanceMeasurement",
          val + getMeasureData() + "\r\n"
        );

        const count = parseInt(
          window.localStorage.getItem("performanceCount") || 0
        );
        window.localStorage.setItem("performanceCount", count + 1);
      } catch (e) {
        console.log("Fail to store measurement data", e);
        console.error("Fail to store measurement data", e);
      }
      window.location.reload();
    });
  };

  const scenarios = {
    1: scenarioOne,
    2: scenarioTwo,
    3: scenarioThree
  };

  const runScenario = () => {
    scenarios[currentScenario]();
  };

  window.addEventListener("performanceOnEnterDefault", () => {
    window.onEnterDefault = window.onEnterDefault
      ? [...window.onEnterDefault, window.performance.now()]
      : [window.performance.now()];
  });

  window.addEventListener(
    "performanceMetadataWillReceivePropsPathChange",
    () => {
      window.metadataWillReceivePropsPathChange = window.metadataWillReceivePropsPathChange
        ? [
            ...window.metadataWillReceivePropsPathChange,
            window.performance.now()
          ]
        : [window.performance.now()];
    }
  );

  window.addEventListener("performanceBaseLayoutWillUpdatePathChange", () => {
    window.baseLayoutWillUpdatePathChange = window.baseLayoutWillUpdatePathChange
      ? [...window.baseLayoutWillUpdatePathChange, window.performance.now()]
      : [window.performance.now()];
  });

  window.addEventListener("performanceBaseLayoutDidUpdatePathChange", () => {
    window.baseLayoutDidUpdatePathChange = window.baseLayoutDidUpdatePathChange
      ? [...window.baseLayoutDidUpdatePathChange, window.performance.now()]
      : [window.performance.now()];
    currentScenario++;
    runScenario();
  });

  if (document.readyState === "complete") {
    runScenario();
    console.log("testRunner running after missed load");
  } else {
    window.addEventListener("load", () => {
      console.log("LOAD EVENT CALLED");
      runScenario();
    });
  }
};

testRunner();
