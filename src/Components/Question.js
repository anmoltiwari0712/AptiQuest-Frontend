import React, { useState } from "react";
import { Card, Button, Collapse } from "react-bootstrap";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../store/auth"; // Import useAuth
import { useNavigate } from "react-router-dom";
import "./Question.css";

const Question = ({ question, index, onCheckboxChange, checked }) => {
  const { darkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const optionsObject = question.options[0];
  const optionLabels = Object.keys(optionsObject);
  const optionValues = Object.values(optionsObject);

  const handleCheckboxChange = (event) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setIsChecked(event.target.checked);
    onCheckboxChange(event.target.checked, question._id);
  };

  const getOptionLabel = (idx) => {
    return String.fromCharCode(65 + idx); // 65 is ASCII code for 'A'
  };
  const renderExplanation = (explanation) => {
    const parts = explanation.split("\n\n");
    return parts.map((part, index) => (
      <p key={index} style={{ marginBottom: "10px" }}>
        {part}
      </p>
    ));
  };

  return (
    <Card
      className={`mb-3 ${darkMode ? "text-light" : ""}`}
      style={darkMode ? { backgroundColor: "#303030", color: "#ffffff" } : {}}
    >
      <Card.Header
        className={`d-flex justify-content-between align-items-center ${
          darkMode ? "text-light" : ""
        }`}
        style={darkMode ? { backgroundColor: "#474747" } : {}}
      >
        <div className="text-div">
          <span className="topic-description">
            {index + 1}. <strong>{question.question}</strong>
          </span>
        </div>

        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
          />
          <svg viewBox="0 0 35.6 35.6">
            <circle
              className="background"
              cx="17.8"
              cy="17.8"
              r="17.8"
            ></circle>
            <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
            <polyline
              className="check"
              points="11.78 18.12 15.55 22.23 25.17 12.87"
            ></polyline>
          </svg>
        </div>
      </Card.Header>
      <Card.Body>
        <ul className="list-unstyled">
          {optionLabels.map((label, idx) => (
            <li key={idx}>
              <strong>{label}</strong> {optionsObject[label]}
            </li>
          ))}
        </ul>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls={`answer${index}`}
          aria-expanded={open}
          className="mt-3"
          style={{
            backgroundColor: "#ee4b2b",
            borderColor: "#ee4b2b",
            color: "#ffffff",
          }}
        >
          Show Answer
        </Button>
        <Collapse in={open}>
          <div id={`answer${index}`} className="mt-3 topic-description">
            <strong>Answer:</strong> {question.correct_answer}
            <br />
            <strong>Explanation:</strong>{" "}
            {renderExplanation(question.explanation)}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default Question;
