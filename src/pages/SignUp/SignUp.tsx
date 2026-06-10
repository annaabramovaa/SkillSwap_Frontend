import { useState } from "react";
import type { RegisterData } from "src/types/RegisterData";
import styles from "./SignUp.module.scss";
import type { RegisterFormData } from "src/types/RegisterFormData";
import { api } from "src/api/api";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const dataToSend: RegisterData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await api.post("/users/register", dataToSend);

      console.log("SUCCESS:", response.data);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      navigate("/login");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;

      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" className={styles.form__label}>
            Enter your name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Bob"
            />
          </label>

          <label htmlFor="email" className={styles.form__label}>
            Enter your email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="bob123@gmail.com"
            />
          </label>

          <label htmlFor="password" className={styles.form__label}>
            Enter your password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="......"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>

        {error && <p>{error}</p>}
      </div>
    </div>
  );
};
