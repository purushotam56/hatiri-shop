"use client";

import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-divider mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-bold text-xl text-primary mb-4">🛍️ Hatiri</div>
            <p className="text-foreground/60 text-sm">
              Your trusted marketplace for sellers and shoppers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/products"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/blog"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/docs"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/faq"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-foreground/60 hover:text-foreground"
                  href="/terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
          <p>&copy; 2025 Hatiri. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Follow us on:</span>
            <Link className="text-foreground/60 hover:text-foreground" href="#">
              Twitter
            </Link>
            <Link className="text-foreground/60 hover:text-foreground" href="#">
              Facebook
            </Link>
            <Link className="text-foreground/60 hover:text-foreground" href="#">
              Instagram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
