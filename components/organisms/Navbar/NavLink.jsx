import React from "react";
import PropTypes from "prop-types";
import styles from "./NavLink.module.css";

const NavLink = ({ title, link, onClick }) => {
  return (
    <a
      onClick={onClick}
      href={link}
      className={`font-qs relative block px-6 py-3 text-gray-600 transition-colors hover:text-blue-500 md:inline-block md:px-0 md:py-1 ${styles["navlink"]}`}
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
