const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Panto</h3>
            <p className="text-white/70 leading-relaxed">
              The advantage of hiring a workspace with us is that gives you comfortable service and all-around facilities.
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-semibold mb-4">Benefits</h4>
            <ul className="space-y-3 text-white/70">
              <li>Luxury facilities</li>
              <li>Affordable Price</li>
              <li>Many Choices</li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-3 text-white/70">
              <li>Furniture</li>
              <li>Decoration</li>
              <li>Accessories</li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-3 text-white/70">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/50">
            © {new Date().getFullYear()} Panto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

