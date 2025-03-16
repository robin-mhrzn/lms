"use client";
import { useState } from "react";

export default function LMSLandingPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}

      {/* Hero Section */}
      <header className="bg-blue-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold">Learn Anytime, Anywhere</h1>
        <p className="mt-4 text-lg">Join thousands of learners worldwide</p>
        <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md">
          Get Started
        </button>
      </header>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Why Choose Our LMS?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg">Expert Instructors</h3>
            <p className="text-gray-600 mt-2">
              Learn from industry experts with hands-on experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg">Flexible Learning</h3>
            <p className="text-gray-600 mt-2">
              Access courses anytime, anywhere, on any device.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-lg">Certifications</h3>
            <p className="text-gray-600 mt-2">
              Earn recognized certificates to advance your career.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-200 py-16 text-center">
        <h2 className="text-2xl font-bold mb-6">What Our Students Say</h2>
        <p className="max-w-3xl mx-auto text-gray-700">
          "This platform has transformed the way I learn! The courses are
          well-structured and easy to follow."
        </p>
        <p className="mt-4 font-semibold">- John Doe</p>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6">
        <p>&copy; 2025 LMS Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
