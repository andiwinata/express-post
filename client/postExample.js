server = "http://localhost:2999";

fetch(server, {
  method: "POST",
  body: "helloFromFetch"
})
  .then(resp => {
    console.log("successfully post", resp);
  })
  .catch(err => {
    console.log("fail post", err);
  });
