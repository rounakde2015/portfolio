"use client";

import { About } from "./About";
import { Contact } from "./Contact";
import { Experience } from "./Experience";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Nav } from "./Nav";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { useTheme } from "./hooks";

export const Portfolio = () => {
  const { theme, toggle } = useTheme();
  return (
    <main data-testid="portfolio-root" data-theme={theme}>
      <Nav theme={theme} toggleTheme={toggle} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
};
