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
  window.addEventListener("performanceOnEnterDefault", () => {
    window.onEnterDefault = window.onEnterDefault
      ? [...window.onEnterDefault, window.performance.now()]
      : [window.performance.now()];
  });

  window.addEventListener("performanceMetadataWillReceivePropsPathChange", () => {
    window.metadataWillReceivePropsPathChange = window.metadataWillReceivePropsPathChange
      ? [...window.metadataWillReceivePropsPathChange, window.performance.now()]
      : [window.performance.now()];
  });

  window.addEventListener("performanceBaseLayoutWillUpdatePathChange", () => {
    window.baseLayoutWillUpdatePathChange = window.baseLayoutWillUpdatePathChange
      ? [...window.baseLayoutWillUpdatePathChange, window.performance.now()]
      : [window.performance.now()];
  });

  window.addEventListener("performanceBaseLayoutDidUpdatePathChange", () => {
    window.baseLayoutDidUpdatePathChange = window.baseLayoutDidUpdatePathChange
      ? [...window.baseLayoutDidUpdatePathChange, window.performance.now()]
      : [window.performance.now()];
  });

  const delay = (t, message) => () => {
    return new Promise((resolve, reject) => {
      const wait = setTimeout(() => {
        clearTimeout(wait);
        resolve(message);
      }, t);
    });
  };

  const main = () => {
    delay(2000, "load wait finishes")()
      .then(() => {
        console.log("after load function");
        // find target
        const node = document.querySelector(
          ".StoryTile-storyTile-15r1L.StoryTile-storyTileSmall-1Wer5.TwelveStorySet-imgRight-8fq5r:last-child a"
        );
        // click target to navigate
        node.click();
      })
      .then(delay(5000, "singlePageTransitionWait done, going to back delay"))
      .then(() => {
        console.log("after single page transition function, going back now");
        // click back button
        history.back();
      })
      .then(
        delay(5000, "singlePageTransitionWait done, going to refresh delay")
      )
      .then(() => {
        // store the data
        try {
          const val =
            window.localStorage.getItem("performanceMeasurement") || "";
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

  // run script
  main();
};

if (document.readyState === "complete") {
  testRunner();
  console.log("testRunner running after missed load");
} else {
  window.addEventListener("load", testRunner);
}
