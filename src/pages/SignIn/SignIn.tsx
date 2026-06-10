import { useState } from "react";
import type { LoginData } from "src/types/LoginData";
import styles from "src/pages/SignIn/SignIn.module.scss";
import { useNavigate } from "react-router-dom";
import { authApi } from "src/api/auth.api";
import { mapError } from "src/api/error";

export const SignIn = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authApi.login(loginData.email, loginData.password);

      navigate("/userhome");
    } catch (err: unknown) {
      const error = mapError(err);
      setError(error.message);
    }
  };
  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="email" className={styles.form__label}>
          Enter your email
          <input
            type="email"
            name="email"
            placeholder="bob123@gmail.com"
            value={loginData.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password" className={styles.form__label}>
          Enter your password
          <input
            type="password"
            name="password"
            placeholder="......"
            value={loginData.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};
