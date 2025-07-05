

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');

    const [lastScore, setlastScore] = useState(0)
    const [totalQuizattended, setTotalQuizAttended] = useState(0)
    const [averageScore, setAverageScore] = useState(0)
    const [lastquizTotalQuestions, setLastQuizTotalQuestion] = useState(0)

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.fullName) {
            setUserName(storedUser.fullName);
        }
        const results = JSON.parse(localStorage.getItem('quizResults')) || [];

        if (results.length > 0) {
            let totalScore = 0;
            let totalQuestions = 0;
            results.forEach(result => {
                totalScore += result.score;
                totalQuestions += result.total;
            });
            const averagePercentage = totalQuestions > 0
                ? Math.round((totalScore / totalQuestions) * 100)
                : 0;
            setAverageScore(averagePercentage)

            console.log("Average Score Percentage:", averagePercentage + "%");

            // const lastScore = JSON.parse(localStorage.getItem('lastScore')) ?? 0;
            // const totalQuiz = JSON.parse(localStorage.getItem('totalquizattended')) ?? 0;
            // const averageScore = JSON.parse(localStorage.getItem('averagescore')) ?? 0;
            // const lastquizTotalQuestions = JSON.parse(localStorage.getItem('lastquiztotalquestion')) ?? 0;

            setlastScore(results[results.length - 1].score)
            setTotalQuizAttended(results.length)
            // setAverageScore(averageScore)
            setLastQuizTotalQuestion(results[results.length - 1].total)
        }

    }, []);

    const handleLogout = () => {
        localStorage.setItem('isLoggedIn', false);
        navigate('/login');
    };

    const handleStartQuiz = () => {
        if (topic != "" && questionCount != "" && questionCount >= 5 && questionCount <= 20) {
            const userData = {
                topic: topic,
                questionCount: questionCount,
                difficulty: difficulty,
            };
            console.log({ topic, questionCount, difficulty });
            navigate('/quiz', { state: userData });
        } else {
            setTopic("")
            setQuestionCount("")
            alert("Fill the inputs correctly to start quiz")
        }
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white">
            <div className="w-full h-full p-6 flex flex-col space-y-6 overflow-y-auto">

                {/* Header/Profile */}
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src="https://api.dicebear.com/7.x/thumbs/svg?seed=User"
                            alt="Profile"
                            className="w-16 h-16 rounded-full border-2 border-blue-500"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-blue-400">Welcome, {userName}</h1>
                            <p className="text-sm text-gray-400">Welcome to the Ultimate Quiz Challenge! Test your knowledge, beat the clock, and climb the leaderboard.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 w-full sm:w-auto px-4 mt-4 py-2 rounded-md text-sm font-medium text-black transition duration-300"
                    >
                        Logout
                    </button>
                </div>

                {/* Quiz Summary / Mini Statement */}
                {/* Quiz Summary / Mini Statement */}
                <div className="bg-black bg-opacity-30 border border-blue-700 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                        <h2 className="text-lg font-semibold text-blue-300">
                            📊 Your Quiz Summary
                        </h2>

                        {/* Responsive Buttons Container */}
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            <button
                                onClick={() => navigate('/summary')}
                                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium text-black transition duration-300"
                            >
                                View Full Summary
                            </button>


                        </div>
                    </div>

                    <ul className="text-sm text-gray-300 list-disc list-inside">
                        <li>Last Score: {lastScore}/{lastquizTotalQuestions}</li>
                        <li>Total Quizzes Taken: {totalQuizattended}</li>
                        <li>Average Score: {averageScore}%</li>
                    </ul>
                </div>


                {/* Quiz Setup Section */}
                <div>
                    <h2 className="text-xl font-bold text-blue-400 mb-4">📝 Create a Quiz</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Topic (e.g., JavaScript)"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 border border-blue-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="number"
                            placeholder="Number of Questions (5-20)"
                            value={questionCount}
                            onChange={(e) => setQuestionCount(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 border border-blue-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="p-3 rounded-lg bg-zinc-800 border border-blue-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* <button
                        onClick={handleStartQuiz}
                        className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold text-black transition"
                    >
                        Start Quiz
                    </button> */}

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleStartQuiz}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 py-3 px-6 rounded-lg font-semibold text-black transition"
                        >
                            Start Quiz
                        </button>
                    </div>

                </div>

                {/* Instructions */}
                <div className="bg-zinc-900 bg-opacity-70 p-4 rounded-lg border border-blue-700 text-sm text-gray-300 space-y-2">
                    <h3 className="text-blue-300 font-semibold">📌 Instructions</h3>
                    <ul className="list-disc list-inside">
                        <li>Read the questions carefully before answering.</li>
                        <li>Choose your Quiz Type based on your interest.</li>
                        <li>Select your preferred Difficulty Level – Easy, Medium, or Hard.</li>
                        <li>Pick the correct answer from the 4 options provided.</li>
                        <li>You will get one attempt per question.</li>
                        <li>Each question is timed, so think fast!</li>
                        <li>Your final score will be displayed at the end.</li>
                        <li>Don’t refresh during the quiz to avoid losing progress.</li>
                        <li>Ready to challenge yourself? Click Start to begin!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
