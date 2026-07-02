import { useTheme } from "./portfolio/hooks";
import { Nav } from "./portfolio/Nav";
import { Hero } from "./portfolio/Hero";
import { About } from "./portfolio/About";
import { Skills } from "./portfolio/Skills";
import { Projects } from "./portfolio/Projects";
import { Experience } from "./portfolio/Experience";
import { Contact } from "./portfolio/Contact";
import { Footer } from "./portfolio/Footer";

export default function Portfolio() {
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
}
