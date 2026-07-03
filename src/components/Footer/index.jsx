import React from "react";
export default function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-white text-center">
      <div className="container">
        <span className="text-muted">
          Copyright © <span id="year" />{" "}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-dark fw-semibold">
            PCUBE SOFTECHS
          </a>
          . Designed with <span className="bi bi-heart-fill text-danger" /> by{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            <span className="fw-semibold text-primary text-decoration-underline">
              PCUBE SOFTECHS
            </span>
          </a>{" "}
          All rights reserved
        </span>
      </div>
    </footer>
  );
}
