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

  const scenarioOne = () => {
    delay(5000, "load wait finishes")().then(() => {
      console.log("after load function");
      // find target
      const node =
        document.querySelector(
          ".StoryTile-storyTile-15r1L.StoryTile-storyTileSmall-1Wer5.TwelveStorySet-imgRight-8fq5r:last-child a"
        ) ||
        document.querySelector(
          "._15r1L._1Wer5._3TEmE.RZxGD._1Hu7j._8fq5r:nth-child(3) ._2XVos a:last-child"
        );
      // click target to navigate
      node.click();
    });
  };

  const scenarioTwo = () => {
    delay(
      2000,
      "singlePageTransitionWait done, going to back delay"
    )().then(() => {
      console.log("after single page transition function, going back now");
      // click back button
      history.back();
    });
  };

  const scenarioThree = () => {
    delay(
      2000,
      "singlePageTransitionWait done, going to refresh delay"
    )().then(() => {
      // store the data
      try {
        const val = window.localStorage.getItem("performanceMeasurement") || "";
        window.localStorage.setItem(
          "performanceMeasurement",
          val + getMeasureData() + "\r\n"
        );
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
