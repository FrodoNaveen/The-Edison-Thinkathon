import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function QuizSummaryPage() {
    const [quizResults, setQuizResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [filterTopic, setFilterTopic] = useState("All");
    const [filterDifficulty, setFilterDifficulty] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");

    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("quizResults")) || [];
        setQuizResults(stored.reverse());
    }, []);

    useEffect(() => {
        let filtered = [...quizResults];

        if (filterTopic !== "All") {
            filtered = filtered.filter((r) => r.topic === filterTopic);
        }

        if (filterDifficulty !== "All") {
            filtered = filtered.filter((r) => r.difficulty === filterDifficulty);
        }

        if (sortBy === "Score") {
            filtered.sort((a, b) => b.score - a.score);
        } else if (sortBy === "Oldest") {
            filtered.reverse();
        }

        setFilteredResults(filtered);
    }, [quizResults, filterTopic, filterDifficulty, sortBy]);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const allTopics = ["All", ...new Set(quizResults.map((r) => r.topic))];
    const allDifficulties = ["All", ...new Set(quizResults.map((r) => r.difficulty))];

    return (
        <div className="w-screen min-h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
                📊 Quiz Summary
            </h1>

            {/* Legend */}
            <div className="mb-4 bg-zinc-800 border border-zinc-700 p-4 rounded-lg text-sm max-w-3xl mx-auto">
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded bg-green-700 border border-green-400" />
                        <span>✅ Correct Answer</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded bg-red-800 border border-red-400" />
                        <span>❌ Wrong Answer</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
                <select
                    value={filterTopic}
                    onChange={(e) => setFilterTopic(e.target.value)}
                    className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-sm"
                >
                    {allTopics.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-sm"
                >
                    {allDifficulties.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-sm"
                >
                    <option value="Newest">Newest</option>
                    <option value="Oldest">Oldest</option>
                    <option value="Score">Top Score</option>
                </select>
            </div>

            {filteredResults.length === 0 ? (
                <p className="text-center text-gray-400">No quiz results found.</p>
            ) : (
                filteredResults.map((result, index) => (
                    <div
                        key={index}
                        className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6 shadow-md"
                    >
                        {/* Top section: topic/date and score/time */}
                        <div className="flex flex-col md:flex-row md:justify-between gap-2">
                            {/* Left: topic and date */}
                            <div>
                                <h2 className="text-xl font-bold text-blue-300">
                                    {result.topic} ({result.difficulty}) {result.isRetake ? <span className="text-yellow-400">(Retaken)</span> : null}
                                </h2>

                                <p className="text-sm text-gray-400 mt-1">
                                    📅 {result.date}
                                </p>
                            </div>

                            {/* Right: score and time */}
                            <div className="md:text-right">
                                <p className="text-lg">
                                    📝 Score:{" "}
                                    <span className="text-green-400 font-semibold">
                                        {result.score}/{result.total}
                                    </span>
                                </p>
                                <p className="text-sm text-yellow-300">
                                    ⏱ Total Time: {result.totalTime || result.totalTimeTaken || 0}s
                                </p>
                            </div>
                        </div>

                        {/* Buttons section */}
                        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
                            <button
                                onClick={() => toggleExpand(index)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-black rounded text-sm font-bold w-full sm:w-auto"
                            >
                                {expandedIndex === index ? "Hide Details" : "View Details"}
                            </button>
                            <button
                                onClick={() =>
                                    navigate("/retake", {
                                        state: {
                                            questions: result.details,
                                            topic: result.topic,
                                            difficulty: result.difficulty,
                                        },
                                    })
                                }
                                className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-black rounded text-sm font-bold w-full sm:w-auto"
                            >
                                Retake
                            </button>

                        </div>

                        {/* Details section */}
                        {expandedIndex === index && result.details && (
                            <div className="mt-6 space-y-6">
                                {result.details.map((q, i) => {
                                    const correctIndex = ["A", "B", "C", "D"].indexOf(
                                        q.correctAnswer?.charAt(0)
                                    );
                                    const selectedIndex = ["A", "B", "C", "D"].indexOf(
                                        q.selectedAnswer?.charAt(0)
                                    );

                                    return (
                                        <div
                                            key={i}
                                            className="p-4 bg-zinc-900 rounded border border-zinc-700"
                                        >
                                            <p className="text-md font-semibold mb-3">
                                                {i + 1}. {q.question}
                                            </p>

                                            {q.options.map((option, idx) => {
                                                const isCorrect = correctIndex === idx;
                                                const isSelected = selectedIndex === idx;

                                                let style = "bg-zinc-800";
                                                if (isCorrect && isSelected) {
                                                    style = "bg-green-700 border-green-400";
                                                } else if (isCorrect) {
                                                    style = "bg-green-800 border-green-400";
                                                } else if (isSelected) {
                                                    style = "bg-red-800 border-red-400";
                                                }

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`p-2 rounded border mb-2 ${style}`}
                                                    >
                                                        {option}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
