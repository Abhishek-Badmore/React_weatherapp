const http = require("http");
const fs = require("fs");
// var url = require("url");
var requests = require("requests");

const homeFile = fs.readFileSync("./home.html", {
  encoding: "utf-8",
  flag: "r",
});

// console.log(homeFile);

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  // res.writeHead(200, { "Content-type": "text/html" });
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=pune&appid=5bad30dce1890fc6fd5c782cf9c0dc60"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);

        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1");
