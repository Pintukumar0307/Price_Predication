import React, { useState } from "react";
import "./PricePred.css";
import axios from "axios";

function PricePred() {
  const [district, setDistrict] = useState("");
  const [crop, setCrop] = useState("");
  const [priceResponse, setPriceResponse] = useState([]);
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
  };

  const handleCropChange = (e) => {
    setCrop(e.target.value);
  };

  // const calculateNextSixMonths = () => {
  //   const today = new Date();
  //   const nextSixMonths = [];

  //   for (let i = 0; i < 12; i++) {
  //     const month = ((today.getMonth() + i) % 12) + 1;
  //     const year =
  //       today.getFullYear() + Math.floor((today.getMonth() + i) / 12);
  //     nextSixMonths.push({ month, year });
  //   }

  //   return nextSixMonths;
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const priceData = {
  //     district,
  //     crop,
  //   };

  //   const response = await axios.post(
  //     "http://127.0.0.1:5000/api/priceresult",
  //     priceData
  //   );
  //   console.log("Server Response:", response.data.price);
  //   setPriceResponse(response.data.price);

  //   setLoading(false);

  //   console.log("Submitted:", { district, crop });
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const priceData = {
      district,
      crop,
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/priceresult", priceData);
  
      // Check for any errors in the response (you may customize this check)
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      console.log(response.data)

      setData(response.data.price);
      setPriceResponse(response.data.price);
      setLoading(false);

      console.log("Submitted:", { district, crop });
      console.log(priceResponse)
    } catch (error) {
      // Handle the error and display an error message to the user
      console.error("API Error:", error);
      alert("Incorrect Data:Data is not available in data source");
      // You can set an error state here and display an error message to the user
      // setErrorState(error.message);
      setLoading(false);
    }
  };
  

  // const nextSixMonths = calculateNextSixMonths();

  return (
    <>
      {priceResponse.length === 0 ? (
        <form onSubmit={handleSubmit} className="formprice">
          <div>
            <label htmlFor="district">District:</label>
            <input
              type="text"
              id="district"
              value={district}
              onChange={handleDistrictChange}
              required
            />
          </div>
          <div>
            <label htmlFor="crop">Crop:</label>
            <input
              type="text"
              id="crop"
              value={crop}
              onChange={handleCropChange}
              required
            />
          </div>

          <button type="submit">{loading ? "Submitting..." : "Submit"}</button>
        </form>
      ) : (
        <div className="Table">
         
          <div>
            <h1>{district} --- {crop}</h1>
          </div>
          <h1>Price</h1>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
            {/* {priceResponse.map((index) => (
                <tr key={index}>
                  <td>
                    {`${nextSixMonths[index].year}-${String(
                      nextSixMonths[index].month
                    ).padStart(2, "0")}`}
                  </td>
                  <td>{priceResponse[index]}</td>
                </tr>
              ))} */}
              {/* {[0, 1, 2, 3, 4, 5].map((index) => (
                <tr key={index}>
                  <td>
                    {`${nextSixMonths[index].year}-${String(
                      nextSixMonths[index].month
                    ).padStart(2, "0")}`}
                  </td>
                  <td>{priceResponse[index]}</td>
                </tr>
              ))} */}
              {/* {priceResponse.map((item, index) => (
                <tr key={index}>
                  <td>
                    {`${nextSixMonths[index].year}-${String(nextSixMonths[index].month).padStart(2, '0')}`}
                  </td>
                  <td>{item}</td>
                </tr>
              ))} */}
              {data.map((item) => (
            <tr key={item.id}>
              
              <td>{item.month}</td>
              <td>{item.price}</td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default PricePred;
