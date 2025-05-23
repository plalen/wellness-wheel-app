import React, { useState, useRef } from 'react';
import { Download, Info, Copy, CheckCircle, Send } from 'lucide-react';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0YweAGMq0sVDHuJ_ABx3v8Le9H9O05tonMw4VGOfJlEt1NbXohdpQ3DrHlfE7bRyV/exec";

const DEFAULT_SCORE = 6;
const CATEGORIES = [
  { name: 'Mental & Emotional Health', key: 'mental', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Resilience, Attitude & Outlook', key: 'resilience', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Learning', key: 'learning', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Agency & Voice', key: 'agency', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Physical Health', key: 'physical', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Recreation & Exercise', key: 'recreation', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Time Use', key: 'time', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Responsibility & Connection to Nature', key: 'responsibility', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Contribution', key: 'contribution', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Sense of Belonging', key: 'belonging', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Relationships', key: 'relationships', prompts: ['Prompt 1', 'Prompt 2'] },
  { name: 'Sense of Fun', key: 'fun', prompts: ['Prompt 1', 'Prompt 2'] },
];

const WellnessWheel = () => {
  const [scores, setScores] = useState(Object.fromEntries(CATEGORIES.map(cat => [cat.key, DEFAULT_SCORE])));
  const [name, setName] = useState('');
  const [classValue, setClassValue] = useState('');
  const [likeToMeet, setLikeToMeet] = useState('No');
  const [submitted, setSubmitted] = useState(false);
  const textAreaRef = useRef(null);

  const generateDataArray = () => {
    const date = new Date().toISOString().split('T')[0];
    const dataArray = [
      `WA-${Date.now().toString(36)}`,
      date,
      name || 'Not provided',
      classValue,
      likeToMeet,
      ...CATEGORIES.map(cat => scores[cat.key].toString()),
      (CATEGORIES.reduce((sum, cat) => sum + scores[cat.key], 0) / CATEGORIES.length).toFixed(1)
    ];
    return dataArray;
  };

  const submitToGoogleSheet = () => {
    const dataArray = generateDataArray();
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = GOOGLE_SCRIPT_URL;
    form.style.display = 'none';

    dataArray.forEach((value, index) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `data${index}`;
      input.value = value;
      form.appendChild(input);
    });

    const lengthInput = document.createElement('input');
    lengthInput.type = 'hidden';
    lengthInput.name = 'dataLength';
    lengthInput.value = dataArray.length;
    form.appendChild(lengthInput);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    setSubmitted(true);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wellness Wheel Assessment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORIES.map(cat => (
          <div key={cat.key}>
            <label className="block font-medium">{cat.name}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={scores[cat.key]}
              onChange={e => setScores(prev => ({ ...prev, [cat.key]: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div>Score: {scores[cat.key]}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Class (required)"
          value={classValue}
          onChange={e => setClassValue(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div>
          <label>Would you like to meet with a counselor?</label>
          <div className="flex space-x-4 mt-1">
            <label><input type="radio" value="Yes" checked={likeToMeet === 'Yes'} onChange={() => setLikeToMeet('Yes')} /> Yes</label>
            <label><input type="radio" value="No" checked={likeToMeet === 'No'} onChange={() => setLikeToMeet('No')} /> No</label>
          </div>
        </div>
        <button
          onClick={submitToGoogleSheet}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit to Google Sheet
        </button>
        {submitted && <div className="text-green-600 mt-2">Submitted successfully!</div>}
      </div>
    </div>
  );
};

export default WellnessWheel;
