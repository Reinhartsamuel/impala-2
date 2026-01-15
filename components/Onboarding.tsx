import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ONBOARDING_STEPS } from '../constants/constants.ts';
import { OnboardingData, RiskProfileType } from '../types';
import ImpalaMascot from './ImpalaMascot';

interface OnboardingProps {
  onComplete: (data: OnboardingData, riskProfile: RiskProfileType) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingData>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const currentStep = ONBOARDING_STEPS[stepIndex];

  const handleSelect = (optionLabel: string, value?: string) => {
    const key = currentStep.id;
    // Store either specific value (for logic) or the label
    setAnswers(prev => ({ ...prev, [key]: value || optionLabel }));
  };

  const handleNext = () => {
    if (stepIndex < ONBOARDING_STEPS.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(prev => prev - 1);
  };

  const calculateRiskProfile = (data: Partial<OnboardingData>): RiskProfileType => {
    let score = 0;

    // Logic based on volatility reaction
    if (data.volatilityReaction === 'high') score += 3;
    else if (data.volatilityReaction === 'medium') score += 2;
    else score += 1;

    // Logic based on Experience
    if (data.defiExperience === 'advanced') score += 3;
    else if (data.defiExperience === 'intermediate') score += 2;
    else score += 1;

    // Timeline logic adjustment (approximate based on labels)
    if (data.timeline?.includes('10 years')) score += 1; // Long term allows more risk

    if (score >= 6) return RiskProfileType.Degen;
    if (score >= 5) return RiskProfileType.Aggressive;
    if (score >= 3) return RiskProfileType.Balanced;
    return RiskProfileType.Conservative;
  };

  const finishOnboarding = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const risk = calculateRiskProfile(answers);
      onComplete(answers as OnboardingData, risk);
    }, 1500); // Fake calculation delay for effect
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-impala-50">
        <ImpalaMascot mood="thinking" message="Crunching the numbers to build your empire..." />
        <div className="mt-8 w-64 h-2 bg-impala-200 rounded-full overflow-hidden">
          <div className="h-full bg-impala-500 animate-[width_1.5s_ease-in-out_forwards]" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }

  const selectedValue = answers[currentStep.id as keyof OnboardingData];
  const isSelected = (label: string, val?: string) => {
      // Check if the answer matches the value (if present) or the label
      return selectedValue === (val || label);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto pt-8 pb-12">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-impala-200 rounded-full mb-8 relative">
        <div
          className="h-full bg-impala-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((stepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
        />
      </div>

      <div className="w-full bg-white rounded-3xl shadow-xl p-6 sm:p-10 relative overflow-hidden border border-impala-100">

        {/* Header */}
        <div className="mb-8">
           <h2 className="text-3xl font-display font-bold text-stone-800 mb-2">{currentStep.question}</h2>
           <p className="text-stone-500">{currentStep.subtitle}</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {currentStep.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt.label, (opt as any).value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group
                ${isSelected(opt.label, (opt as any).value)
                  ? 'border-impala-500 bg-impala-50'
                  : 'border-stone-100 hover:border-impala-300 hover:bg-stone-50'
                }`}
            >
              <div className="flex items-center gap-4">
                {(opt as any).icon && <span className="text-2xl">{(opt as any).icon}</span>}
                <div>
                  <div className={`font-bold ${isSelected(opt.label, (opt as any).value) ? 'text-impala-600' : 'text-stone-700'}`}>
                    {opt.label}
                  </div>
                  <div className="text-sm text-stone-400 font-medium">
                    {opt.sub}
                  </div>
                </div>
              </div>
              {isSelected(opt.label, (opt as any).value) && (
                <CheckCircle2 className="text-impala-500 w-6 h-6" />
              )}
            </button>
          ))}
        </div>

        {/* Footer Nav */}
        <div className="flex justify-between items-center pt-6 pb-2 border-t border-stone-100">
          <button
            onClick={handleBack}
            disabled={stepIndex === 0}
            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg transition-colors
              ${stepIndex === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <ArrowLeft size={20} /> Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedValue}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1
              ${!selectedValue
                ? 'bg-stone-300 cursor-not-allowed shadow-none'
                : 'bg-impala-500 hover:bg-impala-600 shadow-impala-200'}`}
          >
            {stepIndex === ONBOARDING_STEPS.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Helper Impala */}
      <div className="mt-20 mb-4 flex justify-center">
         <ImpalaMascot
            mood="happy"
            message={!selectedValue ? "Take your time! No wrong answers here." : "Great choice! Moving right along."}
         />
      </div>
    </div>
  );
};

export default Onboarding;
