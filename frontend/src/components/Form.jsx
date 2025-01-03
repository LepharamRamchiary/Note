import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>{name}</h1>
        <input
          type="text"
          className="form-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="form-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit">
          {name}
        </button>
      </form>
      <div className="form-footer">
        {method === "login" ? (
          <p>
            Don't have an account?{" "}
            <button
              className="form-link"
              onClick={() => navigate("/register")}
            >
              Register here
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              className="form-link"
              onClick={() => navigate("/login")}
            >
              Login here
            </button>
          </p>
        )}
      </div>
    </div>
    
  );
}

export default Form;
