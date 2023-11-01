import React, { useState } from "react";
import "./CropClass.css";
import BananaImage from "../static/Banana.jpeg";
import BengalGramImage from "../static/Bengal Gram.jpeg";
import BlackGramImage from "../static/Black Gram.jpeg";
import CoconutImage from "../static/Coconut.jpeg";
import CoffeeImage from "../static/Coffee.jpeg";
import CottonImage from "../static/Cotton.jpeg";
import GreenGramImage from "../static/Green Gram.jpeg";
import MaizeImage from "../static/Maize.jpeg";
import RedGramImage from "../static/Red Gram.jpeg";
import RiceImage from "../static/Rice.jpeg";

import axios from "axios";

function CropClass() {
  const [n, setn] = useState(78);
  const [k, setk] = useState(48);
  const [p, setp] = useState(22);
  const [temperature, setTemperature] = useState(23.08974909);
  const [humidity, setHumidity] = useState(63.10459626);
  const [ph, setPh] = useState(5.588650585);
  const [rainfall, setRainfall] = useState(70.43473609);

  const [cropResponse, setCropResponse] = useState("");

  const [loading, setLoading] = useState(false);

  const images = {
    banana: BananaImage,
    bengalgram: BengalGramImage,
    blackgram: BlackGramImage,
    coconut: CoconutImage,
    coffee: CoffeeImage,
    cotton: CottonImage,
    greengram: GreenGramImage,
    maize: MaizeImage,
    redgram: RedGramImage,
    rice: RiceImage,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      n,
      k,
      p,
      temperature,
      humidity,
      ph,
      rainfall,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/cropresult",
        formData
      );

      console.log("Server Response:", response.data.crop);
      setCropResponse(response.data.crop);

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {!cropResponse ? (
        <div className="cropclass">
          <form onSubmit={handleSubmit} className="formclass">
            <div>
              <label htmlFor="n">N Value:</label>
              <input
                type="number"
                id="n"
                value={n}
                onChange={(e) => setn(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="k">K Value:</label>
              <input
                type="number"
                id="k"
                value={k}
                onChange={(e) => setk(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="p">P Value:</label>
              <input
                type="number"
                id="p"
                value={p}
                onChange={(e) => setp(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="temperature">Temperature:</label>
              <input
                type="number"
                id="temperature"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="humidity">Humidity:</label>
              <input
                type="number"
                id="humidity"
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="ph">pH:</label>
              <input
                type="number"
                id="ph"
                value={ph}
                onChange={(e) => setPh(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="rainfall">Rainfall:</label>
              <input
                type="number"
                id="rainfall"
                value={rainfall}
                onChange={(e) => setRainfall(e.target.value)}
                required
              />
            </div>

            <button type="submit">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <div className="info">
            <p>*N - ratio of Nitrogen content in soil </p>
            <p>*P - ratio of Phosphorous content in soil</p>
            <p>*K - ratio of Potassium content in soil temperature</p>
            <p>*Temperature- temperature in degree Celsius</p>
            <p>*Humidity - relative humidity in %</p>
            <p>*Ph - ph value of the soil</p>
            <p>*Rainfall - rainfall in mm</p>
          </div>
        </div>
      ) : (
        <div className="Table">
          <h1>Result:{cropResponse}</h1>
          {images[cropResponse] ? (
            <img src={images[cropResponse]} alt="Crop" />
          ) : (
            <p>No image available for this crop.</p>
          )}
        </div>
      )}
    </>
  );
}

export default CropClass;
