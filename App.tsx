
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { StudyPlanDisplay } from './components/StudyPlanDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { StudyPlanData } from './types';
import { extractTextFromPdf } from './utils/pdfUtils';
import { generateStudyPlanWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setStudyPlan(null);
    setPdfText(null);
    setCurrentFileName(file.name);

    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
      if (text.trim().length === 0) {
        setError("The PDF appears to be empty or contains no extractable text. Please try another PDF.");
        setIsLoading(false);
        return;
      }
      
      const plan = await generateStudyPlanWithGemini(text);
      setStudyPlan(plan);
    } catch (err) {
      console.error("Error processing PDF or generating plan:", err);
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}. Please check the console for more details or try a different PDF.`);
      } else {
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetState = () => {
    setPdfText(null);
    setStudyPlan(null);
    setError(null);
    setIsLoading(false);
    setCurrentFileName(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {!studyPlan && !isLoading && !error && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sky-700 mb-4">Unlock Your Study Potential</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload your course handout or PDF. QuickCore will analyze it and create a personalized study plan to help you ace your exams!
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
          {isLoading ? (
            <Loader message={currentFileName ? `Analyzing ${currentFileName} and crafting your plan...` : "Processing..."} />
          ) : error ? (
            <>
              <ErrorMessage message={error} />
              <button
                onClick={resetState}
                className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
              >
                Try Another PDF
              </button>
            </>
          ) : studyPlan ? (
            <>
              <StudyPlanDisplay plan={studyPlan} pdfName={currentFileName || "your document"} />
              <button
                onClick={resetState}
                className="mt-8 w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
              >
                Analyze Another PDF
              </button>
            </>
          ) : (
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
