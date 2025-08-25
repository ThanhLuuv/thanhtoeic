import React from 'react';

const TOEICGuide: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8">
        <h1 className="text-3xl font-bold text-black mb-6">Complete TOEIC Learning Guide</h1>
        
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 p-6 mb-8 border-l-4 border-blue-400">
            <h2 className="text-2xl font-semibold text-black mb-4">What is TOEIC?</h2>
            <p className="text-gray-700 text-lg">
              TOEIC (Test of English for International Communication) is a standardized test that measures 
              English language proficiency for non-native speakers in business and professional environments. 
              It's widely recognized by companies and organizations worldwide.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-black mb-4">TOEIC Test Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-3">Listening Section (45 minutes)</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Part 1: Photographs (6 questions)</li>
                <li>Part 2: Question-Response (25 questions)</li>
                <li>Part 3: Conversations (39 questions)</li>
                <li>Part 4: Short Talks (30 questions)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-3">Reading Section (75 minutes)</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Part 5: Incomplete Sentences (30 questions)</li>
                <li>Part 6: Text Completion (16 questions)</li>
                <li>Part 7: Reading Comprehension (54 questions)</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-black mb-4">Scoring System</h2>
          <p className="text-gray-600 mb-4">
            TOEIC scores range from 10 to 990 points, with separate scores for Listening and Reading sections:
          </p>
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Score Range</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Proficiency Level</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">900-990</td>
                  <td className="border border-gray-300 px-4 py-2">International Professional</td>
                  <td className="border border-gray-300 px-4 py-2">Can communicate effectively in any situation</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">800-899</td>
                  <td className="border border-gray-300 px-4 py-2">Working Proficiency Plus</td>
                  <td className="border border-gray-300 px-4 py-2">Can handle most work situations with confidence</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">700-799</td>
                  <td className="border border-gray-300 px-4 py-2">Working Proficiency</td>
                  <td className="border border-gray-300 px-4 py-2">Can handle routine work situations</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">600-699</td>
                  <td className="border border-gray-300 px-4 py-2">Elementary Proficiency Plus</td>
                  <td className="border border-gray-300 px-4 py-2">Can handle basic work situations</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">500-599</td>
                  <td className="border border-gray-300 px-4 py-2">Elementary Proficiency</td>
                  <td className="border border-gray-300 px-4 py-2">Can handle simple work situations</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Below 500</td>
                  <td className="border border-gray-300 px-4 py-2">Basic</td>
                  <td className="border border-gray-300 px-4 py-2">Needs improvement for work situations</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-black mb-4">Effective Study Strategies</h2>
          
          <h3 className="text-xl font-semibold text-black mb-3">1. Listening Skills Development</h3>
          <p className="text-gray-600 mb-4">
            Improving listening skills requires consistent practice and exposure to various accents and speaking speeds:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Daily listening practice:</strong> Listen to English podcasts, news, and movies</li>
            <li><strong>Focus on business English:</strong> Practice with business-related content</li>
            <li><strong>Note-taking skills:</strong> Learn to take effective notes during listening</li>
            <li><strong>Accent familiarity:</strong> Expose yourself to different English accents</li>
            <li><strong>Speed adaptation:</strong> Practice with various speaking speeds</li>
          </ul>

          <h3 className="text-xl font-semibold text-black mb-3">2. Reading Comprehension Strategies</h3>
          <p className="text-gray-600 mb-4">
            Reading comprehension in TOEIC requires both speed and accuracy:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Skimming and scanning:</strong> Learn to quickly identify key information</li>
            <li><strong>Context clues:</strong> Use surrounding text to understand unknown words</li>
            <li><strong>Time management:</strong> Allocate time wisely across different question types</li>
            <li><strong>Business vocabulary:</strong> Build a strong foundation of business terms</li>
            <li><strong>Practice with authentic materials:</strong> Use real business documents and emails</li>
          </ul>

          <h3 className="text-xl font-semibold text-black mb-3">3. Grammar and Vocabulary Building</h3>
          <p className="text-gray-600 mb-4">
            A solid foundation in grammar and vocabulary is essential for TOEIC success:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Essential grammar rules:</strong> Master basic to intermediate grammar concepts</li>
            <li><strong>Business vocabulary:</strong> Learn industry-specific terms and expressions</li>
            <li><strong>Phrasal verbs:</strong> Understand common phrasal verbs used in business</li>
            <li><strong>Collocations:</strong> Learn word combinations that sound natural</li>
            <li><strong>Idiomatic expressions:</strong> Understand common business idioms</li>
          </ul>

          <h2 className="text-2xl font-semibold text-black mb-4">Study Schedule Recommendations</h2>
          <div className="bg-yellow-50 p-6 mb-8 border-l-4 border-yellow-400">
            <h3 className="text-lg font-semibold text-black mb-3">3-Month Intensive Study Plan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold text-black mb-2">Month 1: Foundation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Basic grammar review</li>
                  <li>• Essential vocabulary building</li>
                  <li>• Listening practice (30 min/day)</li>
                  <li>• Reading practice (30 min/day)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-2">Month 2: Skills Development</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Advanced grammar practice</li>
                  <li>• Business vocabulary expansion</li>
                  <li>• Full practice tests</li>
                  <li>• Weak area identification</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-2">Month 3: Test Preparation</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mock test simulation</li>
                  <li>• Time management practice</li>
                  <li>• Final review and practice</li>
                  <li>• Test-taking strategies</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-black mb-4">Common TOEIC Mistakes to Avoid</h2>
          <div className="bg-red-50 p-6 mb-8 border-l-4 border-red-400">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Poor time management:</strong> Spending too much time on difficult questions</li>
              <li><strong>Ignoring context:</strong> Not using surrounding information to answer questions</li>
              <li><strong>Vocabulary gaps:</strong> Not building a strong business vocabulary foundation</li>
              <li><strong>Lack of practice:</strong> Not taking enough practice tests before the actual exam</li>
              <li><strong>Neglecting weak areas:</strong> Focusing only on strengths instead of improving weaknesses</li>
              <li><strong>Not reading instructions:</strong> Missing important details in question requirements</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-black mb-4">Test Day Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-3">Before the Test</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Get adequate sleep the night before</li>
                <li>• Eat a healthy breakfast</li>
                <li>• Arrive at the test center early</li>
                <li>• Bring required identification</li>
                <li>• Use the restroom before starting</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-black mb-3">During the Test</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Read all instructions carefully</li>
                <li>• Manage your time effectively</li>
                <li>• Answer every question (no penalty for wrong answers)</li>
                <li>• Stay focused and avoid distractions</li>
                <li>• Use process of elimination when unsure</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-black mb-4">Resources for TOEIC Preparation</h2>
          <p className="text-gray-600 mb-4">
            Utilize these resources to enhance your TOEIC preparation:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2 ml-4">
            <li><strong>Official TOEIC materials:</strong> Use official practice tests and study guides</li>
            <li><strong>Online platforms:</strong> Practice with digital tools and mobile apps</li>
            <li><strong>Business publications:</strong> Read business magazines and newspapers</li>
            <li><strong>English podcasts:</strong> Listen to business and news podcasts</li>
            <li><strong>Study groups:</strong> Join study groups for motivation and support</li>
            <li><strong>Professional courses:</strong> Consider enrolling in TOEIC preparation courses</li>
          </ul>

          <div className="bg-blue-50 p-6 mt-8 border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold text-black mb-2">Remember</h3>
            <p className="text-gray-700">
              TOEIC success requires consistent effort, proper preparation, and strategic practice. 
              Use this guide as a roadmap to achieve your target score and advance your career opportunities.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TOEICGuide;
