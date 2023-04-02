import React, { ReactNode } from "react";
import { IconType } from "react-icons";
import styles from "./css/option_item.module.css";
import { useNavigate } from "react-router-dom";

interface OptionItemProps {
  icon: IconType;
  title: string;
  link?: string;
}

const OptionItem: React.FC<OptionItemProps> = ({ icon: Icon, title, link }) => {
  const navigate = useNavigate();

  return (
    <li
      className={`${styles["item"]} .mdc-ripple-surface--primary`}
      
      onClick={() => navigate(link ? link : "#")}
    >
      <Icon size={25} color="#b2ebf2" />
      <p>{title}</p>
    </li>
  );
};

export default OptionItem;
