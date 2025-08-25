import React from 'react';

const Terms: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> January 15, 2025<br />
            <strong>Version:</strong> 1.0
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">1. Accepting Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing and using the AntToeic platform, you agree to comply with and be bound by 
            these terms and conditions. If you do not agree with any part of these terms, 
            please do not use my services.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">2. Service Description</h2>
          <p className="text-gray-600 mb-6">
            AntToeic provides a free online learning platform including:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>TOEIC exercises and practice</li>
            <li>Learning materials</li>
            <li>Assessment and progress tracking system</li>
            <li>Student support</li>
            <li>High-quality educational content</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">3. Account Registration</h2>
          <p className="text-gray-600 mb-6">
            To use some platform features, you need to register an account. You commit to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Provide accurate and complete information</li>
            <li>Secure your login information</li>
            <li>Not share your account with others</li>
            <li>Report security violations immediately</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">4. Service Usage</h2>
          <p className="text-gray-600 mb-6">
            You commit to using services legally and appropriately for educational purposes. 
            You may not:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Violate copyright or intellectual property rights</li>
            <li>Distribute illegal or harmful content</li>
            <li>Interfere with system operations</li>
            <li>Use services for unauthorized commercial purposes</li>
            <li>Collect personal information of other users</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">5. Content and Copyright</h2>
          <p className="text-gray-600 mb-6">
            All content on the AntToeic platform, including text, images, audio, video, 
            and software, belongs to me or is licensed for use. 
            You may not copy, distribute, or use this content without permission.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">6. Educational Purpose</h2>
          <p className="text-gray-600 mb-6">
            <strong>Free:</strong> All content and services on the platform are completely free. 
            I do not charge fees or require payment from users.<br /><br />
            <strong>Purpose:</strong> The platform is developed for educational purposes and knowledge sharing, 
            with no commercial or profit motives.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">7. Information Security</h2>
          <p className="text-gray-600 mb-6">
            I am committed to protecting your personal information according to the <a href="/privacy" className="text-black underline">Privacy Policy</a>. 
            Your information will be processed securely and only used for providing educational services.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            AntToeic provides services "as is" and does not guarantee that services will be uninterrupted 
            or error-free. I am not responsible for any damages arising from service usage.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">9. Terms Changes</h2>
          <p className="text-gray-600 mb-6">
            I reserve the right to change these terms at any time. 
            Changes will take effect immediately when posted. 
            Continued use of services after changes is considered acceptance of new terms.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">10. Contact</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about these terms, please contact me:<br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Address:</strong> Thu Duc District, Ho Chi Minh City<br />
            <strong>Phone:</strong> 0876 06 6907
          </p>
        </div>
      </div>
    </main>
  );
};

export default Terms;
