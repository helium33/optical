import { useState } from "react";
import useSWR from "swr";
import { toast, Toaster } from "react-hot-toast";
import PageLoader from "../../../Component/PageLoader";

const fetcher = (url) => fetch(url).then((res) => res.json());

const QuizComponent = () => {
  const { data: quizData, error, isLoading } = useSWR("http://localhost:3001/Quiz", fetcher);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 questions

  if (isLoading) return <p className="text-center">{<PageLoader />  }   </p>;
  if (error) return <p className="text-center text-red-500">Error loading quiz.</p>;

  const handleSelect = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = (questionId, correctAnswer) => {
    if (!answers[questionId]) {
      toast.warning("⚠️ ကျေးဇူးပြု၍ အဖြေရွေးပါ!");
      return;
    }
    if (answers[questionId] === correctAnswer) {
      toast.success("✔ မှန်ပါတယ်!");
    } else {
      toast.error("❌ မှားသွားပါတယ်!");
    }
    setSubmitted({ ...submitted, [questionId]: true });
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-100 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold text-center mb-6">👁️ မျက်စိ ကျန်းမာရေး Quiz</h2>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {quizData.slice(0, visibleCount).map((q) => (
          <div key={q.id} className="bg-white p-4 shadow-md rounded-lg w-full flex flex-col">
            <h3 className="font-semibold">{q.question}</h3>
            <div className="mt-3 flex-grow">
              {q.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={option}
                    onChange={() => handleSelect(q.id, option)}
                    disabled={submitted[q.id]} // Disable if submitted
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleSubmit(q.id, q.answer)}
              disabled={submitted[q.id]} // Disable if already submitted
              className={`mt-3 px-4 py-2 w-full rounded ${
                submitted[q.id] ? "bg-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              style={{ height: "40px" }} // Set a fixed height for the button
            >
              {submitted[q.id] ? "✔ ဖြေဆိုပြီးပါပြီ" : "✔ Submit"}
            </button>
          </div>
        ))}
      </div>

      {/* See More Button */}
      {visibleCount < quizData.length && (
        <button
          onClick={() => setVisibleCount(quizData.length)}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 block mx-auto"
        >
          + See More
        </button>
      )}
      <Toaster />
    </div>
  );
};

export default QuizComponent;