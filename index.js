import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import 'dotenv/config';


console.log(process.env);
const app = express();
const port = 3000;
const api_key = process.env.API_KEY;
const geoloation_api = "http://api.openweathermap.org/geo/1.0/direct";
const api_url = "http://api.openweathermap.org/data/2.5/forecast";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.render("loader.ejs");
});
app.post("/", async (req, res) => {
    const city = req.body.city_name;
    try {
        const geo_data = await axios.get(geoloation_api,
            {
                params:
                {
                    q: city,
                    limit: 1,
                    appid: api_key,
                }
            }
        );
        if (!geo_data.data.length) {
            return res.render("index.ejs", {
                weather: null,
                city: "City not found. Please try again."
            });
        }
        const lat = geo_data.data[0].lat;
        const lon = geo_data.data[0].lon;
        const city_n = geo_data.data[0].name;
        console.log(lat, lon, city_n);
        const weather_data = await axios.get(api_url, {
            params:
            {
                lat,
                lon,
                units: "metric",
                appid: api_key,
            }

        });
        res.render("index.ejs", { weather: weather_data.data, city: city_n });
    }
    catch (error) {
        console.log("Error:", error.message);
        res.render("index.ejs", {
            weather: null, city: "Error fetching data, Please try again."
        });
    }
})
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});