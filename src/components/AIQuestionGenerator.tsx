"use client";
import React, { useState, useEffect } from 'react';
import { AIService } from '../utils/aiService';
import { getGenres } from '../utils/api';

interface AIQuestionGeneratorProps {
  onQuestionGenerated?: (question: string, prompt: string, genreIds: number[]) => void;
}

export default function AIQuestionGenerator({ onQuestionGenerated }: AIQuestionGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('huggingface');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());

  // Available AI providers
  const providers = AIService.getAvailableProviders();

  // Sample prompts for inspiration
  const samplePrompts = [
    "Create questions about travel and adventure",
    "Generate questions about personal values and beliefs",
    "Make questions about hobbies and interests",
    "Create questions about future goals and dreams",
    "Generate questions about favorite memories",
    "Make questions about food and dining preferences"
  ];

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await getGenres();
      setGenres(response.data || response);
    } catch (error) {
      console.error('Failed to fetch genres:', error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for question generation');
      return;
    }

    if (!selectedGenre) {
      setError('Please select a genre');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');
    setGeneratedQuestions([]);
    setSelectedQuestions(new Set());

    try {
      const result = await AIService.generateQuestions(
        prompt,
        selectedGenre,
        questionCount,
        selectedProvider as any
      );

      if (result.success) {
        if (result.questions.length > 0) {
          setGeneratedQuestions(result.questions);
          setSuccess(`Successfully generated ${result.questions.length} questions!`);
        } else {
          // Fallback to sample questions
          const sampleQuestions = AIService.generateSampleQuestions(selectedGenre);
          setGeneratedQuestions(sampleQuestions);
          setSuccess(`AI generation failed, showing sample questions for ${selectedGenre}`);
        }
      } else {
        // Fallback to sample questions
        const sampleQuestions = AIService.generateSampleQuestions(selectedGenre);
        setGeneratedQuestions(sampleQuestions);
        setError(result.error || 'AI generation failed, showing sample questions instead');
      }
    } catch (error) {
      console.error('Generation error:', error);
      // Fallback to sample questions
      const sampleQuestions = AIService.generateSampleQuestions(selectedGenre);
      setGeneratedQuestions(sampleQuestions);
      setError('AI service unavailable, showing sample questions instead');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleQuestionSelection = (index: number) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedQuestions(newSelected);
  };

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question).then(() => {
      setSuccess(`Copied: "${question.substring(0, 50)}..."`);
      setTimeout(() => setSuccess(''), 2000);
    });
  };

  const copySelectedQuestions = () => {
    const selected = Array.from(selectedQuestions)
      .map(index => generatedQuestions[index])
      .join('\n');
    
    navigator.clipboard.writeText(selected).then(() => {
      setSuccess(`Copied ${selectedQuestions.size} questions to clipboard!`);
      setTimeout(() => setSuccess(''), 2000);
    });
  };

  const addSelectedQuestions = () => {
    if (selectedQuestions.size === 0) {
      setError('Please select at least one question to add');
      return;
    }

    const selectedGenreObj = genres.find(g => g.name === selectedGenre);
    if (!selectedGenreObj) {
      setError('Selected genre not found');
      return;
    }

    // Add each selected question
    selectedQuestions.forEach(index => {
      const question = generatedQuestions[index];
      if (onQuestionGenerated) {
        onQuestionGenerated(question, prompt, [selectedGenreObj.genre_id]);
      }
    });

    setSuccess(`Added ${selectedQuestions.size} questions to your collection!`);
    setSelectedQuestions(new Set());
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🤖 AI Question Generator</h2>
        <p className="text-gray-600">
          Generate engaging conversation questions using AI. Enter a prompt and let AI create unique questions for your selected genre.
        </p>
      </div>

      {/* Configuration Form */}
      <div className="space-y-4 mb-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt for AI Generation *
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={3}
            placeholder="e.g., Create questions about travel and adventure, Generate questions about personal values..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="mt-1">
            <p className="text-xs text-gray-500">Sample prompts:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {samplePrompts.map((sample, index) => (
                <button
                  key={index}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                  onClick={() => setPrompt(sample)}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Genre Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre *
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Select a genre</option>
            {genres.map((genre) => (
              <option key={genre.genre_id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* AI Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Provider
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name} {provider.requiresKey ? '(API Key Required)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions (1-10)
          </label>
          <input
            type="number"
            min="1"
            max="10"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={questionCount}
            onChange={(e) => setQuestionCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim() || !selectedGenre}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Questions...
            </span>
          ) : (
            '🎯 Generate Questions'
          )}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Generated Questions */}
      {generatedQuestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Generated Questions ({generatedQuestions.length})
            </h3>
            <div className="flex gap-2">
              {selectedQuestions.size > 0 && (
                <button
                  onClick={copySelectedQuestions}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  📋 Copy Selected ({selectedQuestions.size})
                </button>
              )}
              {selectedQuestions.size > 0 && onQuestionGenerated && (
                <button
                  onClick={addSelectedQuestions}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  ➕ Add Selected ({selectedQuestions.size})
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {generatedQuestions.map((question, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedQuestions.has(index)
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleQuestionSelection(index)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(index)}
                      onChange={() => toggleQuestionSelection(index)}
                      className="mt-1"
                    />
                    <p className="text-gray-800 flex-1">{question}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyQuestion(question);
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    title="Copy question"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            💡 Tip: Click on questions to select them, then use the buttons above to copy or add them to your collection.
          </div>
        </div>
      )}
    </div>
  );
}
