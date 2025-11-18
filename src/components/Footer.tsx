const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Masco Salma Print</h3>
            <p className="text-white/70 leading-relaxed">
              Your trusted partner for custom printing and promotional products. Quality printing services with fast turnaround times.
            </p>
          </div>

          {/* Benefits */}
          <div>
            <h4 className="font-semibold mb-4">Why Choose Us</h4>
            <ul className="space-y-3 text-white/70">
              <li>Fast Turnaround</li>
              <li>Custom Design Support</li>
              <li>Quality Guarantee</li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-3 text-white/70">
              <li>Custom T-Shirts</li>
              <li>Mugs & Drinkware</li>
              <li>Business Cards</li>
              <li>Promotional Items</li>
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
            © {new Date().getFullYear()} Masco Salma Print. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

