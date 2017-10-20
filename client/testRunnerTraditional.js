const testRunner = () => {
  const delay = (t, message) => () => {
    return new Promise((resolve, reject) => {
      console.log(`RUNNING DELAY FOR ${message}`);
      const wait = setTimeout(() => {
        clearTimeout(wait);
        resolve(message);
      }, t);
    });
  };

  const performanceMeasureNumberName = "performanceMeasureNumber";
  const performanceMeasurementName = "performanceMeasurement";

  const incrementPerformanceMeasureNumberName = () => {
    const measureNumber = parseInt(
      window.localStorage.getItem(performanceMeasureNumberName) || 1
    );
    window.localStorage.setItem(
      performanceMeasureNumberName,
      measureNumber + 1
    );
  };

  const saveMeasurement = toAppendData => {
    // mark the time
    let performanceMeasurement =
      window.localStorage.getItem(performanceMeasurementName) || "";
    // append new time
    performanceMeasurement = `${performanceMeasurement}${toAppendData}`;
    // save to storage
    window.localStorage.setItem(
      performanceMeasurementName,
      performanceMeasurement
    );

    incrementPerformanceMeasureNumberName();
  };

  const firstHomepageLoad = () => {
    delay(1500, "first load delay")()
      .then(() => {
        saveMeasurement(
          `${window.performanceWindowLoad}\t${window.performanceDocumentDOMContentLoaded}\t`
        );
      })
      .then(() => {
        // find target article
        const node = document.querySelector(
          ".story.unit-1-2--medium.unit-1--large:first-child a"
        );
        // click target to navigate
        node.click();
      });
  };

  const firstArticleLoad = () => {
    delay(1500, "first article load delay")()
      .then(() => {
        saveMeasurement(
          `${window.performanceWindowLoad}\t${window.performanceDocumentDOMContentLoaded}\t`
        );
      })
      .then(() => {
        // click back button
        window.history.back();
      });
  };

  const secondHomepageLoad = () => {
    delay(1500, "second homepage load delay")()
      .then(() => {
        saveMeasurement(
          `${window.performanceWindowLoad}\t${window.performanceDocumentDOMContentLoaded}\r\n`
        );
      })
      .then(() => {
        // reload page
        window.location.reload();
      });
  };

  // pick the scenario on page load
  const runScenario = () => {
    console.log("Running scenario");
    const measureNumber = parseInt(
      window.localStorage.getItem(performanceMeasureNumberName) || 1
    );

    switch (measureNumber % 3) {
      case 0:
        secondHomepageLoad();
        break;
      case 1:
        firstHomepageLoad();
        break;
      case 2:
        firstArticleLoad();
        break;
      default:
        console.error("SOMETHING WRONG WITH MEASURE NUMBER", measureNumber);
        break;
    }
  };

  window.addEventListener("load", () => {
    console.log("LOAD EVENT CALLED");
    window.performanceWindowLoad = window.performance.now();
    runScenario();
  });

  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded EVENT CALLED");
    window.performanceDocumentDOMContentLoaded = window.performance.now();
  });

  console.log("TEST RUNNER FINISHES RUNNING", document.readyState);
};

testRunner();
