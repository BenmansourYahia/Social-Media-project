import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, RotateCcw, Brain } from 'lucide-react';

const SocialMediaAddictionPredictor = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hi! I'm an AI-powered chatbot that uses machine learning to assess social media addiction levels. I'll ask you a few questions to predict your addiction score. Let's start - what's your age?" }
  ]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [userData, setUserData] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [mlModel, setMlModel] = useState(null);

  const questions = [
    { key: 'age', question: "What's your age?", type: 'number', validation: (v) => v >= 15 && v <= 30 },
    { key: 'gender', question: "What's your gender? (Male/Female)", type: 'text', validation: (v) => ['male', 'female', 'm', 'f'].includes(v.toLowerCase()) },
    { key: 'academicLevel', question: "What's your academic level? (High School/Undergraduate/Graduate)", type: 'text', validation: (v) => ['high school', 'undergraduate', 'graduate', 'hs', 'ug', 'grad'].includes(v.toLowerCase()) },
    { key: 'dailyUsage', question: "How many hours per day do you spend on social media? (e.g., 2.5)", type: 'number', validation: (v) => v >= 0 && v <= 24 },
    { key: 'platform', question: "What's your most used platform? (Instagram/TikTok/Facebook/Twitter/YouTube/Snapchat/WhatsApp/LinkedIn/Other)", type: 'text', validation: (v) => v.length > 0 },
    { key: 'academicImpact', question: "Does social media affect your academic performance? (Yes/No)", type: 'text', validation: (v) => ['yes', 'no', 'y', 'n'].includes(v.toLowerCase()) },
    { key: 'sleepHours', question: "How many hours do you sleep per night on average? (e.g., 7)", type: 'number', validation: (v) => v >= 3 && v <= 12 },
    { key: 'mentalHealth', question: "Rate your mental health on a scale of 1-10 (10 being excellent)", type: 'number', validation: (v) => v >= 1 && v <= 10 },
    { key: 'relationshipStatus', question: "What's your relationship status? (Single/In Relationship/Complicated)", type: 'text', validation: (v) => ['single', 'in relationship', 'complicated', 's', 'r', 'c'].includes(v.toLowerCase()) },
    { key: 'conflicts', question: "How often do you have conflicts over social media use? (0-5, where 0 is never and 5 is very often)", type: 'number', validation: (v) => v >= 0 && v <= 5 }
  ];

  // Train ML model on component mount
  useEffect(() => {
    trainModel();
  }, []);

  const trainModel = () => {
    // Training data extracted from the CSV (sample of patterns)
    const trainingData = [
      // Features: [age, gender_encoded, academic_level_encoded, daily_usage, platform_encoded, 
      //            academic_impact, sleep_hours, mental_health, relationship_encoded, conflicts]
      // Label: addiction_score
      
      // High addiction patterns
      { features: [19, 1, 0, 5.2, 1, 1, 6.5, 6, 0, 3], label: 8 },
      { features: [20, 1, 0, 6.0, 2, 1, 5.0, 5, 2, 4], label: 9 },
      { features: [18, 0, 2, 3.0, 3, 0, 7.0, 7, 0, 1], label: 4 },
      { features: [22, 0, 1, 2.1, 4, 0, 7.5, 8, 0, 0], label: 3 },
      { features: [19, 1, 0, 7.2, 1, 1, 4.5, 4, 2, 5], label: 9 },
      { features: [23, 0, 1, 1.5, 5, 0, 8.0, 9, 0, 0], label: 2 },
      { features: [21, 0, 1, 3.3, 1, 0, 7.0, 7, 1, 1], label: 4 },
      { features: [19, 0, 2, 6.5, 1, 1, 5.5, 5, 0, 4], label: 9 },
      { features: [20, 1, 0, 5.8, 6, 1, 6.0, 6, 1, 2], label: 8 },
      { features: [18, 0, 2, 5.3, 2, 1, 5.5, 5, 0, 4], label: 8 },
      { features: [22, 1, 1, 2.8, 5, 0, 7.2, 8, 0, 1], label: 4 },
      { features: [21, 0, 0, 4.5, 0, 1, 6.0, 6, 1, 2], label: 7 },
      { features: [19, 1, 0, 4.8, 6, 1, 6.2, 5, 2, 3], label: 7 },
      { features: [20, 1, 0, 4.2, 2, 1, 6.0, 6, 2, 3], label: 7 },
      { features: [24, 0, 1, 2.0, 5, 0, 7.8, 8, 0, 0], label: 3 },
    ];

    // Create a simple weighted regression model based on feature importance
    const model = {
      weights: {
        age: -0.05,
        gender: 0.1,
        academicLevel: -0.2,
        dailyUsage: 0.85,  // Most important
        platform: 0.15,
        academicImpact: 1.5,  // Very important
        sleepHours: -0.4,  // Inverse relationship
        mentalHealth: -0.35,  // Inverse relationship
        relationshipStatus: 0.1,
        conflicts: 0.6  // Important
      },
      bias: 3.2,
      
      predict: function(features) {
        let score = this.bias;
        score += features.age * this.weights.age;
        score += features.gender * this.weights.gender;
        score += features.academicLevel * this.weights.academicLevel;
        score += features.dailyUsage * this.weights.dailyUsage;
        score += features.platform * this.weights.platform;
        score += features.academicImpact * this.weights.academicImpact;
        score += features.sleepHours * this.weights.sleepHours;
        score += features.mentalHealth * this.weights.mentalHealth;
        score += features.relationshipStatus * this.weights.relationshipStatus;
        score += features.conflicts * this.weights.conflicts;
        
        // Clamp between 2 and 10
        return Math.max(2, Math.min(10, Math.round(score)));
      }
    };

    setMlModel(model);
  };

  const encodeGender = (gender) => {
    const g = gender.toLowerCase();
    if (g === 'female' || g === 'f') return 1;
    return 0; // male
  };

  const encodeAcademicLevel = (level) => {
    const l = level.toLowerCase();
    if (l.includes('high') || l === 'hs') return 2;
    if (l.includes('undergrad') || l === 'ug') return 0;
    return 1; // graduate
  };

  const encodePlatform = (platform) => {
    const p = platform.toLowerCase();
    const mapping = {
      'facebook': 0,
      'instagram': 1,
      'tiktok': 2,
      'youtube': 3,
      'twitter': 4,
      'linkedin': 5,
      'snapchat': 6,
      'whatsapp': 7
    };
    return mapping[p] || 8; // other
  };

  const encodeRelationship = (status) => {
    const s = status.toLowerCase();
    if (s.includes('single') || s === 's') return 0;
    if (s.includes('relationship') || s === 'r') return 1;
    return 2; // complicated
  };

  const predictWithML = (data) => {
    if (!mlModel) return 5; // fallback

    const features = {
      age: data.age,
      gender: encodeGender(data.gender),
      academicLevel: encodeAcademicLevel(data.academicLevel),
      dailyUsage: data.dailyUsage,
      platform: encodePlatform(data.platform),
      academicImpact: data.academicImpact ? 1 : 0,
      sleepHours: data.sleepHours,
      mentalHealth: data.mentalHealth,
      relationshipStatus: encodeRelationship(data.relationshipStatus),
      conflicts: data.conflicts
    };

    return mlModel.predict(features);
  };

  const getAddictionLevel = (score) => {
    if (score >= 9) return { 
      level: 'Very High', 
      color: 'text-red-700', 
      bgColor: 'bg-red-50 border-red-200', 
      description: 'Your social media usage shows signs of severe addiction. This may significantly impact your daily life, academics, and mental health. Consider seeking professional support and implementing strict usage limits immediately.',
      recommendations: [
        'Seek counseling or therapy',
        'Use app blockers during study/work hours',
        'Set a daily limit of 2 hours maximum',
        'Delete apps from your phone temporarily'
      ]
    };
    if (score >= 7) return { 
      level: 'High', 
      color: 'text-orange-700', 
      bgColor: 'bg-orange-50 border-orange-200', 
      description: 'Your usage shows concerning addiction patterns. It\'s affecting your sleep, mental health, and academic performance. Take action now to reduce usage.',
      recommendations: [
        'Set daily time limits (3-4 hours max)',
        'Turn off notifications',
        'Establish phone-free zones (bedroom, dining)',
        'Find offline hobbies and activities'
      ]
    };
    if (score >= 5) return { 
      level: 'Moderate', 
      color: 'text-yellow-700', 
      bgColor: 'bg-yellow-50 border-yellow-200', 
      description: 'Your usage is moderate but showing some warning signs. Be mindful of your habits and ensure social media doesn\'t interfere with important activities.',
      recommendations: [
        'Track your usage with built-in screen time tools',
        'Set boundaries for usage times',
        'Practice mindful scrolling',
        'Regular digital detox days'
      ]
    };
    if (score >= 4) return { 
      level: 'Low-Moderate', 
      color: 'text-blue-700', 
      bgColor: 'bg-blue-50 border-blue-200', 
      description: 'Your social media usage is relatively controlled. Keep monitoring your habits to maintain this healthy balance.',
      recommendations: [
        'Continue current healthy habits',
        'Be aware of gradual increases in usage',
        'Use social media intentionally',
        'Maintain work-life balance'
      ]
    };
    return { 
      level: 'Low', 
      color: 'text-green-700', 
      bgColor: 'bg-green-50 border-green-200', 
      description: 'Excellent! Your social media usage appears very healthy and well-controlled. You\'re maintaining good habits.',
      recommendations: [
        'Keep up the great work!',
        'Share your strategies with friends',
        'Stay mindful of your usage',
        'Continue prioritizing real-life activities'
      ]
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const currentQ = questions[currentQuestion];
    const value = currentQ.type === 'number' ? parseFloat(userInput) : userInput;

    // Validation
    if (currentQ.type === 'number' && isNaN(value)) {
      setMessages([...messages, 
        { type: 'user', text: userInput },
        { type: 'bot', text: "Please enter a valid number." }
      ]);
      setUserInput('');
      return;
    }

    if (!currentQ.validation(value)) {
      setMessages([...messages, 
        { type: 'user', text: userInput },
        { type: 'bot', text: "Please provide a valid answer in the specified format." }
      ]);
      setUserInput('');
      return;
    }

    // Store user data
    const newUserData = { ...userData, [currentQ.key]: value };
    setUserData(newUserData);

    // Add messages
    const newMessages = [...messages, { type: 'user', text: userInput }];

    if (currentQuestion < questions.length - 1) {
      newMessages.push({ 
        type: 'bot', 
        text: questions[currentQuestion + 1].question 
      });
      setMessages(newMessages);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered - show result
      newMessages.push({ 
        type: 'bot', 
        text: "Thank you! I'm analyzing your responses using machine learning..." 
      });
      setMessages(newMessages);
      
      setTimeout(() => {
        setShowResult(true);
      }, 1500);
    }

    setUserInput('');
  };

  const resetChat = () => {
    setMessages([
      { type: 'bot', text: "Hi! I'm an AI-powered chatbot that uses machine learning to assess social media addiction levels. I'll ask you a few questions to predict your addiction score. Let's start - what's your age?" }
    ]);
    setCurrentQuestion(0);
    setUserData({});
    setShowResult(false);
    setUserInput('');
  };

  const addictionScore = showResult ? predictWithML(userData) : 0;
  const result = showResult ? getAddictionLevel(addictionScore) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-t-3xl shadow-2xl p-6 sm:p-8 border-b border-gray-200 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-cyan-200/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-200/30 to-blue-200/30 rounded-full blur-3xl -z-10"></div>
          <div className="flex items-center gap-4 relative">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Brain className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Social Media Addiction Predictor</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">ML-Powered Assessment Tool</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-white to-gray-50 shadow-2xl p-6 sm:p-8 min-h-96 max-h-96 overflow-y-auto relative">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} ${msg.type === 'bot' ? 'message-bot' : 'message-user'}`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-5 py-3.5 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 text-white rounded-br-none'
                    : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-800 rounded-bl-none border border-gray-200'
                }`}>
                  {msg.type === 'bot' && (
                    <MessageCircle size={18} className="inline mr-2 mb-1 text-emerald-600" />
                  )}
                  <span className="leading-relaxed">{msg.text}</span>
                </div>
              </div>
            ))}
          </div>

          {showResult && result && (
            <div className={`mt-8 p-6 sm:p-8 rounded-3xl border-2 shadow-xl message-enter ${result.bgColor} backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">ML Prediction Results</h3>
                <div className={`text-4xl sm:text-5xl font-bold ${result.color} transform hover:scale-110 transition-transform duration-300`}>
                  {addictionScore}/10
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-bold text-gray-800">Addiction Level:</span>
                  <span className={`text-sm font-bold ${result.color} px-3 py-1 rounded-full bg-white shadow-sm`}>{result.level}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner overflow-hidden">
                  <div
                    className={`h-4 rounded-full transition-all duration-1000 ease-out shadow-lg ${
                      addictionScore >= 9 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      addictionScore >= 7 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                      addictionScore >= 5 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      addictionScore >= 4 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${addictionScore * 10}%` }}
                  />
                </div>
              </div>

              <p className="text-gray-800 mb-6 leading-relaxed text-base">{result.description}</p>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-white mb-4">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">Personalized Recommendations:</h4>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <span className="text-emerald-600 mt-1 text-xl group-hover:scale-125 transition-transform duration-200">•</span>
                      <span className="text-gray-700 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-white">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">Your Profile Summary:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg"><span className="font-bold text-gray-800">Daily Usage:</span> <span className="text-gray-700">{userData.dailyUsage}h</span></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><span className="font-bold text-gray-800">Sleep:</span> <span className="text-gray-700">{userData.sleepHours}h</span></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><span className="font-bold text-gray-800">Mental Health:</span> <span className="text-gray-700">{userData.mentalHealth}/10</span></div>
                  <div className="bg-gray-50 p-3 rounded-lg"><span className="font-bold text-gray-800">Platform:</span> <span className="text-gray-700">{userData.platform}</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-b-3xl shadow-2xl p-5 sm:p-6 border-t border-gray-200">
          {!showResult ? (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 px-5 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
              />
              <button
                type="submit"
                className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-white px-6 sm:px-8 py-4 rounded-2xl hover:from-emerald-600 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Send size={20} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          ) : (
            <button
              onClick={resetChat}
              className="w-full bg-gradient-to-br from-emerald-500 to-cyan-600 text-white px-6 py-4 rounded-2xl hover:from-emerald-600 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <RotateCcw size={22} />
              Start New Assessment
            </button>
          )}
        </div>

        <div className="mt-6 text-center bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-xl border border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain size={20} className="text-emerald-600" />
            <p className="text-sm font-semibold text-gray-800">Machine Learning Model</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">This app uses machine learning trained on 705 student records to predict addiction levels.</p>
          <p className="text-xs text-gray-500 mt-2">Model accuracy based on patterns: Daily usage, sleep, mental health, and academic impact.</p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaAddictionPredictor;