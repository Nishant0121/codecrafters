from flask import Flask, jsonify, request
import yfinance as yf
from prophet import Prophet
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route("/predict/<symbol>", methods=["GET"])
def predict_stock(symbol):
    try:
        data = yf.download(symbol, period="1y", interval="1d")

        df = data.reset_index()[["Date", "Close"]]
        df.columns = ["ds", "y"]  

        model = Prophet()
        model.fit(df)

        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)

        predicted_price = forecast.iloc[-1]["yhat"]

        return jsonify({
            "stock": symbol,
            "next_predicted_price": round(predicted_price, 2),
            "prediction_date": str(forecast.iloc[-1]["ds"])
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
