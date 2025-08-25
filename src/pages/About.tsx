import React from 'react';

const About: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">About Me</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            AntToeic is a personal TOEIC learning platform, developed by me - someone passionate about 
            education and technology, who wants to share knowledge and help students achieve their TOEIC goals.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-black">Full Name:</h3>
              <p className="text-gray-600">Luu Van Thanh</p>
            </div>
           
            <div>
              <h3 className="font-semibold text-black">Address:</h3>
              <p className="text-gray-600">Thu Duc District, Ho Chi Minh City</p>
            </div>
            <div>
              <h3 className="font-semibold text-black">Email:</h3>
              <p className="text-gray-600">lvthanh.work@gmail.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-black">Phone:</h3>
              <p className="text-gray-600">0876 06 6907</p>
            </div>
            <div>
              <h3 className="font-semibold text-black">Website:</h3>
              <p className="text-gray-600">thanhtoeic.online</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-black mb-4">Mission</h2>
          <p className="text-gray-600 mb-6">
            I am committed to providing effective, high-quality TOEIC learning solutions with advanced technology, 
            helping students achieve their desired scores quickly and sustainably.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">Core Values</h2>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Top-quality education</li>
            <li>Continuous technological innovation</li>
            <li>Optimal user experience</li>
            <li>24/7 student support</li>
            <li>Commitment to learning results</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">About the Project</h2>
          <p className="text-gray-600 mb-6">
            This is a personal project developed for educational purposes and knowledge sharing. 
            I have no commercial purpose or intention to sell courses. All content is free 
            and created from personal experience and knowledge.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">Commitment</h2>
          <p className="text-gray-600 mb-6">
            I am committed to maintaining content quality, regular updates, and always being ready to 
            support students in their TOEIC learning journey.
          </p>
        </div>
      </div>
      
      {/* Schema.org Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Luu Van Thanh",
            "url": "https://thanhtoeic.online",
            "image": "https://thanhtoeic.online/logo.png",
            "description": "Developer of the AntToeic TOEIC learning platform",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Thu Duc District",
              "addressLocality": "Ho Chi Minh City",
              "addressRegion": "Ho Chi Minh City",
              "addressCountry": "VN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "0876 06 6907",
              "contactType": "personal",
              "email": "lvthanh.work@gmail.com"
            },
            "sameAs": [
              "https://thanhtoeic.online"
            ]
          })
        }}
      />
    </main>
  );
};

export default About;
