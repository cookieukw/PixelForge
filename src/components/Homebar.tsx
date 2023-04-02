import styles from "./css/homebar.module.css";

const Homebar = () => {
  return (
    <nav id={styles["homebar"]}>
      <img
        className={styles["logo"]}
        src="/sun.png"
        alt="A forge breathing fire"
      />
            <div id={styles["title_item"]}>
        <span>Pixel Forge</span>
        <span>1.0.0</span>
      </div>
    </nav>
  );
};

export default Homebar;
