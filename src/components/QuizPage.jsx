import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export default function QuizPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state || {};

    const [topic, setTopic] = useState(locationState.topic || null);
    const [questionCount, setQuestionCount] = useState(locationState.questionCount || null);
    const [difficulty, setDifficulty] = useState(locationState.difficulty || null);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [score, setScore] = useState(null);

    const timerRef = useRef(null);
    const quizStartTimeRef = useRef(null);

    // ✅ Load completed quiz from localStorage
    useEffect(() => {
        const completed = localStorage.getItem('quizCompleted');
        if (completed) {
            const data = JSON.parse(completed);
            setScore(data.score);
            setTopic(data.topic);
            setDifficulty(data.difficulty);
            setElapsedTime(data.elapsedTime);
            return;
        }
    }, []);

    // ✅ Prevent navigation if no state AND no saved quiz
    useEffect(() => {
        const saved = localStorage.getItem('resumeQuiz');
        const completed = localStorage.getItem('quizCompleted');
        if ((!locationState.topic || !locationState.questionCount || !topic || !questionCount) && !saved && !completed) {
            navigate('/home');
        }
    }, [locationState, navigate]);

    // ✅ Prevent back navigation
    useEffect(() => {
        const blockBack = (e) => {
            e.preventDefault();
            window.history.pushState(null, '', window.location.href);
        };
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', blockBack);
        return () => window.removeEventListener('popstate', blockBack);
    }, []);

    // ✅ Load questions from API or localStorage
    useEffect(() => {
        const saved = localStorage.getItem('resumeQuiz');
        if (saved) {
            const data = JSON.parse(saved);
            setTopic(data.topic);
            setQuestionCount(data.questionCount);
            setDifficulty(data.difficulty);
            setQuestions(data.questions);
            setAnswers(data.answers);
            setCurrentIndex(data.currentIndex);
            setElapsedTime(data.elapsedTime || 0);
            quizStartTimeRef.current = Date.now() - (data.elapsedTime || 0) * 1000;
            startTimer();
            setLoading(false);
            return;
        }

        const fetchQuestions = async () => {
            const result = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate ${questionCount} multiple-choice quiz questions on ${topic} at ${difficulty} difficulty. Each question should be returned as JSON array like:
[
  {
    "question": "What is the capital of France?",
    "options": [
      "A) Berlin",
      "B) Madrid",
      "C) Paris",
      "D) Rome"
    ],
    "correctAnswer": "C) Paris"
  }
]`,
            });

            const text = result.text.replace(/```json\n?/, '').replace(/```$/, '').trim();
            const parsedQuestions = JSON.parse(text);
            setQuestions(parsedQuestions);
            quizStartTimeRef.current = Date.now();
            startTimer();
            setLoading(false);
        };

        fetchQuestions();
    }, []);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - quizStartTimeRef.current) / 1000));
        }, 1000);
    };

    useEffect(() => {
        if (questions.length > 0) {
            const current = questions[currentIndex];
            const options = [...current.options];
            setShuffledAnswers(options);
        }
    }, [currentIndex, questions]);

    useEffect(() => {
        if (questions.length === 0 || score !== null) return;
        const data = {
            topic,
            difficulty,
            questionCount,
            questions,
            answers,
            currentIndex,
            elapsedTime,
        };
        localStorage.setItem('resumeQuiz', JSON.stringify(data));
    }, [answers, currentIndex, elapsedTime, questions, topic, difficulty, questionCount, score]);

    const handleOptionClick = (option) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = { selectedAnswer: option };
        setAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const submitQuiz = () => {
        clearInterval(timerRef.current);
        let score = 0;
        const answeredQuestions = questions.map((q, i) => {
            const answerObj = answers[i] || {};
            const selected = answerObj.selectedAnswer;
            const correct = q.correctAnswer;
            if (selected === correct) score++;
            return {
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                selectedAnswer: selected,
            };
        });

        const result = {
            topic,
            difficulty,
            total: questions.length,
            score,
            totalTimeTaken: elapsedTime,
            date: new Date().toLocaleString(),
            details: answeredQuestions,
        };

        setScore(score);
        const prev = JSON.parse(localStorage.getItem('quizResults')) || [];
        localStorage.setItem('quizResults', JSON.stringify([...prev, result]));
        localStorage.removeItem('resumeQuiz');

        localStorage.setItem('quizCompleted', JSON.stringify({
            score,
            topic,
            difficulty,
            elapsedTime
        }));
    };

    if (loading) {
        return (
            <div className="w-screen h-screen bg-zinc-950 flex items-center justify-center p-4">
                <div className="w-full max-w-3xl animate-pulse space-y-6">
                    <div className="space-y-3">
                        <div className="h-6 bg-zinc-800 rounded w-1/3" />
                        <div className="h-4 bg-zinc-800 rounded w-1/4" />
                        <div className="h-4 bg-zinc-800 rounded w-1/5" />
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl space-y-4 border border-zinc-700">
                        <div className="h-6 bg-zinc-800 rounded w-3/4" />
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-10 bg-zinc-800 rounded w-full" />
                        ))}
                        <div className="h-10 w-1/4 bg-zinc-700 rounded mt-4" />
                    </div>
                </div>
            </div>
        );
    }

    if (score !== null) {
        return (
            <div className="w-screen h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white flex flex-col items-center justify-center p-4">
                <div className="bg-zinc-800 p-10 rounded-xl shadow-xl text-center max-w-xl">
                    <h1 className="text-4xl font-bold text-green-400 mb-4">🎉 Quiz Completed!</h1>
                    <p className="text-xl">Topic: <span className="font-bold text-blue-300">{topic}</span></p>
                    <p className="text-xl">Difficulty: <span className="font-bold text-yellow-400">{difficulty}</span></p>
                    <p className="text-2xl mt-4">Your Score: <span className="text-purple-400 font-bold">{score}/{questions.length}</span></p>
                    <p className="text-lg text-blue-200 mt-2">
                        🕒 Total Time: <span className="font-bold">{elapsedTime} seconds</span>
                    </p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('quizCompleted');
                            navigate('/home');
                        }}
                        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded-lg font-bold"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const current = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white p-4 flex flex-col">
            <div className="h-2 w-full bg-zinc-800 rounded mb-4 overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <div className="text-center space-y-1 mb-4">
                <h1 className="text-3xl font-bold text-blue-400">{topic} Quiz</h1>
                <p className="text-sm text-gray-300 mt-2">Difficulty: {difficulty} | Total no of questions: {questionCount}</p>
                <p className="text-sm text-green-400 font-mono mt-2">🕒 Elapsed Time: {elapsedTime} seconds</p>
                <p className="text-sm text-blue-300 mt-2">Question {currentIndex + 1} of {questions.length}</p>
            </div>

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.4 }}
                            className="bg-zinc-950 border border-blue-700 p-6 rounded-xl space-y-4 shadow-lg"
                        >
                            <h2 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: current.question }} />
                            {shuffledAnswers.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(option)}
                                    className={`w-full text-left text-black p-3 rounded-lg border border-blue-600 bg-zinc-800 hover:bg-blue-700 transition 
                                        ${answers[currentIndex]?.selectedAnswer === option ? 'bg-blue-700' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: option }}
                                />
                            ))}

                            <div className="flex gap-4 mt-4">
                                {currentIndex > 0 && (
                                    <button
                                        onClick={prevQuestion}
                                        className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-bold text-black"
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentIndex < questions.length - 1 ? (
                                    <button
                                        onClick={nextQuestion}
                                        disabled={!answers[currentIndex]}
                                        className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold text-black disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={submitQuiz}
                                        disabled={!answers[currentIndex]}
                                        className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold disabled:opacity-50 text-black"
                                    >
                                        Submit Quiz
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
