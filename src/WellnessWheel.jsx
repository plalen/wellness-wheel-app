import React, { useState, useRef } from "react";
import { Download, Info, Copy, CheckCircle, Send } from "lucide-react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/a/macros/uwcthailand.ac.th/s/AKfycbzMCRI1AkTPGlGrsxoHCaaKJeaMa8mg7Dcggt8zz5Su/dev";

const DEFAULT_SCORE = 6;
const CATEGORIES = [
  { name: 'Mental & Emotional Health', key: 'mental', prompts: ['Aware of thoughts and feelings', 'Trusted adults to talk to'] },
  { name: 'Resilience, Attitude & Outlook', key: 'resilience', prompts: ['Can bounce back', 'Grateful and hopeful'] },
  { name: 'Learning', key: 'learning', prompts: ['Academic progress', 'Curious to learn'] },
  { name: 'Agency & Voice', key: 'agency', prompts: ['Say in decisions', 'Voice is heard'] },
  { name: 'Physical Health', key: 'physical', prompts: ['Nutritional choices', 'Sleep habits'] },
  { name: 'Recreation & Exercise', key: 'recreation', prompts: ['Regular exercise', 'Good energy levels'] },
  { name: 'Time Use', key: 'time', prompts: ['Balanced time use', 'Screen time balance'] },
  { name: 'Responsibility & Nature', key: 'responsibility', prompts: ['Sustainable decisions', 'Time in nature'] },
  { name: 'Contribution', key: 'contribution', prompts: ['Positive actions', 'Community involvement'] },
  { name: 'Belonging', key: 'belonging', prompts: ['Feel connected', 'Tribe or community'] },
  { name: 'Relationships', key: 'relationships', prompts: ['Supportive relationships', 'Strong friendships'] },
  { name: 'Fun', key: 'fun', prompts: ['Joy and fun', 'Creative expression'] }
];

const WellnessWheel = () => {
  const [scores, setScores] = useState(Object.fromEntries(CATEGORIES.map(cat => [cat.key, DEFAULT_SCORE])));
  const [name, setName] = useState('');
  const [classValue, setClassValue] = useState('');
  const [likeToMeet, setLikeToMeet] = useState('No');
  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (key, value) => {
    setScores(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const submitToGoogleSheet = () => {
    const submissionId = `WA-${Date.now().toString(36)}`;
    const date = new Date().toISOString().split('T')[0];
    const dataArray = [
      submissionId,
      date,
      name || 'Not provided',
      classValue,
      likeToMeet,
      ...CATEGORIES.map(cat => scores[cat.key]),
      (Object.values(scores).reduce((a, b) => a + b, 0) / CATEGORIES.length).toFixed(1)
    ];

    const headers = [
  "Submission ID", "Date", "Name", "Class", "Like to Meet",
  ...CATEGORIES.map(cat => cat.name),
  "Average Score"
    ];

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_SCRIPT_URL;
    form.style.display = 'none';

    dataArray.forEach((value, i) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `data${i}`;
      input.value = value;
      form.appendChild(input);
    });

    const lengthInput = document.createElement('input');
    lengthInput.type = 'hidden';
    lengthInput.name = 'dataLength';
    lengthInput.value = dataArray.length;
    form.appendChild(lengthInput);

    headers.forEach((value, i) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `header${i}`;
      input.value = value;
      form.appendChild(input);
    });

    const headerLength = document.createElement('input');
    headerLength.type = 'hidden';
    headerLength.name = 'headerLength';
    headerLength.value = headers.length;
    form.appendChild(headerLength);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Wellness Wheel Assessment</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {CATEGORIES.map(cat => (
          <div key={cat.key} className="bg-gray-100 p-4 rounded">
            <h2 className="font-semibold mb-2">{cat.name}</h2>
            <ul className="text-sm mb-2 text-gray-600">
              {cat.prompts.map((p, i) => <li key={i}>• {p}</li>)}
            </ul>
            <input type="range" min="1" max="10" value={scores[cat.key]} onChange={(e) => handleScoreChange(cat.key, e.target.value)} />
            <div>Score: {scores[cat.key]}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-4">
        <input type="text" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Class (required)" value={classValue} onChange={(e) => setClassValue(e.target.value)} className="w-full p-2 border rounded" />
        <div>
          <label className="mr-4">Would you like to meet with a counselor?</label>
          <label className="mr-2"><input type="radio" value="Yes" checked={likeToMeet === 'Yes'} onChange={() => setLikeToMeet('Yes')} /> Yes</label>
          <label><input type="radio" value="No" checked={likeToMeet === 'No'} onChange={() => setLikeToMeet('No')} /> No</label>
        </div>
        <button onClick={submitToGoogleSheet} className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        {submitted && <p className="text-green-600">Submitted!</p>}
      </div>
    </div>
  );
};

export default WellnessWheel;
