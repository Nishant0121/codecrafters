import { useParams } from "react-router-dom"; // Make sure this is imported
import { useState, useEffect } from "react";
import axios from "axios";

const StockNewsResults = () => {
  const { symbol } = useParams(); // Get the stock symbol from URL parameters
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = '60cbf3de60f84d66a80660989436a280'; // NewsAPI key
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${symbol}+stock&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;

  useEffect(() => {
    if (symbol) {
      const fetchNews = async () => {
        try {
          const response = await axios.get(newsApiUrl);
          setNewsArticles(response.data.articles);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch news');
          setLoading(false);
        }
      };

      fetchNews();
    }
  }, [symbol]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-300">
        <div className="text-xl">Loading stock news...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-white mb-8 text-center">
        Stock News for {symbol}
      </h2>

      {newsArticles.length === 0 ? (
        <p className="text-center text-gray-500">No news available for this stock symbol.</p>
      ) : (
        newsArticles.map((article, index) => (
          <div key={index} className="mb-6 p-6 bg-gray-800 rounded-lg shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
            <h3 className="text-2xl font-bold text-indigo-500 hover:text-indigo-400 mb-4">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </h3>
            <p className="text-sm text-gray-400 mb-2">
              <strong>Published on:</strong> {new Date(article.publishedAt).toLocaleDateString()}
            </p>
            <p className="text-gray-300 mb-4">{article.description}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline"
            >
              Read more
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default StockNewsResults;
