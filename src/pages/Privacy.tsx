import React from 'react';

const Privacy: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> January 15, 2025<br />
            <strong>Version:</strong> 1.0
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            AntToeic ("I", "my", or "platform") is committed to protecting your privacy 
            and personal information. This privacy policy explains how I collect, 
            use, protect, and share your information when you use my TOEIC learning platform.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">2. Information I Collect</h2>
          
          <h3 className="text-xl font-semibold text-black mb-3">2.1 Personal Information</h3>
          <p className="text-gray-600 mb-4">
            When you register an account or use services, I may collect:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number (if provided)</li>
            <li>Learning account information</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-black mb-3">2.2 Usage Information</h3>
          <p className="text-gray-600 mb-4">
            I automatically collect information about how you use the platform:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Access and usage time</li>
            <li>Websites you visit</li>
            <li>Device and browser you use</li>
            <li>IP address</li>
            <li>Learning progress and results</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">3. How I Use Information</h2>
          <p className="text-gray-600 mb-4">
            I use the collected information to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Provide and improve learning services</li>
            <li>Send notifications and service updates</li>
            <li>Support students and resolve issues</li>
            <li>Analyze and optimize user experience</li>
            <li>Comply with legal obligations</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">4. Sharing Information</h2>
          <p className="text-gray-600 mb-6">
            I do not sell, exchange, or transfer your personal information to third parties 
            without your consent, except in the following cases:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>When required by law or government agencies</li>
            <li>To protect my rights and property</li>
            <li>In emergency cases to protect user safety</li>
            <li>With service providers necessary to operate the platform</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">5. Information Security</h2>
          <p className="text-gray-600 mb-6">
            I implement appropriate security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Data encryption during transmission</li>
            <li>Database security with firewalls</li>
            <li>Strict access control</li>
            <li>Continuous security monitoring</li>
            <li>Compliance with information security standards</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">6. Cookies and Tracking Technologies</h2>
          <p className="text-gray-600 mb-6">
            I use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Remember your preferences and settings</li>
            <li>Analyze traffic and usage</li>
            <li>Improve performance and user experience</li>
            <li>Provide personalized content</li>
          </ul>
          <p className="text-gray-600 mb-6">
            You can control cookies through browser settings. 
            See details at the <a href="/cookies" className="text-black underline">Cookie Policy</a> page.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">7. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Right to access and view information</li>
            <li>Right to edit and update information</li>
            <li>Right to delete account and data</li>
            <li>Right to withdraw consent</li>
            <li>Right to complain to data protection authorities</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">8. Data Retention</h2>
          <p className="text-gray-600 mb-6">
            I retain your personal information for as long as necessary to provide services 
            or comply with legal obligations. When no longer needed, I will delete or anonymize the data.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">9. Policy Changes</h2>
          <p className="text-gray-600 mb-6">
            I may update this privacy policy from time to time. 
            Important changes will be notified via email or notice on the platform. 
            Continued use of services after changes is considered acceptance of the new policy.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">10. Contact</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about this privacy policy or how I handle personal information, 
            please contact me:<br /><br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Address:</strong> Thu Duc District, Ho Chi Minh City<br />
            <strong>Phone:</strong> 0876 06 6907<br />
            <strong>Website:</strong> <a href="/contact" className="text-black underline">Contact</a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
