import { NavLink, useNavigate } from "react-router-dom";
import styles from "src/pages/UserHomePage/UserHomePage.module.scss";
import { api } from "src/api/api";
import { useEffect, useState } from "react";
import type { Skill } from "src/types/SKill";
import { mapError } from "src/api/error";

export const UserHomePage = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState("");

  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState<Skill[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (!query.trim()) {
          setSuggestion([]);

          return;
        }

        const response = await api.get("/skills/search", {
          params: { query },
        });

        setSuggestion(response.data);
      } catch (err: unknown) {
        const error = mapError(err);
        setError(error.message);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleLogout = () => {
    localStorage.removeItem("token");

    delete api.defaults.headers.common.Authorization;

    navigate("/");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location.trim()) {
      params.append("location", location);
    }

    if (gender.trim()) {
      params.append("gender", gender);
    }

    if (hobbies.trim()) {
      params.append("hobbies", hobbies);
    }

    if (query.trim()) {
      params.append("skill", query);
    }

    navigate(`/matches?${params.toString()}`);
  };

  return (
    <>
      <div className={styles.header}>
        <h2>SkillSwap</h2>

        <div className={styles.header__left}>
          <NavLink to="/profile">
            <button>Profile</button>
          </NavLink>

          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>

      <div className={styles.search__wrapper}>
        <input
          type="text"
          placeholder="Search skill..."
          className={styles.search__input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Any gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Hobbies (AI, fitness, games)"
          value={hobbies}
          onChange={(e) => setHobbies(e.target.value)}
        />

        <button type="button" onClick={handleSearch}>
          Search
        </button>

        {query.trim() !== "" && suggestion.length > 0 && (
          <ul className={styles.search__suggestions}>
            {suggestion.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  setQuery(option.name);
                  setSuggestion([]);
                }}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p>{error}</p>}
    </>
  );
};
