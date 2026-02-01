import { motion } from 'framer-motion'
import { Brain, Zap, Code } from 'lucide-react'
import { SkillBadge } from './SkillBadge'

const skillCategories = [
  {
    title: 'LLM & AI Systems',
    icon: Brain,
    color: 'purple' as const,
    skills: [
      { name: 'PyTorch', proficiency: 95 },
      { name: 'LangChain', proficiency: 92 },
      { name: 'Hugging Face', proficiency: 94 },
      { name: 'LoRA/QLoRA', proficiency: 90 },
      { name: 'RAG Systems', proficiency: 93 },
      { name: 'Prompt Engineering', proficiency: 96 }
    ]
  },
  {
    title: 'MLOps & Infrastructure',
    icon: Zap,
    color: 'orange' as const,
    skills: [
      { name: 'Azure ML', proficiency: 91 },
      { name: 'MLflow', proficiency: 89 },
      { name: 'Docker', proficiency: 92 },
      { name: 'Kubernetes', proficiency: 85 },
      { name: 'FastAPI', proficiency: 93 },
      { name: 'CI/CD Pipelines', proficiency: 88 }
    ]
  },
  {
    title: 'Data & Development',
    icon: Code,
    color: 'blue' as const,
    skills: [
      { name: 'Python', proficiency: 97 },
      { name: 'PySpark', proficiency: 88 },
      { name: 'TensorFlow', proficiency: 91 },
      { name: 'Neo4j', proficiency: 84 },
      { name: 'FAISS/Qdrant', proficiency: 89 },
      { name: 'Terraform', proficiency: 82 }
    ]
  }
]

export function Skills() {
  return (
    <section id="skills" className="py-24 px-4 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Technical Expertise
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Skills & Technologies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building production-ready AI systems with calibrated metrics, audit-ready artifacts, and deployment-focused testing
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Click any skill badge to replay its animation
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.skills.length} technologies
                  </p>
                </div>
              </div>

              {/* Skills List */}
              <div className="grid grid-cols-2 gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <SkillBadge
                    key={skill.name}
                    name={skill.name}
                    proficiency={skill.proficiency}
                    delay={categoryIndex * 2 + skillIndex}
                    color={category.color}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
