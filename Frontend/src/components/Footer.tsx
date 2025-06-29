const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>
        &copy; {year} UbakaFix. All rights reserved. |{' '}
        <a href="mailto:support@ubakahub.rw">Contact Support</a>
      </p>
    </footer>
  );
};

export default Footer;
