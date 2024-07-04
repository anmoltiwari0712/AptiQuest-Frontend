import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { baseUrl } from "../url";


const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const handleInput = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        navigate("/resetPassword", { state: { email } });
      } else {
        setError("Invalid OTP! Please try again.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#191919" : "#fff",
      }}
    >
      <div
        style={{
          ...styles.formContainer,
          backgroundColor: darkMode ? "#222222" : "#fff",
        }}
      >
        <h1 style={{ ...styles.welcome, color: darkMode ? "#ccc" : "#000" }}>
          Verify OTP
        </h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label
              htmlFor="otp"
              style={{ ...styles.label, color: darkMode ? "#ccc" : "#000" }}
            >
              OTP
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleInput}
              placeholder="Enter your OTP"
              style={styles.input}
            />
          </div>
          {error && (
            <div
              style={{
                ...styles.error,
                color: darkMode ? "#ff6b6b" : "#ff0000",
              }}
            >
              {error}
            </div>
          )}
          <button type="submit" style={styles.button}>
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "0 20px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  welcome: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    marginBottom: "5px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  error: {
    marginBottom: "20px",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#ee4b2b",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default VerifyOTP;
