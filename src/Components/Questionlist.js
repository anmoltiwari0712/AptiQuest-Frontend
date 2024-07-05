import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Question from "./Question";
import axios from "axios";
import topics from "../config/configuration";
import "./Questionlist.css";
import { useTheme } from "../ThemeContext";
import { Collapse } from "react-bootstrap";
import { useAuth } from "../store/auth";
import { hover } from "@testing-library/user-event/dist/hover";
import { baseUrl } from "../url";


const QuestionList = () => {
  const { path } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState({});
  const [progress, setProgress] = useState({});
  const { darkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${baseUrl}/questions/${path}`);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [path]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when path changes

    const fetchCompletedQuestions = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await axios.get(
          `${baseUrl}/user/completed-questions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompletedQuestions(response.data.completedQuestions);
      } catch (error) {
        console.error("Error fetching completed questions:", error);
      }
    };

    const fetchProgress = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await axios.get(`${baseUrl}/user/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProgress((prevProgress) => ({
          ...prevProgress,
          [path]: response.data.progress[path] || 0,
        }));
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchCompletedQuestions();
    fetchProgress();
  }, [isLoggedIn, token, path]);

  const handleCheckboxChange = async (checked, questionId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setSolvedCount(solvedCount + (checked ? 1 : -1));
    try {
      await axios.post(
        `${baseUrl}/markquestion`,
        { questionId, topic: path },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompletedQuestions((prev) => {
        const updated = { ...prev };
        if (!updated[path]) {
          updated[path] = [];
        }
        if (checked) {
          updated[path].push(questionId);
        } else {
          updated[path] = updated[path].filter((id) => id !== questionId);
        }
        return updated;
      });

      setProgress((prev) => {
        const updated = { ...prev };
        if (checked) {
          updated[path] = (updated[path] || 0) + 1;
        } else {
          updated[path] = (updated[path] || 1) - 1;
        }
        return updated;
      });
    } catch (error) {
      console.log(error);
    }
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const currentTopic = topics.find((topic) => topic.path === `/${path}`);

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#191919" : "#fff",
        minHeight: "100vh",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}
    >
      <div style={styles.container}>
        {currentTopic && (
          <div
            style={{
              ...styles.card,
              backgroundColor: darkMode ? "#303030" : "#fff",
            }}
          >
            <h2 style={{ color: darkMode ? "#ff0000" : "#000" }}>
              {currentTopic.title}
            </h2>
            <p
              className="topic-description"
              style={{ color: darkMode ? "#ccc" : "#000" }}
            >
              Prepare for {currentTopic.title} with our comprehensive resources
              and practice questions. Our materials include a dedicated formulas section and well-established explanations for each question, ensuring you grasp the concepts thoroughly and excel in solving them. Additionally, we offer step-by-step guides and tips to enhance your problem-solving skills, making even the most complex problems easy to understand.
            </p>
            <Collapse in={isExpanded}>
              <ol
                style={{
                  color: darkMode ? "#ccc" : "#000",
                  paddingLeft: "20px",
                  marginBottom: "50px",
                }}
              >
                {currentTopic.formulas.map((formula, index) => (
                  <li
                    className="topic-description"
                    key={index}
                    style={{ marginBottom: "10px" }}
                  >
                    {formula}
                  </li>
                ))}
              </ol>
            </Collapse>
            <button style={styles.expandButton} onClick={toggleExpand}>
              {isExpanded ? "Show Formulas" : "Show Formulas"}
            </button>
          </div>
        )}
        <div style={styles.topicWrapper}>
          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${((progress[path] || 0) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <div
            style={{
              ...styles.progressText,
              color: darkMode ? "#ccc" : "#333",
            }}
          >
            {progress[path] || 0}/{questions.length} questions solved
          </div>
        </div>
        {questions.map((question, index) => (
          <Question
            key={index}
            question={question}
            index={index}
            onCheckboxChange={handleCheckboxChange}
            checked={completedQuestions[path]?.includes(question._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionList;

const styles = {
  container: {
    width: "80%",
    margin: "20px auto",
  },

  card: {
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  topicWrapper: {
    marginBottom: "10px",
  },
  expandButton: {
    background: "linear-gradient(to top right, #e3342f, #ef5753)",
    border: "1px solid #cc1f1a",
    borderRadius: "0.375rem",
    padding: "0.625rem 1rem",
    margin: "0.25rem",
    cursor: "pointer",
    color: "white",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, border-color 0.3s",
  },

  progressBarContainer: {
    width: "100%",
    backgroundColor: "#5a5a59",
    height: "10px",
    borderRadius: "5px",
    marginBottom: "5px",
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "10px",
    backgroundColor: "#ee4b2b",
    borderRadius: "5px 0 0 5px",
  },
  progressText: {
    marginRight: "10px",
    fontSize: "0.8rem",
    color: "#333",
    textAlign: "center",
  },
};
