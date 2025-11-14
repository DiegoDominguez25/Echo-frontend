import React from "react";
import logo from "@/assets/images/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 w-full">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Echo - English Practice"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="mt-4 text-gray-600 text-sm">
              <span className="font-bold">Echo</span> is a web-based platform
              that aims to improve English pronunciation by giving AI-generated
              feedback.
            </p>
          </div>

          <div className="justify-self-end">
            <h3 className="font-semibold text-blue-600">Help</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:underline">
                  Tutorial
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:underline">
                  Attributions
                </a>
              </li>
            </ul>
          </div>

          <div className="justify-self-center">
            <h3 className="font-semibold text-blue-600">Support</h3>
            <div className="mt-4 text-sm text-gray-600">
              <p>Contact us at</p>
              <a
                href="mailto:lostresmodulos@gmail.com"
                className="hover:underline"
              >
                lostresmodulos@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
