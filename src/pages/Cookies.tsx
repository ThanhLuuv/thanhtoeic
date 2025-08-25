import React from 'react';

const Cookies: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> January 15, 2025<br />
            <strong>Version:</strong> 1.0
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">1. What Are Cookies?</h2>
          <p className="text-gray-600 mb-6">
            Cookies are small text files stored on your device when you visit a website. 
            They help websites remember information about your visit, improve user experience, 
            and provide useful information to website owners.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">2. Cookies I Use</h2>
          
          <h3 className="text-xl font-semibold text-black mb-3">2.1 Essential Cookies</h3>
          <p className="text-gray-600 mb-4">
            These cookies are necessary for the website to function normally:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Login session cookies</li>
            <li>Security cookies</li>
            <li>Language setting cookies</li>
            <li>Preference memory cookies</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-black mb-3">2.2 Analytics Cookies</h3>
          <p className="text-gray-600 mb-4">
            I use analytics cookies to understand how users interact with the website:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Google Analytics</li>
            <li>Traffic statistics</li>
            <li>User behavior analysis</li>
            <li>Website performance improvement</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-black mb-3">2.3 Advertising Cookies</h3>
          <p className="text-gray-600 mb-6">
            If you accept, I may use advertising cookies to display ads relevant to your interests. 
            These cookies may be set by my advertising partners.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">3. Third-Party Cookies</h2>
          <p className="text-gray-600 mb-6">
            I may use third-party services such as Google Analytics, Facebook Pixel, 
            or other advertising platforms. These services may set their own cookies on your device.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">4. Managing Cookies</h2>
          <p className="text-gray-600 mb-4">
            You can control and manage cookies through:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies</li>
            <li><strong>Cookie control panel:</strong> Use the control panel on my website</li>
            <li><strong>Ad settings:</strong> Customize Google advertising settings</li>
            <li><strong>Opt-out tools:</strong> Use advertising opt-out tools</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">5. Browser-Specific Instructions</h2>
          
          <h3 className="text-xl font-semibold text-black mb-3">5.1 Google Chrome</h3>
          <p className="text-gray-600 mb-4">
            Go to Settings → Privacy and security → Cookies and other site data
          </p>
          
          <h3 className="text-xl font-semibold text-black mb-3">5.2 Mozilla Firefox</h3>
          <p className="text-gray-600 mb-4">
            Go to Settings → Privacy & Security → Cookies and Site Data
          </p>
          
          <h3 className="text-xl font-semibold text-black mb-3">5.3 Safari</h3>
          <p className="text-gray-600 mb-4">
            Go to Preferences → Privacy → Cookies and website data
          </p>
          
          <h3 className="text-xl font-semibold text-black mb-3">5.4 Microsoft Edge</h3>
          <p className="text-gray-600 mb-6">
            Go to Settings → Cookies and site permissions
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">6. Impact of Disabling Cookies</h2>
          <p className="text-gray-600 mb-6">
            If you disable cookies, some website features may not work normally:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Unable to login or remember accounts</li>
            <li>Unable to save settings and preferences</li>
            <li>Some interactive features may be disrupted</li>
            <li>User experience may be affected</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">7. Cookie Policy Updates</h2>
          <p className="text-gray-600 mb-6">
            I may update this cookie policy from time to time to reflect changes 
            in how I use cookies or for legal reasons. Important changes will be 
            notified via email or notice on the website.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">8. Contact</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about this cookie policy or how I use cookies, 
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

export default Cookies;
