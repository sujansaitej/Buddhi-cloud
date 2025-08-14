# Buddi Flow - AI Browser Automation Agent

Your intelligent browser automation companion. Research companies, analyze websites, and automate web tasks with AI.

## ✨ Features

- **🤖 AI-Powered Automation**: Intelligent browser automation using advanced AI models
- **🎯 Natural Language Interface**: Simply ask what you want to research or automate
- **👁️ Live Browser View**: Watch automation happen in real-time
- **📊 Comprehensive Reports**: Get detailed analysis and insights
- **🛡️ Safe & Secure**: No sensitive data collection, secure automation
- **⚡ Fast & Efficient**: Optimized for speed and reliability

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buddi-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Browser Use API key:
   ```
   BROWSER_USE_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Modern Interface

Buddi Flow features a beautiful, modern interface with:

- **Glassmorphism Design**: Elegant backdrop blur effects
- **Gradient Themes**: Beautiful color transitions
- **Responsive Layout**: Works perfectly on all devices
- **Split View**: Chat and live browser side-by-side
- **Real-time Updates**: See automation progress live

## 💬 How to Use

### Simple Mode
1. Type your request in natural language
2. Examples:
   - "Go to Amazon and search for wireless headphones"
   - "Visit GitHub and search for React components"
   - "Take a screenshot of the CNN homepage"

### Advanced Mode
1. Switch to Advanced mode for detailed control
2. Use the sidebar for comprehensive task management
3. View detailed progress and file downloads

## 🔧 Configuration

### API Keys
- **Browser Use API**: Required for automation functionality
- Get your API key from [Browser Use](https://browser-use.com)

### Customization
- Modify `src/config/automation-tasks.ts` for custom prompts
- Update branding in the configuration file
- Customize UI themes in `src/app/globals.css`

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Icons**: Lucide React
- **Markdown**: React Markdown
- **State Management**: React Context + useReducer
- **API**: Browser Use Cloud API

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ModernAgentInterface.tsx  # Main interface
│   ├── MainContent.tsx    # Advanced mode content
│   └── tabs/              # Tab components
├── config/                # Configuration files
│   └── automation-tasks.ts
├── context/               # React context
│   └── TaskContext.tsx
├── hooks/                 # Custom hooks
│   └── useTaskExecution.ts
└── lib/                   # Utility libraries
    └── browserUseApi.ts
```

## 🎯 Use Cases

- **Market Research**: Analyze competitors and market trends
- **Price Comparison**: Compare products across multiple sites
- **News Monitoring**: Track company news and developments
- **Data Collection**: Gather structured data from websites
- **Content Analysis**: Analyze website content and structure

## 🔒 Security & Privacy

- **No Data Storage**: We don't store your research data
- **Secure API**: All communications are encrypted
- **Privacy First**: No personal information collection
- **Safe Automation**: Built-in safety measures

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Compatible with static export
- **Railway**: Full-stack deployment support
- **Docker**: Containerized deployment available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Email**: Contact us at support@buddiflow.com

## 🙏 Acknowledgments

- [Browser Use](https://browser-use.com) for the automation API
- [Next.js](https://nextjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Lucide](https://lucide.dev) for the beautiful icons

---

**Made with ❤️ by the Buddi Flow Team**
