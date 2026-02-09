# 🚀 DevForge AI

**AI-Powered Development Suite for the Google Gemini 3 Hackathon**

Transform your ideas into production-ready code with three powerful AI tools powered by Gemini 2.0 Flash.

---

## 🎯 Features

### 🏗️ Tool 1: Architecture Builder

- **Visual Drag-and-Drop Interface**: Design full-stack applications using 15 pre-built technology nodes
- **Smart Auto-Connect**: Automatically validates and connects nodes based on architectural best practices
- **Production Code Generation**: Generate complete, working codebases in 30-60 seconds
- **Live Preview**: Test your generated code instantly with StackBlitz integration
- **Download & Deploy**: Export as ZIP with complete setup instructions

**Supported Technologies:**

- Frontend: React, Next.js, Vue, Angular
- Backend: Node.js + Express, Python + FastAPI, Go + Gin, NestJS
- Database: PostgreSQL, MongoDB, Redis, MySQL
- Services: JWT Auth, Stripe Payments, AWS S3 Storage

### 🔍 Tool 2: AI Code Reviewer

- **Multi-Source Analysis**: Upload files or analyze entire GitHub repositories
- **Comprehensive Scanning**: Detects security vulnerabilities, performance issues, code quality problems
- **Detailed Reports**: Get actionable fixes with code snippets and explanations
- **Severity Categorization**: Critical, Medium, and Low priority issues
- **Export Reports**: Download markdown reports for team review

### 📚 Tool 3: Documentation Generator

- **Auto-Generate README**: Create professional documentation from your codebase
- **Complete Coverage**: Installation, usage, API docs, deployment guides
- **GitHub Integration**: Analyze public repositories directly
- **Markdown Export**: Download ready-to-use README.md files

### 💬 Context-Aware AI Assistant

- **Tool-Specific Help**: Get relevant assistance for each tool
- **Function Calling**: Modify architecture with natural language (e.g., "Add Redis for caching")
- **Persistent Chat History**: Maintains conversation context per tool

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism theme
- **State Management**: Zustand
- **Visual Editor**: React Flow
- **AI**: Google Gemini 2.0 Flash API
- **Code Preview**: StackBlitz SDK
- **Syntax Highlighting**: react-syntax-highlighter
- **File Handling**: react-dropzone, JSZip

---

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/niranjanniru-max/devforge-ai.git
cd devforge-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_token_here  # Optional, for higher rate limits
```

4. **Run development server**

```bash
npm run dev
```

5. **Open in browser**

```
http://localhost:3000
```

---

## 🚀 Usage

### Tool 1: Architecture Builder

1. Navigate to **Architecture Builder**
2. Drag technology nodes from the palette to the canvas
3. Nodes auto-connect based on valid architectural patterns
4. Click **Generate Full Stack Code** when architecture is valid
5. Wait 30-60 seconds for AI to generate complete codebase
6. Preview live in StackBlitz or download as ZIP

**Chat Commands:**

- "Add PostgreSQL database"
- "Remove Stripe integration"
- "Change theme to dark mode with blue colors"

### Tool 2: AI Code Reviewer

1. Navigate to **Code Reviewer**
2. **Option A**: Paste GitHub repository URL and click Analyze
3. **Option B**: Drag and drop code files (max 100 files, 50MB total)
4. Wait for AI analysis (15-30 seconds)
5. Review issues categorized by severity
6. Expand issue cards for detailed fixes
7. Download comprehensive report

### Tool 3: Documentation Generator

1. Navigate to **Docs Generator**
2. Enter GitHub repository URL
3. Click **Generate Docs**
4. Wait for AI to analyze and create documentation
5. Review generated README.md
6. Download for your project

---

## 🎨 Design Philosophy

DevForge AI features a modern, premium design with:

- **Glassmorphism Effects**: Translucent cards with backdrop blur
- **Gradient Theme**: Purple (#667eea) → Deep Purple (#764ba2) → Pink (#f093fb)
- **Smooth Animations**: Hover effects, loading states, transitions
- **Responsive Layout**: Mobile-first approach with 12-70-18 split (Sidebar-Main-Chat)
- **Dark Mode**: Optimized for low-light environments

---

## 🔐 Security & Best Practices

- **API Key Protection**: Never commit `.env` files (use `.env.example`)
- **Rate Limiting**: Gemini API calls are throttled to prevent abuse
- **File Validation**: Strict size limits (10MB/file, 50MB total, 100 files max)
- **Parameterized Queries**: All generated code uses secure database queries
- **CORS Configuration**: Properly configured for production deployment

---

## 📁 Project Structure

```
devforge-ai/
├── app/
│   ├── layout.tsx                 # Root layout with conditional sidebar/chat
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Global styles + Tailwind
│   ├── architecture-builder/      # Tool 1
│   ├── code-reviewer/             # Tool 2
│   ├── docs-generator/            # Tool 3
│   └── api/
│       ├── generate-code/         # Tool 1 API
│       ├── review-code/           # Tool 2 API
│       ├── generate-docs/         # Tool 3 API
│       └── chat/                  # Chat API with function calling
├── components/
│   ├── Sidebar.tsx                # Navigation
│   ├── ChatPanel.tsx              # AI assistant
│   ├── ChatMessage.tsx            # Message component
│   ├── Tool1/                     # Architecture Builder components
│   ├── Tool2/                     # Code Reviewer components
│   └── Tool3/                     # Docs Generator components
├── store/
│   └── projectStore.ts            # Zustand global state
├── lib/
│   └── github.ts                  # GitHub API integration
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your repository
- Add environment variable: `GEMINI_API_KEY`
- Deploy!

3. **Custom Domain** (Optional)

- Add your domain in Vercel dashboard
- Update DNS records

### Environment Variables for Production

```env
GEMINI_API_KEY=your_production_gemini_key
GITHUB_TOKEN=your_github_token  # Optional
NODE_ENV=production
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**niranjanniru-max**

Built for the Google Gemini 3 Hackathon

---

## 🙏 Acknowledgments

- Google Gemini Team for the powerful AI API
- Next.js team for the amazing framework
- React Flow for the visual editor
- StackBlitz for live code preview
- All open-source contributors

---

## 📞 Support

For issues or questions:

- Open an issue on GitHub
- Contact: niranjanniru-max

---

**⭐ Star this repo if you find it useful!**
