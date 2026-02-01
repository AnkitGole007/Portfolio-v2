import { ThemeToggle, Navigation, Hero, Skills, Projects, Contact, Footer } from '@/components'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <Navigation />

      <main>
        <Hero />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App
