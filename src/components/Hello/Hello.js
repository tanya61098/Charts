import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import styles from "./Hello.module.css"; // Import your CSS module

const Hello = () => {
  return (
    <Navbar bg="light" data-bs-theme="light" className={styles.Navbar}>
      <Container>
        <Navbar.Brand href="#home" className={styles.NavbarBrand}>
          React Charts
        </Navbar.Brand>
        <Nav className="me-auto">
          <ul>
            <li>
              <NavLink to="/charts" className={styles.SideMenuItemLink}>
                Charts
              </NavLink>
            </li>
            <li>
              <NavLink to="/pivotTable" className={styles.SideMenuItemLink}>
                Pivot
              </NavLink>
            </li>
          </ul>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Hello;
