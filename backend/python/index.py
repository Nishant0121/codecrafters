from flask import Flask, jsonify, request
import yfinance as yf
from prophet import Prophet
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])  # Use POST to send a list of symbols
def predict_stocks():
    try:
        request_data = request.get_json()
        symbols = request_data.get("symbols", [])  # Get list of stock symbols

        if not symbols:
            return jsonify({"error": "No symbols provided"}), 400

        predictions = []

        for symbol in symbols:
            try:
                data = yf.download(symbol, period="1y", interval="1d")

                if data.empty:
                    predictions.append({"stock": symbol, "error": "No data available"})
                    continue

                df = data.reset_index()[["Date", "Close"]]
                df.columns = ["ds", "y"]  

                model = Prophet()
                model.fit(df)

                future = model.make_future_dataframe(periods=7)
                forecast = model.predict(future)

                predicted_price = forecast.iloc[-1]["yhat"]

                predictions.append({
                    "stock": symbol,
                    "next_predicted_price": round(predicted_price, 2),
                    "prediction_date": str(forecast.iloc[-1]["ds"])
                })
            except Exception as e:
                predictions.append({"stock": symbol, "error": str(e)})

        return jsonify(predictions)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
