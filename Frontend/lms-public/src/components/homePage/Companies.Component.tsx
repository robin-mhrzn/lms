"use client";
import Image from "next/image";
import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// CAROUSEL SETTINGS
const CompaniesComponent = () => {
  const TruestedCompanies: { imgSrc: string }[] = [
    {
      imgSrc: "/images/companies/airbnb.svg",
    },
    {
      imgSrc: "/images/companies/fedex.svg",
    },
    {
      imgSrc: "/images/companies/google.svg",
    },
    {
      imgSrc: "/images/companies/hubspot.svg",
    },
    {
      imgSrc: "/images/companies/microsoft.svg",
    },
    {
      imgSrc: "/images/companies/walmart.svg",
    },
    {
      imgSrc: "/images/companies/airbnb.svg",
    },
    {
      imgSrc: "/images/companies/fedex.svg",
    },
  ];
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  return (
    <section className="text-center">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <h2 className="text-midnight_text text-2xl font-semibold">
          Trusted by companies of all sizes
        </h2>
        <div className="py-14 border-b ">
          <Slider {...settings}>
            {TruestedCompanies.map((item, i) => (
              <div key={i}>
                <Image
                  src={item.imgSrc}
                  alt={item.imgSrc}
                  width={116}
                  height={36}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CompaniesComponent;
