import { Building2, Twitter, Linkedin, Github, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1E293B] border-t border-[#0B67FF]/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={32} className="text-[#0B67FF]" />
              <span className="text-xl">ComplianceAI</span>
            </div>
            <p className="text-[#6B7280] mb-4">
              AI-powered architectural compliance platform for modern architecture professionals.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-[#6B7280] hover:text-[#0B67FF] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[#6B7280] hover:text-[#0B67FF] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-[#6B7280] hover:text-[#0B67FF] transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-[#6B7280] hover:text-[#0B67FF] transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Features</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Pricing</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">API</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">About Us</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Careers</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Blog</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Documentation</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Support</a></li>
              <li><a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">Community</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#0B67FF]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6B7280]">
            <small>&copy; 2025 ComplianceAI. All rights reserved.</small>
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
              <small>Privacy Policy</small>
            </a>
            <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
              <small>Terms of Service</small>
            </a>
            <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
              <small>Cookie Policy</small>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
