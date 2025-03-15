import React, { useState } from "react";

const BondsAndSecuritiesComponent = () => {
  const financialProducts = [
    {
      category: "Bonds",
      products: [
        {
          name: "Government Bond (10 Year)",
          description:
            "A long-term bond issued by the government, generally considered to be low-risk. Pays interest semi-annually.",
          price: "$1,000 (minimum investment)",
          interestRate: "2.5% annually",
          maturity: "10 Years",
          riskLevel: "Low",
          benefits:
            "Guaranteed returns from the government with a fixed interest rate, suitable for conservative investors.",
        },
        {
          name: "Corporate Bond (5 Year)",
          description:
            "A bond issued by a corporation. Pays fixed interest and can be riskier than government bonds depending on the company.",
          price: "$500 (minimum investment)",
          interestRate: "5% annually",
          maturity: "5 Years",
          riskLevel: "Medium",
          benefits:
            "Higher return potential than government bonds but comes with higher risk based on the issuing company’s credit rating.",
        },
        {
          name: "Municipal Bond",
          description:
            "Issued by a local government, often tax-exempt. Suitable for investors looking for long-term stable income.",
          price: "$1,000 (minimum investment)",
          interestRate: "3.2% annually",
          maturity: "10 Years",
          riskLevel: "Low",
          benefits:
            "Provides tax-exempt income for residents and offers low risk compared to other bonds.",
        },
        {
          name: "Junk Bond",
          description:
            "High-yield bonds issued by companies with lower credit ratings. Offers higher returns but comes with higher risk.",
          price: "$500 (minimum investment)",
          interestRate: "8% annually",
          maturity: "5 Years",
          riskLevel: "High",
          benefits:
            "Higher returns but also higher risk. Suitable for aggressive investors looking for returns in exchange for potential risk.",
        },
      ],
    },
    {
      category: "Securities",
      products: [
        {
          name: "Stock - Tech Company",
          description:
            "Invest in shares of a major tech company. Stocks are volatile but offer the potential for high returns over time.",
          price: "Variable (depends on market price)",
          returns: "Annualized return of 10%",
          riskLevel: "High",
          benefits:
            "Opportunity for capital appreciation, high liquidity, and the potential for long-term growth in the tech sector.",
        },
        {
          name: "Exchange Traded Fund (ETF)",
          description:
            "A type of security that tracks an index, commodity, or a basket of assets. It's a low-cost way to diversify your investment.",
          price: "Variable (depends on the ETF)",
          returns: "Annualized return of 7%",
          riskLevel: "Medium",
          benefits:
            "Diversification, lower risk than individual stocks, and lower fees compared to mutual funds.",
        },
        {
          name: "Mutual Fund",
          description:
            "A managed investment fund where money from many investors is pooled together and managed by a fund manager.",
          price: "$1,000 (minimum investment)",
          returns: "Annualized return of 8%",
          riskLevel: "Medium",
          benefits:
            "Diversification, professionally managed, and the ability to invest in a wide range of assets.",
        },
        {
          name: "Real Estate Investment Trust (REIT)",
          description:
            "An investment vehicle that owns, operates, or finances real estate that produces income. REITs are traded like stocks.",
          price: "$500 (minimum investment)",
          returns: "Annualized return of 5%",
          riskLevel: "Medium",
          benefits:
            "Gives exposure to real estate markets with relatively low investment compared to buying properties directly.",
        },
      ],
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(financialProducts);
  const [filter, setFilter] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 10000,
  });

  const handleLearnMore = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleBuyNow = (product) => {
    alert(`You have successfully purchased ${product.name} for ${product.price}!`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const applyFilter = () => {
    const filtered = financialProducts.map((category) => {
      const filteredProducts = category.products.filter((product) => {
        const price = parseInt(product.price.replace("$", "").replace(" (minimum investment)", ""));
        return (
          price >= filter.minPrice &&
          price <= filter.maxPrice &&
          (filter.category ? product.name.toLowerCase().includes(filter.category.toLowerCase()) : true)
        );
      });
      return { ...category, products: filteredProducts };
    });
    setFilteredProducts(filtered);
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg shadow-2xl mt-10">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Bonds and Securities</h1>

      {/* Filter Section */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            name="category"
            placeholder="Filter by name"
            value={filter.category}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-md bg-gray-700 text-white"
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filter.minPrice}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-md bg-gray-700 text-white"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filter.maxPrice}
            onChange={handleFilterChange}
            className="px-4 py-2 rounded-md bg-gray-700 text-white"
          />
        </div>
        <button
          onClick={applyFilter}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {/* Financial Products Categories */}
      {filteredProducts.map((category, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">{category.category}</h2>
          <ul className="list-disc pl-6 text-white">
            {category.products.map((product, index) => (
              <li key={index} className="text-lg mb-4">
                <div className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <div className="space-x-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                      onClick={() => handleLearnMore(product)}
                    >
                      Learn More
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Modal for Detailed Product Info */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">{selectedProduct.name}</h2>
            <p className="mb-4">{selectedProduct.description}</p>
            <p className="font-semibold mb-2">Price: {selectedProduct.price}</p>
            <p className="font-semibold mb-2">Interest Rate: {selectedProduct.interestRate}</p>
            <p className="font-semibold mb-2">Maturity: {selectedProduct.maturity}</p>
            <p className="font-semibold mb-2">Risk Level: {selectedProduct.riskLevel}</p>
            <p className="mb-6">Benefits: {selectedProduct.benefits}</p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md"
                onClick={() => handleBuyNow(selectedProduct)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BondsAndSecuritiesComponent;
