import { Header } from "../../components/Header/Header";
import styles from "./HomePage.module.scss";

export const HomePage = () => {
  return (
    <div>
      <Header />
      <div className={styles.wrapper}>
        <h1>About Page</h1>
      </div>
    </div>
  );
};
