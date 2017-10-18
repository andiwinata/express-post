server = "http://localhost:3000";

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
