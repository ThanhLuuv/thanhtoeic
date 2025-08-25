import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">Contact</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-black mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div>
                  <h3 className="font-semibold text-black">Address</h3>
                  <p className="text-gray-600">Thu Duc District, Ho Chi Minh City</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div>
                  <h3 className="font-semibold text-black">Phone</h3>
                  <p className="text-gray-600">0876 06 6907</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div>
                  <h3 className="font-semibold text-black">Email</h3>
                  <p className="text-gray-600">lvthanh.work@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div>
                  <h3 className="font-semibold text-black">Working Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 8:00 - 18:00</p>
                  <p className="text-gray-600">Saturday: 8:00 - 12:00</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-black mb-3">Student Support</h3>
              <p className="text-gray-600 mb-4">
                I am always ready to help you 24/7. Please contact me if you need support with:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Platform usage guidance</li>
                <li>Technical issues</li>
                <li>Learning content</li>
                <li>Registration and accounts</li>
                <li>Feedback and suggestions</li>
              </ul>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-black mb-4">Send Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-black mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="Enter message subject"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-1">
                  Message Content *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                  placeholder="Enter your message content"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 hover:bg-gray-800 focus:outline-none transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Schema.org ContactPoint */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact - AntToeic",
            "description": "Contact page of AntToeic - Personal TOEIC learning platform",
            "url": "https://thanhtoeic.online/contact",
            "mainEntity": {
              "@type": "Person",
              "name": "Luu Van Thanh",
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "0876 06 6907",
                  "contactType": "personal",
                  "email": "lvthanh.work@gmail.com",
                  "availableLanguage": ["Vietnamese", "English"],
                  "hoursAvailable": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    "opens": "08:00",
                    "closes": "18:00"
                  }
                }
              ]
            }
          })
        }}
      />
    </main>
  );
};

export default Contact;
