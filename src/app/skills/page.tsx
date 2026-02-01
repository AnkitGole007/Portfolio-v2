'use client';

import SectionLayout from '@/components/SectionLayout';
import { motion } from 'framer-motion';
import {
  Brain,
  Database,
  Cloud,
  Code2,
  Sparkles,
  GitBranch,
  Cpu,
  Layers
} from 'lucide-react';

const skillCategories = [
  {
    id: 1,
    title: 'Generative AI & LLMs',
    icon: <Sparkles size={24} />,
    color: '#0a84ff',
    gradient: 'from-[#0a84ff] to-[#5e5ce6]',
    skills: [
      'PyTorch', 'Hugging Face', 'CUDA', 'TensorRT',
      'LLMs', 'FLAN-T5', 'DistilBERT', 'MiniLM',
      'RAG', 'Vector Search', 'Embeddings',
      'LoRA/QLoRA', 'Diffusion Models', 'Prompt Engineering'
    ],
  },
  {
    id: 2,
    title: 'RAG & Agents',
    icon: <Brain size={24} />,
    color: '#5e5ce6',
    gradient: 'from-[#5e5ce6] to-[#bf5af2]',
    skills: [
      'RAG Architectures', 'Chunking', 'Embedding Selection',
      'Qdrant', 'FAISS', 'Pinecone',
      'Hybrid Search', 'Re-ranking', 'RAGAS',
      'LangChain', 'LlamaIndex', 'Semantic Kernel',
      'Multi-Agent Systems', 'Observability'
    ],
  },
  {
    id: 3,
    title: 'ML & Data Science',
    icon: <Cpu size={24} />,
    color: '#bf5af2',
    gradient: 'from-[#bf5af2] to-[#ff375f]',
    skills: [
      'PEFT', 'LoRA', 'QLoRA',
      'Sentence Transformers', 'BM25', 'MRR@K',
      'A/B Testing', 'Drift Detection',
      'TensorFlow', 'Scikit-Learn', 'PySpark'
    ],
  },
  {
    id: 4,
    title: 'Development',
    icon: <Code2 size={24} />,
    color: '#30d158',
    gradient: 'from-[#30d158] to-[#0a84ff]',
    skills: [
      'Python', 'FastAPI', 'Flask',
      'REST APIs', 'Pydantic', 'OpenCV',
      'React', 'TypeScript', 'Chrome Extensions',
      'Bash', 'Git', 'n8n'
    ],
  },
  {
    id: 5,
    title: 'Cloud & MLOps',
    icon: <Cloud size={24} />,
    color: '#ff375f',
    gradient: 'from-[#ff375f] to-[#ff9500]',
    skills: [
      'Azure ML', 'Azure AI Foundry', 'GCP Vertex AI',
      'Docker', 'Kubernetes',
      'Terraform', 'GitHub Actions',
      'MLflow', 'Prometheus', 'Grafana'
    ],
  },
  {
    id: 6,
    title: 'Databases',
    icon: <Database size={24} />,
    color: '#ff9500',
    gradient: 'from-[#ff9500] to-[#ffd60a]',
    skills: [
      'PostgreSQL', 'MySQL', 'MongoDB',
      'Neo4j', 'Redis', 'Qdrant',
      'BigQuery', 'PySpark'
    ],
  },
];

export default function SkillsPage() {
  return (
    <SectionLayout title="Skills" subtitle="My neural network stack">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="card-futuristic p-6 hover:glow-soft transition-all duration-500"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${category.gradient} opacity-60`} />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <span style={{ color: category.color }}>{category.icon}</span>
              </motion.div>
              <h3 className="text-xl font-semibold text-white">{category.title}</h3>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2.5">
              {category.skills.map((skill, sIdx) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 + sIdx * 0.02 }}
                  whileHover={{ scale: 1.05 }}
                  className="tech-tag px-4 py-2 rounded-full text-sm font-medium
                           border cursor-default transition-all duration-300"
                  style={{
                    backgroundColor: `${category.color}12`,
                    borderColor: `${category.color}30`,
                    color: category.color,
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionLayout>
  );
}
