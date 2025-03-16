from flask import Flask, jsonify, request
import yfinance as yf
from prophet import Prophet
import pandas as pd
import joblib  # To load the trained model
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
model = joblib.load("stock_recommendation_model.pkl")


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    features = [
        data['sma_50'],
        data['sma_200'],
        data['rsi'],
        data['macd'],
        data['daily_return']
    ]
    prediction = model.predict([features])
    return jsonify({"recommendation": int(prediction[0])})


@app.route("/predict/<symbol>", methods=["GET"])
def predict_stock(symbol):
    try:
        # Download stock data for the last year
        data = yf.download(symbol, period="1y", interval="1d")

        # Check if data is empty
        if data.empty:
            return jsonify({"error": "No data available for this symbol"}), 400

        # Prepare the data for Prophet
        df = data.reset_index()[["Date", "Close"]]  # Prophet expects "ds" and "y" columns
        df.columns = ["ds", "y"]  # Rename columns for Prophet

        # Initialize and train Prophet model
        prophet_model = Prophet()
        prophet_model.fit(df)

        # Make future predictions (7 days into the future)
        future = prophet_model.make_future_dataframe(df, periods=7)
        forecast = prophet_model.predict(future)

        # Get the predicted price for the next day (the last prediction)
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
