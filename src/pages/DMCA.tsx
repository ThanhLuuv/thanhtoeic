import React from 'react';

const DMCA: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">DMCA Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-gray-100 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4">DMCA Information</h2>
            <p className="text-black text-lg">
              AntToeic respects intellectual property rights and is committed to complying with 
              the Digital Millennium Copyright Act (DMCA).
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-black mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            This DMCA policy explains how AntToeic handles copyright infringement complaints 
            under the Digital Millennium Copyright Act (DMCA) of the United States. 
            We are committed to protecting intellectual property rights and take all complaints seriously.
          </p>
          
          <h2 className="text-2xl font-semibold text-black mb-4">2. Copyright Infringement Notice</h2>
          <p className="text-gray-600 mb-6">
            If you believe that content on AntToeic infringes your copyright, 
            please send a copyright infringement notice under DMCA with the following information:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Complainant information:</strong> Full name, address, phone number, email</li>
            <li><strong>Work description:</strong> Detailed description of the copyrighted work being infringed</li>
            <li><strong>Infringement location:</strong> Specific URL of infringing content on AntToeic</li>
            <li><strong>Statement:</strong> Statement that you believe the use is not authorized</li>
            <li><strong>Confirmation:</strong> Confirmation that information in the notice is accurate</li>
            <li><strong>Signature:</strong> Electronic or physical signature of the copyright owner</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">3. Sending DMCA Notice</h2>
          <p className="text-gray-600 mb-6">
            Copyright infringement notices can be sent via:
          </p>
          <div className="bg-gray-100 p-4 mb-6">
            <p className="text-black font-semibold">Email:</p>
            <p className="text-gray-600">lvthanh.work@gmail.com</p>
            <p className="text-black font-semibold mt-2">Email subject:</p>
            <p className="text-gray-600">"DMCA Takedown Request - [Work Title]"</p>
          </div>
          
          <h2 className="text-2xl font-semibold text-black mb-4">4. Processing Procedure</h2>
          <p className="text-gray-600 mb-6">
            When a valid copyright infringement notice is received, AntToeic will:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Review notice:</strong> Check the validity of the DMCA notice</li>
            <li><strong>Verify ownership:</strong> Verify copyright ownership</li>
            <li><strong>Remove content:</strong> Remove or disable infringing content</li>
            <li><strong>Notify user:</strong> Notify the user who posted the content</li>
            <li><strong>Record:</strong> Record the processing in the system</li>
          </ol>
          
          <h2 className="text-2xl font-semibold text-black mb-4">5. Counter-Notice</h2>
          <p className="text-gray-600 mb-6">
            If you believe your content was removed by mistake, you can send a counter-notice with:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Personal information:</strong> Full name, address, phone number, email</li>
            <li><strong>Content identification:</strong> Identify the removed content</li>
            <li><strong>Statement:</strong> Statement that you believe the content was removed by mistake</li>
            <li><strong>Consent:</strong> Consent to local court jurisdiction</li>
            <li><strong>Signature:</strong> Electronic or physical signature</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">6. Repeat Infringement</h2>
          <p className="text-gray-600 mb-6">
            AntToeic has a strict policy for users who repeatedly violate copyright:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>First time:</strong> Warning and removal of infringing content</li>
            <li><strong>Second time:</strong> Temporary account suspension</li>
            <li><strong>Third time:</strong> Permanent account suspension</li>
            <li><strong>Reporting:</strong> Report to authorities if necessary</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">7. Contact</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about the DMCA policy or need support, 
            please contact me:<br /><br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Phone:</strong> 0876 06 6907<br />
            <strong>Address:</strong> Thu Duc District, Ho Chi Minh City<br />
            <strong>Website:</strong> <a href="/contact" className="text-black underline">Contact</a>
          </p>
          
          <div className="bg-gray-100 p-6 mt-8">
            <h3 className="text-lg font-semibold text-black mb-2">Important Note</h3>
            <p className="text-black">
              Only send DMCA notices if you actually own the copyright to the infringed content. 
              Sending false notices can lead to serious legal consequences.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DMCA;
