import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/project_item.module.css";
import { MdMoreVert } from "react-icons/md";

type ProjectItemProps = {
  id: string;
  title: string;
  date: string;
  image?: string;
};

const ProjectItem: React.FC<ProjectItemProps> = ({
  id,
  title,
  date,
  image,
}) => {
  const nav = useNavigate();
  return (
    <li className={styles["project_base"]}>
      <img
        className={styles["project_image"]}
        src={image ? image : "/sun.png"}
        alt={title}
      />
      <div style={{ width: "100%", height: "min-content" }}>
        <h3 className={styles["project_title"]}>{title}</h3>
        <p className={styles["project_date"]}>{date}</p>
      </div>
      <MdMoreVert size={50} />
    </li>
  );
};

export default ProjectItem;
