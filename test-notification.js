const http = require("http");
const data = JSON.stringify({
    token: "et5PTXnsTx-tlcQDUQMf9p:APA91bGPVaXkL4Y0bqbaTeKsEzbtj3TkcFn_ri-H4b9sXtOBtAO39kD6KhjztW6MQXB5Ar55pRoQ3b9SjQL2YJcHSz7Sgw1a75vjugsyWgz8-yqwc-U_jbU",
    title: "Claude Code",
    message: "Claude needs your attention!"
});

const options = {
    hostname: "localhost",
    port: 3000,
    path: "/send-notification",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data)
    }
};

const request = http.request(options, (response) => {

    let result = "";

    response.on("data", (chunk) => {
        result += chunk;
    });

    response.on("end", () => {
        console.log("Server response:");
        console.log(result);
    });
});

request.on("error", (error) => {
    console.error("Request failed:", error);
});

request.write(data);
request.end();