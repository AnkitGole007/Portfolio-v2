import { ThemeToggle, Navigation, Hero, Skills, Experience, Projects, Contact, Footer, ParallaxBackground } from '@/components'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Global Parallax Background */}
      <ParallaxBackground />

      <ThemeToggle />
      <Navigation />

      <main className="relative z-10">
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App
