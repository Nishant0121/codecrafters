import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// NewsCard component to handle each individual article
const NewsCard = ({ article }) => {
  return (
    <div
      className="bg-gradient-to-r from-gray-800 to-black p-6 rounded-xl shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105"
    >
      <h3 className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 mb-4">
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
  );
};

const StockNewsResults = () => {
  const { symbol } = useParams(); // Get the stock symbol from URL parameters
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = '60cbf3de60f84d66a80660989436a280'; // NewsAPI key
  const newsApiUrl=""
  // const newsApiUrl = `https://newsapi.org/v2/everything?q=${symbol}+stock&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;

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
    <div className="max-w-9xl mx-auto p-6 bg-black-900 rounded-lg shadow-lg mt-22">
      <h2 className="text-3xl font-semibold text-white mb-8 text-center">
        Stock News for {symbol}
      </h2>

      {newsArticles.length === 0 ? (
        <p className="text-center text-gray-500">No news available for this stock symbol.</p>
      ) : (
        <div className="space-y-6">
          {newsArticles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StockNewsResults;
