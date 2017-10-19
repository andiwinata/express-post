getMeasureData = () => {
  return [
    (window.headStart && window.headStart[0]) || -1,
    (window.metadataDidMount && window.metadataDidMount[0]) || -1,
    (window.baseLayoutDidMount && window.baseLayoutDidMount[0]) || -1,
    (window.windowOnLoad && window.windowOnLoad[0]) || -1,
    (window.documentOnDOMContentLoaded &&
      window.documentOnDOMContentLoaded[0]) ||
      -1,
    // start SPA
    (window.onEnterDefault && window.onEnterDefault[0]) || -1,
    (window.metadataWillReceivePropsPathChange &&
      window.metadataWillReceivePropsPathChange[0]) ||
      -1,
    (window.baseLayoutWillUpdatePathChange &&
      window.baseLayoutWillUpdatePathChange[0]) ||
      -1,
    (window.baseLayoutDidUpdate && window.baseLayoutDidUpdate[0]) || -1,
    // next SPA
    (window.onEnterDefault && window.onEnterDefault[1]) || -1,
    (window.metadataWillReceivePropsPathChange &&
      window.metadataWillReceivePropsPathChange[1]) ||
      -1,
    (window.baseLayoutWillUpdatePathChange &&
      window.baseLayoutWillUpdatePathChange[1]) ||
      -1,
    (window.baseLayoutDidUpdate && window.baseLayoutDidUpdate[1]) || -1
  ].join("\t");
};

testRunner = () => {
  const delay = (t, message) => () => {
    return new Promise((resolve, reject) => {
      const wait = setTimeout(() => {
        clearTimeout(wait);
        resolve(message);
      }, t);
    });
  };

  const main = () => {
    delay(2000, "load timeout finishes")()
      .then(() => {
        console.log("after load function");
        // find target
        const node = document.querySelector(
          ".StoryTile-storyTile-15r1L.StoryTile-storyTileSmall-1Wer5.TwelveStorySet-imgRight-8fq5r:last-child a"
        );
        // click target to navigate
        node.click();
      })
      .then(delay(12500, "singlePageTransitionWait done, going to back delay"))
      .then(() => {
        console.log("after single page transition function, going back now");
        // click back button
        history.back();
      })
      .then(
        delay(14000, "singlePageTransitionWait done, going to refresh delay")
      )
      .then(() => {
        // post fetch data
        server = "http://localhost:2999";

        fetch(server, {
          method: "POST",
          body: getMeasureData()
        })
          .then(resp => {
            console.log("successfully post", resp);
            // then reload
            window.location.reload();
          })
          .catch(err => {
            console.log("fail post", err);
            console.warn("fail post", err);
            // then reload
            window.location.reload();
          });
      });
  };

  // run script
  main();
};

if (document.readyState === "complete") {
  testRunner();
} else {
  window.addEventListener("load", testRunner);
}
console.log("testRunner finish running");
