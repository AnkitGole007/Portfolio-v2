# Ankit Gole - AI Developer Portfolio

A modern, immersive portfolio website built with Next.js 14, featuring 3D neural network visualizations, Apple-inspired liquid glass UI, and an intelligent chatbot.

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **3D Graphics**: React Three Fiber + Three.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Features

- Interactive 3D neural network background
- Apple-style liquid glass UI design
- Floating navigation shortcuts
- Smooth page transitions
- AI-powered chat assistant
- Fully responsive design
- Static export for GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npx serve out
```

## Deployment to GitHub Pages

### Automatic Deployment (GitHub Actions)

1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Set Source to "GitHub Actions"
4. The workflow will automatically build and deploy on push to `main`

### Manual Deployment

```bash
# Build the project
npm run build

# The static files will be in the 'out' directory
# Deploy the contents of 'out' to your hosting provider
```

## Project Structure

```
src/
├── app/
│   ├── about/          # About page
│   ├── achievements/   # Achievements page
│   ├── api/chat/       # Chat API route
│   ├── contact/        # Contact page
│   ├── experience/     # Experience page
│   ├── projects/       # Projects page
│   ├── skills/         # Skills page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   ├── FloatingShortcuts.tsx    # Home page navigation
│   ├── GeminiChat.tsx           # AI chatbot
│   ├── LinkedInHighlights.tsx   # Sidebar highlights
│   ├── NavigationIsland.tsx     # Bottom navigation
│   ├── NeuralNetwork3D.tsx      # 3D background
│   ├── ProfileHero.tsx          # Profile section
│   └── SectionLayout.tsx        # Page layout wrapper
```

## Customization

### Update Profile Photo

Replace `public/profile.jpeg` with your own photo.

### Update Content

Edit the data in each page file under `src/app/` to customize:
- Personal information
- Work experience
- Projects
- Skills
- Achievements

## License

MIT License - feel free to use this template for your own portfolio!

---

Built by Ankit Gole | [GitHub](https://github.com/AnkitGole007) | [LinkedIn](https://linkedin.com/in/ankit-gole)
