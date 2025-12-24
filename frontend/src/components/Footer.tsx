import { Briefcase, Calendar, Github, Linkedin, Twitter } from "lucide-react";
export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-10 px-6">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/*-------- logo + name---*/}
        <div>
          <h3 className="text-2xl flex font-bold text-gray-900">
            {/* <img src={brain2icon} alt="logo" className="h-16 -mt-4" /> */}
            <Calendar className="md:w-8 md:h-8 text-slate-700" />
            <span className="ml-2">Shift Board</span>
          </h3>
          <p className="mt-3 text-md text-gray-600">
            Shift Board is your go-to solution for efficient employee shift
            management. Simplify scheduling, enhance communication, and boost
            productivity all in one platform.
          </p>
        </div>

        {/* ---- links ------- */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2 text-md text-gray-500 ">
            {/* <li>
              <a href="/about" className="hover:text-indigo-500">
                About
              </a>
            </li> */}
            {/* <li>
              <a href="/features" className="hover:text-indigo-500">
                Contact
              </a>
            </li> */}
            {/* <li>
              <a href="/docs" className="hover:text-indigo-500">
                How it works?
              </a>
            </li> */}
          </ul>
          {/* <div className="flex gap-4 mt-6">
            <a
              href="https://github.com/arafatmansuri"
              target="_blank"
              className="text-gray-600 hover:text-indigo-500"
            >
              <Github />
            </a>
            <a
              href="https://x.com/_MohammedArafat"
              target="_blank"
              className="text-gray-600 hover:text-indigo-500"
            >
              <Twitter />
            </a>
            <a
              href="https://www.linkedin.com/in/mohammed-arafat-354924273/"
              target="_blank"
              className="text-gray-600 hover:text-indigo-500"
            >
              <Linkedin />
            </a>
          </div> */}
        </div>

        {/* Support and profile links ---*/}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">
            Social Media Links
          </h4>
          {/* <p className="text-sm text-gray-600 mb-4">
            If you love this project, consider supporting me 💜
          </p>

          <a
            href="/support"
            className="inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            ☕ Support Me
          </a> */}

          <div className="flex gap-4 mt-6">
            <a
              href="https://mohammedarafat.me"
              target="_blank"
              className="text-gray-600 hover:text-indigo-500"
            >
              <Briefcase />
            </a>
            <a
              href="https://github.com/arafatmansuri"
              target="_blank"
              className="text-gray-600 hover:text-indigo-500"
            >
              <Github />
            </a>
            <a
              href="https://x.com/_MohammedArafat"
              target="_blank"
              className="text-gray-600 hover:text-indigo-500"
            >
              <Twitter />
            </a>
            <a
              href="https://www.linkedin.com/in/arafatmansuri/"
              target="_blank"
              className="text-gray-600 hover:text-indigo-500"
            >
              <Linkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Shift Board. Built by <a href="https://mohammedarafat.me" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Mohammed Arafat</a>. All rights reserved.
      </div>
    </footer>
  );
}
