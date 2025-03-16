import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });
  const [faqOpen, setFaqOpen] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">Contact Us</h1>

        <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Information 📞</h2>
          <p className="mb-2"><strong>Store Address:</strong> 123 Vision Lane, Optics City, OC 45678</p>
          <p className="mb-2"><strong>Phone Number:</strong> +1-555-123-4567</p>
          <p className="mb-2"><strong>Email Address:</strong> support@youropticalstore.com</p>
          <p><strong>Business Hours:</strong> Mon-Fri: 9 AM - 6 PM | Sat: 10 AM - 4 PM | Sun: Closed</p>
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Form ✍️</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required className="w-full p-2 border rounded-md min-h-[100px]" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Submit</button>
          </form>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Find Us 📍</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.139692171181!2d96.14854007467705!3d16.77410408397727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c1ec84f91b66b3%3A0x89c4a091dd4535ae!2sYangon!5e0!3m2!1sen!2smm!4v1710123456789"
            className="w-full h-64 rounded-lg shadow-lg"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">FAQs ❓</h2>
          {[
            { question: 'How can I track my order?', answer: 'Use the tracking link sent to your email after purchase.' },
            { question: 'Do you offer prescription glasses?', answer: 'Yes, upload your prescription via our website or visit our store.' },
            { question: 'What’s your return policy?', answer: '30-day returns with original packaging.' },
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-2">
              <button onClick={() => setFaqOpen(faqOpen === index ? null : index)} className="flex justify-between w-full text-left font-medium">
                {faq.question} <FaChevronDown className={`${faqOpen === index ? 'rotate-180' : ''} transition-transform`} />
              </button>
              {faqOpen === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
            </div>
          ))}
        </section>

        <section className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Book an Eye Test 👓</h2>
          <p className="text-gray-600 mb-4">Schedule an appointment for an eye exam with our experts.</p>
          <button onClick={() => setShowBooking(!showBooking)} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Book Now</button>
          {showBooking && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="text-xl font-semibold">Eye Doctor Appointment</h3>
              <p className="text-gray-600">Please select a date and time for your eye exam.</p>
              <input type="date" className="w-full p-2 border rounded-md mt-2" />
              <input type="time" className="w-full p-2 border rounded-md mt-2" />
              <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Confirm Appointment</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
