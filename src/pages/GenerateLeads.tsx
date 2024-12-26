import React from 'react';
import ProductForm from '../components/ProductForm';
import { Sparkles } from 'lucide-react';

export default function GenerateLeads() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-xl mb-4">
          <Sparkles className="h-6 w-6 text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          AI-Powered Lead Generation
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Enter your product details and let our AI find the perfect target companies
          for your business. Get detailed insights and qualified leads instantly.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-purple-900/30">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Product Information
          </h2>
          <ProductForm />
        </div>
      </div>
    </div>
  );
}