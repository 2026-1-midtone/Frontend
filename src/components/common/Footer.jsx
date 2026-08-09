import './Footer.scss'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__brand">시프트메이트</p>
        <p className="footer__copy">
          © {new Date().getFullYear()} ShiftMate. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
