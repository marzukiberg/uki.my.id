import React from 'react';
import { Helmet } from 'react-helmet';

const Header = () => {
  return (
    <Helmet>
      <title>Marzuki | Frontend Engineer</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Poppins&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/vendor/css/fa-all-min.css" />
      <script src="/vendor/js/fa-all.min.js"></script>
    </Helmet>
  );
};

export default Header;
