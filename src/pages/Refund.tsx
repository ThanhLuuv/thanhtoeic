import React from 'react';

const Refund: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">Important Notice</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> January 15, 2025<br />
            <strong>Version:</strong> 1.0
          </p>
          
          <div className="bg-gray-100 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4">Completely Free Project</h2>
            <p className="text-black text-lg">
              AntToeic is a personal educational project, developed with the purpose of sharing knowledge 
              and supporting the TOEIC learning community. <strong>All content and services are completely free.</strong>
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-black mb-4">1. No Purchases</h2>
          <p className="text-gray-600 mb-6">
            This website does not provide any paid courses, has no payment system, 
            and does not charge users. All content is shared for free.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">2. Educational Purpose</h2>
          <p className="text-gray-600 mb-6">
            The project is developed with the following purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Share free TOEIC knowledge</li>
            <li>Support the learning community</li>
            <li>Develop technology skills</li>
            <li>Contribute to Vietnamese education</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">3. Revenue Sources</h2>
          <p className="text-gray-600 mb-6">
            To maintain and develop the project, I may use:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Google AdSense advertising (if approved)</li>
            <li>Community support (if available)</li>
            <li>Personal investment</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">4. Commitments</h2>
          <p className="text-gray-600 mb-6">
            I commit to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Always keep learning content free</li>
            <li>Never require payment from users</li>
            <li>Maintain high-quality content</li>
            <li>Support students 24/7</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">5. Supporting the Project</h2>
          <p className="text-gray-600 mb-6">
            If you want to support the project, you can:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Share the website with friends</li>
            <li>Leave positive reviews</li>
            <li>Provide feedback to improve content</li>
            <li>Report bugs if encountered</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">6. Contact</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about the project or need support, please contact me:<br /><br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Phone:</strong> 0876 06 6907<br />
            <strong>Working hours:</strong> Monday - Friday: 8:00 - 18:00<br />
            <strong>Website:</strong> <a href="/contact" className="text-black underline">Contact</a>
          </p>
          
          <div className="bg-gray-100 p-6 mt-8">
            <h3 className="text-lg font-semibold text-black mb-2">Note</h3>
            <p className="text-black">
              Since this is a free project, there is no refund policy. However, I am always ready to 
              support you during platform usage and answer all questions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Refund;
