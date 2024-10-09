import React, { useState } from "react";
import PropTypes from "prop-types";

import Hello from "../../components/Hello/Hello";

const Layout = ({ children }) => {
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.object.isRequired,
};

export default Layout;
