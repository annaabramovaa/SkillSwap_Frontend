import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <div className={styles.header}>
      <h2>SkillSwap</h2>
      <div className={styles.header__left}>
        <NavLink to={"/register"}>
          <button>Sign Up</button>
        </NavLink>
        <NavLink to={"/login"}>
          <button>Sign In</button>
        </NavLink>
      </div>
    </div>
  );
};
