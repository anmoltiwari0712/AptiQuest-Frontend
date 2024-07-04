import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import topics from "../config/configuration";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../store/auth"; // Import useAuth for authentication
import { baseUrl } from "../url";

import TruckLoader from "./truckloader"; 

const Home = () => {
  const [topicsWithQuestions, setTopicsWithQuestions] = useState([]);
  const { darkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchTopicData = async () => {
      try {
        const promises = topics.map(async (topic) => {
          const response = await axios.get(
            `${baseUrl}/questions${topic.path}`
          );
          const totalQuestions = response.data.length;
          return {
            ...topic,
            totalQuestions,
            solved: 0, // Initialize solved count
          };
        });

        const updatedTopics = await Promise.all(promises);
        setTopicsWithQuestions(updatedTopics);
      } catch (error) {
        console.error("Error fetching topic data:", error);
      }
      finally { 
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchTopicData();
  }, []);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!isLoggedIn) return;

      try {
        const response = await axios.get(
          `${baseUrl}/user/progress`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const progressData = response.data.progress;

        setTopicsWithQuestions((prevTopics) =>
          prevTopics.map((topic) => ({
            ...topic,
            solved: progressData[topic.path.slice(1)] || 0, // Update solved count from progress data
          }))
        );
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressData();
  }, [isLoggedIn, token]);

  return (
    <div
      style={{
        backgroundColor: darkMode ? "#191919" : "#fff",
        minHeight: "100vh",
        paddingTop: "32px",
        paddingBottom: "32px",
      }}
    >
      <TruckLoader loading={loading} />   
      <div style={styles.container}>
        <div
          style={{
            ...styles.card,
            backgroundColor: darkMode ? "#303030" : "#fff",
          }}
        >
          <h2 style={{ ...styles.heading, color: darkMode ? "#fff" : "#000" }}>
            <span>Welcome to </span>
            <span style={styles.apti}>Apti</span>
            <span
              style={{ ...styles.quest, color: darkMode ? "#fff" : "#000" }}
            >
              Quest
            </span>
          </h2>
          <p style={{ color: darkMode ? "#ccc" : "#000" }}>
            AptiQuest: Where brainpower meets playtime! Dive into a world of
            mind-bending quizzes and puzzles that turbocharge your logical
            reasoning, number crunching, and problem-solving skills. Whether
            you're gearing up for exams or just love flexing your mental
            muscles, AptiQuest serves up a buffet of brain-teasing challenges.
            From math mavens to word wizards, everyone finds their niche in our
            quirky quiz universe. Join a vibrant community of fellow thinkers,
            track your progress, and conquer each quiz to level up your
            cognitive game. Get ready to think outside the box and explore new
            frontiers of smarts with AptiQuest!
          </p>
        </div>
        <div style={styles.topicList}>
          {topicsWithQuestions.map((topic, index) => (
            <div key={index} style={styles.topicWrapper}>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${(topic.solved / topic.totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
              <Link
                to={`/questions${topic.path}`}
                style={{
                  ...styles.topicCard,
                  backgroundColor: darkMode ? "#303030" : "#f9f9f9",
                  color: darkMode ? "#fff" : "#333",
                }}
              >
                {topic.title}
                <span style={styles.arrowContainer}>
                  <span
                    style={{
                      ...styles.CountCard,
                      backgroundColor: darkMode ? "#434343" : "#fff",
                      color: darkMode ? "#fff" : "#333",
                    }}
                  >
                    {topic.solved}/{topic.totalQuestions}
                  </span>
                  <span style={styles.arrow}>&rarr;</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

const styles = {
  container: {
    padding: "20px", // Add consistent padding to your container
    width: "80%",
    margin: "20px auto",
  },

  apti: {
    color: "#ff0000",
    fontFamily: "'Playwrite NG Modern', sans-serif", // Color for "Apti"
  },
  quest: {
    color: "#fff",
    //   fontFamily: "'Playwrite NG Modern', sans-serif", // Color for "Quest"
  },
  card: {
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  topicList: {
    display: "flex",
    flexDirection: "column",
  },
  topicWrapper: {
    marginBottom: "10px",
  },
  topicCard: {
    padding: "15px 20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    color: "#333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textDecoration: "none", // Ensure links look like buttons
  },
  progressBarContainer: {
    width: "100%",
    backgroundColor: "#5a5a59",
    height: "8px",
    borderRadius: "5px",
    marginBottom: "5px",
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "8px",
    backgroundColor: "#ee4b2b",
    borderRadius: "5px 0 0 5px",
  },
  arrowContainer: {
    display: "flex",
    alignItems: "center",
  },
  progressText: {
    marginRight: "10px",
    fontSize: "0.8rem",
    color: "#333",
  },
  arrow: {
    fontSize: "1.5rem",
  },
  CountCard: {
    width: "50px",
    padding: "4px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f3f3f3",
    color: "#333",
    marginRight: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textDecoration: "none", // Ensure links look like buttons
  },
};
