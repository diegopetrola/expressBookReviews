const axios = require("axios");

axios.get("http://localhost:5000/").then((resp) => console.log(resp.data));
