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
    delay(1000, "load timeout finishes")()
      .then(() => {
        console.log("after load function");
        // find target
        // click target to navigate
      })
      .then(delay(2000, "singlePageTransitionWait done"))
      .then(() => {
        console.log("after single page transition function");
        // click back button
      })
      .then(delay(2000, "to go back delay"))
      .then(() => {
        console.log("going back now");
      })
      .then(delay(2000, "going to refresh delay"))
      .then(() => {
        // post fetch data
        // then reload
        window.location.reload();
      });
  };

  // run script
  main();
};

if (document.readyState === 'complete') {
	testRunner();
} else {
	window.addEventListener("load", testRunner);
}
console.log("testRunner finish running");
