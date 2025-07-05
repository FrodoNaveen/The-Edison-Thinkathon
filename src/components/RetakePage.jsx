// import { useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// export default function RetakeQuiz() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { questions, topic, difficulty } = location.state || {};

//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [selectedAnswers, setSelectedAnswers] = useState({});
//     const [timeTaken, setTimeTaken] = useState(0);
//     const [isSubmitted, setIsSubmitted] = useState(false);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTimeTaken((prev) => prev + 1);
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);

//     if (!questions || questions.length === 0) {
//         return <p className="text-center text-white">No questions to display.</p>;
//     }

//     const currentQuestion = questions[currentIndex];

//     const handleOptionClick = (index) => {
//         if (isSubmitted) return;
//         setSelectedAnswers({
//             ...selectedAnswers,
//             [currentIndex]: index,
//         });
//     };

//     const handleSubmit = () => {
//         setIsSubmitted(true);

//         const total = questions.length;
//         let score = 0;

//         const details = questions.map((q, i) => {
//             const selectedIndex = selectedAnswers[i];
//             const correctIndex = ["A", "B", "C", "D"].indexOf(q.correctAnswer?.charAt(0));

//             if (selectedIndex === correctIndex) score++;

//             return {
//                 ...q,
//                 selectedAnswer: q.options[selectedIndex]
//                     ? `${["A", "B", "C", "D"][selectedIndex]}. ${q.options[selectedIndex]}`
//                     : null,
//             };
//         });

//         const summary = {
//             topic,
//             difficulty,
//             score,
//             total,
//             totalTime: timeTaken,
//             date: new Date().toLocaleString(),
//             details,
//         };

//         const stored = JSON.parse(localStorage.getItem("quizResults")) || [];
//         localStorage.setItem("quizResults", JSON.stringify([...stored, summary]));

//         navigate("/summary");
//     };

//     return (
//         <div className="min-h-screen bg-black text-white p-4 max-w-3xl mx-auto">
//             <h1 className="text-2xl font-bold text-blue-400 mb-4 text-center">Retake Quiz - {topic}</h1>

//             <div className="text-right text-yellow-300 mb-2">⏱ Time: {timeTaken}s</div>

//             <div className="mb-6">
//                 <p className="font-semibold mb-2">
//                     {currentIndex + 1}. {currentQuestion.question}
//                 </p>
//                 {currentQuestion.options.map((option, idx) => {
//                     const isSelected = selectedAnswers[currentIndex] === idx;
//                     const correctIndex = ["A", "B", "C", "D"].indexOf(currentQuestion.correctAnswer?.charAt(0));

//                     let style = "bg-zinc-800";
//                     if (isSubmitted) {
//                         if (idx === correctIndex && idx === selectedAnswers[currentIndex]) {
//                             style = "bg-green-700 border-green-400";
//                         } else if (idx === correctIndex) {
//                             style = "bg-green-800 border-green-400";
//                         } else if (idx === selectedAnswers[currentIndex]) {
//                             style = "bg-red-800 border-red-400";
//                         }
//                     } else if (isSelected) {
//                         style = "bg-blue-600 border-blue-400";
//                     }

//                     return (
//                         <div
//                             key={idx}
//                             className={`p-2 rounded border mb-2 cursor-pointer ${style}`}
//                             onClick={() => handleOptionClick(idx)}
//                         >
//                             {option}
//                         </div>
//                     );
//                 })}
//             </div>

//             <div className="flex justify-between items-center mt-4">
//                 <button
//                     onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
//                     className="bg-zinc-700 px-4 py-2 rounded hover:bg-zinc-600"
//                     disabled={currentIndex === 0}
//                 >
//                     ⬅ Prev
//                 </button>

//                 {currentIndex === questions.length - 1 ? (
//                     <button
//                         onClick={handleSubmit}
//                         className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
//                     >
//                         ✅ Submit
//                     </button>
//                 ) : (
//                     <button
//                         onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
//                         className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//                     >
//                         ➡ Next
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// }



import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function RetakeQuiz() {
    const navigate = useNavigate();
    const location = useLocation();
    const { questions: passedQuestions, topic, difficulty, retake } = location.state || {};

    const [questions, setQuestions] = useState(passedQuestions || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);

    const timerRef = useRef(null);
    const quizStartTimeRef = useRef(null);

    useEffect(() => {
        if (!passedQuestions || passedQuestions.length === 0) {
            navigate('/home');
        } else {
            quizStartTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - quizStartTimeRef.current) / 1000));
            }, 1000);
            setQuestions(passedQuestions);
            setLoading(false);
        }

        const blockBack = (e) => {
            e.preventDefault();
            window.history.pushState(null, '', window.location.href);
        };
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', blockBack);
        return () => window.removeEventListener('popstate', blockBack);
    }, [passedQuestions, navigate]);

    useEffect(() => {
        if (questions.length > 0) {
            const options = [...questions[currentIndex].options];
            setShuffledAnswers(options);
        }
    }, [currentIndex, questions]);

    const handleOptionClick = (option) => {
        const newAnswers = [...answers];
        newAnswers[currentIndex] = {
            selectedAnswer: option,
        };
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

    // const submitQuiz = () => {
    //     clearInterval(timerRef.current);

    //     let score = 0;
    //     const answeredQuestions = questions.map((q, i) => {
    //         const answerObj = answers[i] || {};
    //         const selected = answerObj.selectedAnswer;
    //         const correct = q.correctAnswer;

    //         if (selected === correct) score++;

    //         return {
    //             question: q.question,
    //             options: q.options,
    //             correctAnswer: q.correctAnswer,
    //             selectedAnswer: selected,
    //         };
    //     });

    //     const result = {
    //         topic,
    //         difficulty,
    //         total: questions.length,
    //         score,
    //         totalTimeTaken: elapsedTime,
    //         date: new Date().toLocaleString(),
    //         details: answeredQuestions,
    //     };

    //     setScore(score);
    //     const prev = JSON.parse(localStorage.getItem('quizResults')) || [];
    //     localStorage.setItem('quizResults', JSON.stringify([...prev, result]));
    // };

    const submitQuiz = () => {
        clearInterval(timerRef.current); // Stop timer

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
            isRetake: true,
        };

        setScore(score);

        const storageKey = retake ? 'quizRetakes' : 'quizResults';
        const prev = JSON.parse(localStorage.getItem(storageKey)) || [];
        localStorage.setItem(storageKey, JSON.stringify([...prev, result]));
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

    if (score != null) {
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
                        onClick={() => navigate('/home')}
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
                <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="text-center space-y-1 mb-4">
                <h1 className="text-3xl font-bold text-blue-400">{topic} Quiz</h1>
                <p className="text-sm text-gray-300 mt-2">
                    Difficulty: {difficulty} | Total no of questions: {questions.length}
                </p>
                <p className="text-sm text-green-400 font-mono mt-2">
                    🕒 Elapsed Time: {elapsedTime} seconds
                </p>
                <p className="text-sm text-blue-300 mt-2">
                    Question {currentIndex + 1} of {questions.length}
                </p>
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

