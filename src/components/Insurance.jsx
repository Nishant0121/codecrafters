import React, { useState } from "react";

const InsuranceComponent = () => {
  const insuranceCategories = [
    {
      category: "Health Insurance",
      insurances: [
        {
          name: "Individual Health Insurance",
          description:
            "Covers medical expenses for an individual. Provides protection against hospitalization and other medical costs.",
          price: "$100/month",
          eligibility: "18 - 65 years",
          duration: "1 Year",
          benefits:
            "Covers hospitalization, surgery, consultation, and other medical treatments.",
        },
        {
          name: "Family Floater Health Insurance",
          description:
            "Covers a whole family under a single policy. It is a cost-effective option for families.",
          price: "$250/month",
          eligibility: "Spouses and children",
          duration: "1 Year",
          benefits:
            "Covers hospitalization, outpatient treatments, and preventive care for the entire family.",
        },
        {
          name: "Critical Illness Insurance",
          description:
            "Provides a lump sum payment if diagnosed with any critical illness such as cancer, heart attack, etc.",
          price: "$200/month",
          eligibility: "18 - 65 years",
          duration: "5 Years",
          benefits:
            "Pays a lump sum amount for a variety of critical illnesses such as heart attack, cancer, and strokes.",
        },
        {
          name: "Maternity Health Insurance",
          description:
            "Covers maternity expenses including delivery costs, hospitalization, and newborn care.",
          price: "$150/month",
          eligibility: "Women aged 18 - 45 years",
          duration: "1 Year",
          benefits:
            "Covers medical expenses related to pregnancy, childbirth, and postnatal care.",
        },
      ],
    },
    {
      category: "Life Insurance",
      insurances: [
        {
          name: "Term Life Insurance",
          description:
            "A policy that provides a death benefit to the family if the policyholder dies within the term of the policy.",
          price: "$50/month",
          eligibility: "18 - 60 years",
          duration: "10, 20, or 30 Years",
          benefits:
            "Pays out a death benefit to your loved ones if you pass away during the term of the policy.",
        },
        {
          name: "Whole Life Insurance",
          description:
            "Provides coverage for the entire lifetime of the policyholder with a death benefit and cash value accumulation.",
          price: "$150/month",
          eligibility: "18 - 75 years",
          duration: "Lifetime",
          benefits:
            "Lifetime coverage with a savings component that grows over time, providing cash value accumulation.",
        },
        {
          name: "Endowment Plans",
          description:
            "Combines both life insurance and savings, providing a lump sum payment on policy maturity or death.",
          price: "$100/month",
          eligibility: "18 - 60 years",
          duration: "10, 15, or 20 Years",
          benefits:
            "A combination of insurance and savings that pays out a lump sum either upon death or policy maturity.",
        },
        {
          name: "Unit Linked Insurance Plans (ULIPs)",
          description:
            "Combines life insurance with investment, allowing the policyholder to invest in different funds.",
          price: "$200/month",
          eligibility: "18 - 60 years",
          duration: "10, 15, or 20 Years",
          benefits:
            "A hybrid product that offers both life coverage and an opportunity to invest in various financial instruments.",
        },
      ],
    },
  ];

  const [selectedInsurance, setSelectedInsurance] = useState(null);
  const [filteredInsurances, setFilteredInsurances] = useState(insuranceCategories);
  const [filter, setFilter] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 1000,
  });

  const handleLearnMore = (insurance) => {
    setSelectedInsurance(insurance);
  };

  const handleCloseModal = () => {
    setSelectedInsurance(null);
  };

  const handleBuyNow = (insurance) => {
    alert(`You have successfully purchased ${insurance.name} for ${insurance.price}!`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const applyFilter = () => {
    const filtered = insuranceCategories.map((category) => {
      const filteredInsurances = category.insurances.filter((insurance) => {
        const price = parseInt(insurance.price.replace("$", "").replace("/month", ""));
        return (
          price >= filter.minPrice &&
          price <= filter.maxPrice &&
          (filter.category ? insurance.name.toLowerCase().includes(filter.category.toLowerCase()) : true)
        );
      });
      return { ...category, insurances: filteredInsurances };
    });
    setFilteredInsurances(filtered);
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-lg shadow-2xl mt-10">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Types of Insurances</h1>

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

      {/* Insurance Categories */}
      {filteredInsurances.map((category, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">{category.category}</h2>
          <ul className="list-disc pl-6 text-white">
            {category.insurances.map((insurance, index) => (
              <li key={index} className="text-lg mb-4">
                <div className="flex justify-between items-center">
                  <span>{insurance.name}</span>
                  <div className="space-x-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                      onClick={() => handleLearnMore(insurance)}
                    >
                      Learn More
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                      onClick={() => handleBuyNow(insurance)}
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

      {/* Modal for Detailed Insurance Info */}
      {selectedInsurance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-8 rounded-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">{selectedInsurance.name}</h2>
            <p className="mb-4">{selectedInsurance.description}</p>
            <p className="font-semibold mb-2">Price: {selectedInsurance.price}</p>
            <p className="font-semibold mb-2">Eligibility: {selectedInsurance.eligibility}</p>
            <p className="font-semibold mb-2">Duration: {selectedInsurance.duration}</p>
            <p className="mb-6">Benefits: {selectedInsurance.benefits}</p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-md"
                onClick={() => handleBuyNow(selectedInsurance)}
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

export default InsuranceComponent;
