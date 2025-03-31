import React from "react";

const HeroSectionComponent = () => {
  return (
    <div
      className="relative bg-cover bg-center py-20"
      style={{
        marginBottom: "90px",
        backgroundImage: "url('/path-to-image.jpg')",
      }}
    >
      <div className="container mx-auto text-center text-white py-10">
        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
          Learn From Home
        </h1>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-5">
          Education Courses
        </h1>
        <div className="mx-auto mb-5 max-w-lg">
          <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-3 font-medium focus:outline-none"
                type="button"
              >
                Courses
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                <a
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  href="#"
                >
                  Courses 1
                </a>
                <a
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  href="#"
                >
                  Courses 2
                </a>
                <a
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  href="#"
                >
                  Courses 3
                </a>
              </div>
            </div>
            <input
              type="text"
              className="flex-grow px-4 py-3 text-gray-700 focus:outline-none"
              placeholder="Keyword"
            />
            <button className="bg-secondary text-white px-4 py-3 font-medium">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionComponent;
