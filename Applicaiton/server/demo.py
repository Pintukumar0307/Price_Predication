#    Random Forest Model

import pandas as pd
import numpy as np
import joblib

model_filename = './Save_Model/random_forest_classifier_model.pkl'
loaded_model = joblib.load(model_filename)
new_data = pd.DataFrame({
    'N': [78],
    'P': [48],
    'K': [22],
    'temperature': [23.08974909],
    'humidity': [63.10459626],
    'ph': [5.588650585],
    'rainfall': [70.43473609]
})
print(new_data)
crop_predictions = loaded_model.predict(new_data)

print("Predicted Crop:", crop_predictions[0])

# n = "{:.6f}".format(n)
#     p = "{:.6f}".format(p)
#     k = "{:.6f}".format(k)
#     temp = "{:.6f}".format(temp)
#     hum = "{:.6f}".format(hum)
#     ph = "{:.6f}".format(ph)
#     rain = "{:.6f}".format(rain)