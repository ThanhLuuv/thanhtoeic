import React from 'react';

const Community: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">AntToeic Community</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-gray-100 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-black mb-4">Welcome to the Community</h2>
            <p className="text-black text-lg">
              AntToeic is not just a learning platform, but also a place to connect the community 
              of people who love and are passionate about learning TOEIC.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-black mb-4">1. Community Goals</h2>
          <p className="text-gray-600 mb-6">
            The AntToeic community is built with the following goals:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li>Share TOEIC learning experiences</li>
            <li>Support each other in the learning process</li>
            <li>Create a positive learning environment</li>
            <li>Connect people with similar goals</li>
            <li>Build a sustainable learning culture</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">2. Community Rules</h2>
          <p className="text-gray-600 mb-6">
            To maintain a healthy learning environment, all members must follow:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Respect each other:</strong> No offensive behavior or discrimination</li>
            <li><strong>Positive sharing:</strong> Only share useful content, no spam</li>
            <li><strong>Learning support:</strong> Be willing to help others when possible</li>
            <li><strong>Follow regulations:</strong> No copyright violations or inappropriate content</li>
            <li><strong>Build culture:</strong> Contribute to creating a positive learning environment</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">3. Community Activities</h2>
          <p className="text-gray-600 mb-6">
            The community will organize activities such as:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Experience sharing:</strong> High-scoring students share tips</li>
            <li><strong>Group discussions:</strong> Discuss difficult TOEIC topics</li>
            <li><strong>Learning support:</strong> Answer questions and provide guidance</li>
            <li><strong>Material sharing:</strong> Useful learning materials</li>
            <li><strong>Learning challenges:</strong> Challenges to increase motivation</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">4. How to Participate</h2>
          <p className="text-gray-600 mb-6">
            To participate in the community effectively:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Create account:</strong> Create an account on the AntToeic platform</li>
            <li><strong>Introduce yourself:</strong> Share your learning goals</li>
            <li><strong>Join discussions:</strong> Ask questions and answer others</li>
            <li><strong>Share experiences:</strong> Contribute your knowledge</li>
            <li><strong>Connect:</strong> Make friends with people who have similar goals</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">5. Benefits of Participation</h2>
          <p className="text-gray-600 mb-6">
            Participating in the community will bring:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Diverse knowledge:</strong> Learn from different perspectives</li>
            <li><strong>Learning motivation:</strong> Inspiration from successful people</li>
            <li><strong>Timely support:</strong> Quick answers to questions</li>
            <li><strong>Network building:</strong> Build learning relationships</li>
            <li><strong>Skill development:</strong> Practice communication and sharing abilities</li>
          </ul>
          
          <h2 className="text-2xl font-semibold text-black mb-4">6. Contact</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about the community or want to contribute ideas, 
            please contact me:<br /><br />
            <strong>Email:</strong> lvthanh.work@gmail.com<br />
            <strong>Phone:</strong> 0876 06 6907<br />
            <strong>Website:</strong> <a href="/contact" className="text-black underline">Contact</a>
          </p>
          
          <div className="bg-gray-100 p-6 mt-8">
            <h3 className="text-lg font-semibold text-black mb-2">Note</h3>
            <p className="text-black">
              The AntToeic community is completely free and open to everyone. 
              Let's work together to build the best TOEIC learning environment!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Community;
