from flask import Flask, jsonify, request
from flask_cors import CORS
from tensorflow import keras
import pandas as pd
import numpy as np
import joblib
from tensorflow import keras
from sklearn.preprocessing import LabelEncoder, StandardScaler
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split



app = Flask(__name__)
CORS(app) 


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/api/cropresult", methods=['POST'])
def crop_result():
    data = request.get_json()
    # print("Received data:", data)
    n = data['n']
    p = data['p']
    k = data['k']
    temp= data['temperature']
    hum= data['humidity']
    ph= data['ph']
    rain= data['rainfall']
    
    
    
    new_data = pd.DataFrame({
    'N': [n],
    'P': [p],
    'K': [k],
    'temperature': [temp],
    'humidity': [hum],
    'ph': [ph],
    'rainfall': [rain]
    
   })
    print(new_data)
    
    # new_data = pd.DataFrame({
    # 'N': [78],
    # 'P': [48],
    # 'K': [22],
    # 'temperature': [23.08974909],
    # 'humidity': [63.10459626],
    # 'ph': [5.588650585],
    # 'rainfall': [70.43473609]
    # })

    # print(new_data)
    
    # # ANN
    # # Load the model (use the appropriate format)
    # loaded_model = keras.models.load_model("./Save_Model/my_model")
    # # Use the loaded model to make predictions
    # crop_predictions = loaded_model.predict(new_data)
    # # Reverse label encoding to get the crop name
    # label_encoder = joblib.load('./Save_Model/label_encoder.pkl')
    # predicted_crop = label_encoder.inverse_transform(np.argmax(crop_predictions, axis=1))
    
    
    # Random Forest Model
    model_filename = './Save_Model/random_forest_classifier_model.pkl'
    loaded_model = joblib.load(model_filename)
    predicted_crop = loaded_model.predict(new_data)
    print("Predicted Crop:", predicted_crop[0])
    
    #  Result Return
    crop= predicted_crop[0]
    return jsonify({"message": "Data received successfully","crop":crop})



@app.route("/api/priceresult", methods=['POST'])
def price_result():    
    data = request.get_json()
    print("Received data:", data)
    
    # Define input data for prediction
    district_name = data['district']
    crop_name = data['crop']
    today = pd.Timestamp.today()
    
    
    # #  ANN
    # loaded_model = keras.models.load_model("./Save_Model_Price/my_model")
    # # Encode categorical features
    # le_district = LabelEncoder()
    # le_crop = LabelEncoder()
    # next_six_months = pd.date_range(today, periods=6, freq='MS').strftime("%m-%Y").tolist()
    # next_six_months_df = pd.DataFrame({'District': [le_district.fit_transform([district_name])[0]] * 6,
    #                                'Crop': [le_crop.fit_transform([crop_name])[0]] * 6,
    #                                'Month': [int(month.split('-')[0]) for month in next_six_months],
    #                                'Year': [int(month.split('-')[1]) for month in next_six_months]})

    # # Handle missing values
    # imputer = SimpleImputer()
    # # Feature scaling
    # scaler = StandardScaler()
    # next_six_months_df = imputer.fit_transform(next_six_months_df)
    # next_six_months_df = scaler.fit_transform(next_six_months_df)
    # # Use the loaded model to make predictions
    # next_six_months_predictions = loaded_model.predict(next_six_months_df)
    # print("Predicted Crop Prices (Rs per quintal):\n", next_six_months_predictions)
    # # Your 2D array of predicted crop prices
    # predicted_prices = np.array(next_six_months_predictions)
    # # Convert it to a 1D array
    # predicted_prices_1d = predicted_prices.ravel()
    # predicted_prices_list = predicted_prices_1d.tolist()
    # # Print the 1D array
    # print(predicted_prices_list)
    
    
    # Random forest
    price_estimation_model = joblib.load('./Save_Model_Price/random_forest_model.pkl')
    df = pd.read_csv('Price_Predication.csv')
    le_district = LabelEncoder()
    df['District'] = le_district.fit_transform(df['District'])
    le_crop = LabelEncoder()
    df['Crop'] = le_crop.fit_transform(df['Crop'])
    df['Price Date'] = pd.to_datetime(df['Price Date'], format='%b-%Y')
    df['Month'] = df['Price Date'].dt.month
    df['Year'] = df['Price Date'].dt.year
    df = df.drop('Price Date', axis=1)

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(df[['District', 'Crop', 'Month', 'Year']], df['Crop Price (Rs per quintal)'], test_size=0.2, random_state=42)
    imputer = SimpleImputer()
    X_train = imputer.fit_transform(X_train)
    X_test = imputer.transform(X_test)

    # Feature scaling
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    today = pd.Timestamp.today()
    next_six_months = pd.date_range(today, periods=12, freq='MS').strftime("%m-%Y").tolist()
    next_six_months_df = pd.DataFrame({'District': [le_district.transform([district_name])[0]]*12,
                                        'Crop': [le_crop.transform([crop_name])[0]]*12,
                                        'Month': [int(month.split('-')[0]) for month in next_six_months],
                                        'Year': [int(month.split('-')[1]) for month in next_six_months]})

   # Use the trained XGBoost model to make predictions on the next 12 months dataset
    next_six_months_df = imputer.transform(next_six_months_df)
    next_six_months_df = scaler.transform(next_six_months_df)
    print ("\n ALL GOOD !")
    predicted_price = price_estimation_model.predict(next_six_months_df)
    next12months = pd.date_range(today, periods=12, freq='MS')
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    predicted_prices = predicted_price.astype(int)
    print(predicted_prices)
    price_data = [{'month': month.strftime('%B %Y'), 'price': price} for month, price in zip(next12months,     predicted_prices.tolist())]
    print(price_data)
    predicted_prices_list = predicted_prices.tolist()
    
    price = price_data
    return jsonify({"message": "Data received successfully","price": price})


if __name__ == '__main__':
    app.run(debug=True)