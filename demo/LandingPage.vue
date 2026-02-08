<template>
  <div class="landing-page" :data-theme="theme">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero__content">
        <!-- Logo/Icon -->
        <div class="hero__icon">
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="80" height="80" rx="15" fill="url(#gradient)"/>
            <text x="50" y="65" text-anchor="middle" fill="white" font-size="45" font-weight="bold">T</text>
          </svg>
        </div>

        <!-- Title -->
        <h1 class="hero__title">
          <span class="gradient-text">Tiptap UI Kit</span>
        </h1>

        <!-- Subtitle -->
        <p class="hero__subtitle">
          A production-ready, AI-powered rich text editor for Vue 3
        </p>

        <!-- Badges -->
        <div class="hero__badges">
          <a href="https://github.com/benngaihk/Tiptap-UI-Kit" target="_blank" class="badge">
            <svg class="badge__icon" viewBox="0 0 16 16" width="16" height="16">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>Star on GitHub</span>
          </a>
          <span class="badge badge--static">
            <span class="badge__dot"></span>
            MIT License
          </span>
          <span class="badge badge--static">
            🔥 Open Source
          </span>
        </div>

        <!-- CTA Buttons -->
        <div class="hero__actions">
          <button class="btn btn--primary" @click="$emit('start-demo')">
            <span>Try Live Demo</span>
            <svg class="btn__icon" viewBox="0 0 20 20" width="20" height="20">
              <path fill="currentColor" d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
            </svg>
          </button>
          <a href="https://github.com/benngaihk/Tiptap-UI-Kit" target="_blank" class="btn btn--secondary">
            <svg class="btn__icon" viewBox="0 0 16 16" width="20" height="20">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>

        <!-- Stats -->
        <div class="hero__stats">
          <div class="stat">
            <div class="stat__value">5</div>
            <div class="stat__label">Themes</div>
          </div>
          <div class="stat">
            <div class="stat__value">15+</div>
            <div class="stat__label">Features</div>
          </div>
          <div class="stat">
            <div class="stat__value">3</div>
            <div class="stat__label">Languages</div>
          </div>
          <div class="stat">
            <div class="stat__value">100%</div>
            <div class="stat__label">Free</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2 class="section-title">Why Choose Tiptap UI Kit?</h2>

      <div class="features-grid">
        <!-- Feature 1 -->
        <div class="feature-card">
          <div class="feature-card__icon">🎨</div>
          <h3 class="feature-card__title">5 Beautiful Themes</h3>
          <p class="feature-card__description">
            From Notion-like to Word-style. Each theme has perfect dark mode support.
          </p>
          <div class="feature-card__tags">
            <span class="tag">Default</span>
            <span class="tag">Word</span>
            <span class="tag">Notion</span>
            <span class="tag">GitHub</span>
            <span class="tag">Typora</span>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="feature-card">
          <div class="feature-card__icon">🤖</div>
          <h3 class="feature-card__title">AI-Powered</h3>
          <p class="feature-card__description">
            Smart writing assistance with continue writing, polish, translate, and summarize.
          </p>
          <div class="feature-card__tags">
            <span class="tag">OpenAI</span>
            <span class="tag">Aliyun</span>
            <span class="tag">DeepSeek</span>
            <span class="tag">Ollama</span>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="feature-card">
          <div class="feature-card__icon">🌓</div>
          <h3 class="feature-card__title">Perfect Dark Mode</h3>
          <p class="feature-card__description">
            Seamless light/dark theme switching. Every detail looks great in both modes.
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="feature-card">
          <div class="feature-card__icon">📝</div>
          <h3 class="feature-card__title">Word Mode</h3>
          <p class="feature-card__description">
            Professional A4 paper layout with automatic pagination for document editing.
          </p>
        </div>

        <!-- Feature 5 -->
        <div class="feature-card">
          <div class="feature-card__icon">🤝</div>
          <h3 class="feature-card__title">Real-time Collaboration</h3>
          <p class="feature-card__description">
            Multi-user editing powered by Yjs. See collaborators' cursors in real-time.
          </p>
        </div>

        <!-- Feature 6 -->
        <div class="feature-card">
          <div class="feature-card__icon">🌍</div>
          <h3 class="feature-card__title">i18n Ready</h3>
          <p class="feature-card__description">
            Built-in support for Chinese (Simplified/Traditional) and English.
          </p>
        </div>
      </div>
    </section>

    <!-- Themes Preview -->
    <section class="themes-preview">
      <h2 class="section-title">Explore Themes</h2>
      <p class="section-subtitle">Choose the perfect theme for your application</p>

      <div class="themes-grid">
        <div class="theme-card" v-for="themeItem in themes" :key="themeItem.id">
          <div class="theme-card__preview" :style="{ background: themeItem.gradient }">
            <div class="theme-card__mockup">
              <div class="mockup-toolbar"></div>
              <div class="mockup-content">
                <div class="mockup-line" v-for="i in 3" :key="i"></div>
              </div>
            </div>
          </div>
          <div class="theme-card__info">
            <h3 class="theme-card__title">{{ themeItem.name }}</h3>
            <p class="theme-card__description">{{ themeItem.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack -->
    <section class="tech-stack">
      <h2 class="section-title">Built With Modern Technologies</h2>

      <div class="tech-grid">
        <div class="tech-item">
          <div class="tech-item__icon">
            <svg viewBox="0 0 256 256" width="40" height="40">
              <path fill="#41B883" d="M204.8,0H256L128,220.8L0,0h97.92L128,51.2L157.44,0h47.36Z"/>
              <path fill="#41B883" d="M0,0l128,220.8L256,0h-51.2L128,132.48L50.56,0H0Z"/>
              <path fill="#35495E" d="M50.56,0L128,133.12L204.8,0h-47.36L128,51.2L97.92,0H50.56Z"/>
            </svg>
          </div>
          <div class="tech-item__name">Vue 3</div>
        </div>
        <div class="tech-item">
          <div class="tech-item__icon">📝</div>
          <div class="tech-item__name">Tiptap 3</div>
        </div>
        <div class="tech-item">
          <div class="tech-item__icon">🔷</div>
          <div class="tech-item__name">TypeScript</div>
        </div>
        <div class="tech-item">
          <div class="tech-item__icon">🎨</div>
          <div class="tech-item__name">Ant Design Vue</div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta__content">
        <h2 class="cta__title">Ready to Start?</h2>
        <p class="cta__subtitle">
          Install via npm and start building amazing editors in minutes
        </p>
        <div class="cta__code">
          <code>npm install benngaihk/Tiptap-UI-Kit</code>
          <button class="cta__copy" @click="copyInstallCommand" title="Copy to clipboard">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </div>
        <button class="btn btn--primary btn--large" @click="$emit('start-demo')">
          <span>Try Live Demo</span>
          <svg class="btn__icon" viewBox="0 0 20 20" width="20" height="20">
            <path fill="currentColor" d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p class="footer__text">
        Made with ❤️ by the open source community
      </p>
      <div class="footer__links">
        <a href="https://github.com/benngaihk/Tiptap-UI-Kit" target="_blank">GitHub</a>
        <span>·</span>
        <a href="https://github.com/benngaihk/Tiptap-UI-Kit/issues" target="_blank">Issues</a>
        <span>·</span>
        <a href="https://github.com/benngaihk/Tiptap-UI-Kit/blob/main/LICENSE" target="_blank">MIT License</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  theme: 'light' | 'dark'
}>()

defineEmits<{
  'start-demo': []
}>()

const themes = [
  {
    id: 'word',
    name: 'Word',
    description: 'Professional document style with A4 layout',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Modern, distraction-free writing',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Developer-friendly markdown style',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: 'typora',
    name: 'Typora',
    description: 'Elegant reading and writing',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 'default',
    name: 'Default',
    description: 'Clean and minimal design',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
]

const copyInstallCommand = () => {
  navigator.clipboard.writeText('npm install benngaihk/Tiptap-UI-Kit')
  // Could add a toast notification here
}
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}

/* Theme Variables */
.landing-page[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #f1f3f5;
  --text-primary: #1a1a1a;
  --text-secondary: #6c757d;
  --border-color: #e9ecef;
  --accent: #667eea;
}

.landing-page[data-theme="dark"] {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --border-color: #30363d;
  --accent: #667eea;
}

/* Hero Section */
.hero {
  padding: 120px 24px 80px;
  text-align: center;
  background: var(--bg-primary);
}

.hero__content {
  max-width: 900px;
  margin: 0 auto;
}

.hero__icon {
  margin-bottom: 32px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero__title {
  font-size: 64px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  font-size: 24px;
  color: var(--text-secondary);
  margin: 0 0 32px;
  line-height: 1.6;
}

.hero__badges {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s;
}

.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.badge--static {
  cursor: default;
}

.badge--static:hover {
  transform: none;
}

.badge__icon {
  width: 16px;
  height: 16px;
}

.badge__dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.hero__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn--secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn--secondary:hover {
  background: var(--bg-tertiary);
  transform: translateY(-2px);
}

.btn--large {
  padding: 16px 40px;
  font-size: 18px;
}

.btn__icon {
  width: 20px;
  height: 20px;
}

.hero__stats {
  display: flex;
  gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat__value {
  font-size: 36px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 8px;
}

.stat__label {
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Features Section */
.features {
  padding: 80px 24px;
  background: var(--bg-secondary);
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  margin: 0 0 16px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  text-align: center;
  margin: 0 0 60px;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  padding: 32px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-card__icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card__title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px;
}

.feature-card__description {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 16px;
}

.feature-card__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: var(--bg-secondary);
  border-radius: 12px;
  font-size: 13px;
  color: var(--text-secondary);
}

/* Themes Preview */
.themes-preview {
  padding: 80px 24px;
  background: var(--bg-primary);
}

.themes-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.theme-card {
  border-radius: 16px;
  overflow: hidden;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  transition: all 0.3s;
  cursor: pointer;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.theme-card__preview {
  height: 180px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-card__mockup {
  width: 100%;
  max-width: 200px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mockup-toolbar {
  height: 8px;
  background: linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%);
  border-radius: 4px;
  margin-bottom: 8px;
}

.mockup-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mockup-line {
  height: 4px;
  background: linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%);
  border-radius: 2px;
}

.theme-card__info {
  padding: 20px;
}

.theme-card__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
}

.theme-card__description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* Tech Stack */
.tech-stack {
  padding: 80px 24px;
  background: var(--bg-secondary);
}

.tech-grid {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 32px;
}

.tech-item {
  text-align: center;
}

.tech-item__icon {
  margin-bottom: 12px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.tech-item__name {
  font-size: 16px;
  font-weight: 600;
}

/* CTA Section */
.cta {
  padding: 80px 24px;
  background: var(--bg-primary);
  text-align: center;
}

.cta__content {
  max-width: 600px;
  margin: 0 auto;
}

.cta__title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 16px;
}

.cta__subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0 0 32px;
}

.cta__code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  margin-bottom: 32px;
}

.cta__code code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 16px;
  color: var(--accent);
}

.cta__copy {
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.cta__copy:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Footer */
.footer {
  padding: 40px 24px;
  text-align: center;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.footer__text {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 12px;
}

.footer__links {
  display: flex;
  gap: 12px;
  justify-content: center;
  font-size: 14px;
}

.footer__links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer__links a:hover {
  color: var(--accent);
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 80px 16px 60px;
  }

  .hero__title {
    font-size: 42px;
  }

  .hero__subtitle {
    font-size: 18px;
  }

  .section-title {
    font-size: 32px;
  }

  .features, .themes-preview, .tech-stack, .cta {
    padding: 60px 16px;
  }

  .features-grid, .themes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
