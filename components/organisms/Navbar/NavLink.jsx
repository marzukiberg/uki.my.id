import React from "react";
import PropTypes from "prop-types";
import styles from "./NavLink.module.css";

const NavLink = ({ title, link, onClick }) => {
  return (
    <a
      onClick={onClick}
      href={link}
      className={`font-qs relative block px-6 py-3 text-black text-opacity-80 hover:bg-blue-400 hover:bg-opacity-50 md:inline-block md:p-0 md:hover:bg-transparent ${styles["navlink"]}`}
    >
      {title}
      <div className={`${styles["navlink-underline"]} hidden md:block`}></div>
    </a>
  );
};

NavLink.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
};

export default NavLink;
