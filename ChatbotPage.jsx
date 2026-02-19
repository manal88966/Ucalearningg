import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Smart AI response engine ───────────────────────────────────────
function getResponse(msg, history) {
  const m = msg.toLowerCase().trim()

  // Greetings
  if (/^(hi|hello|hey|salut|bonjour|salam|yo|sup|bonsoir)/.test(m))
    return `Hey ${''} 👋 I'm **UcaBot**! Ask me anything — coding, your project, math, general knowledge, whatever you need. I'm here to help!`

  // How are you
  if (/how are you|comment (ça va|tu vas|vas-tu)|ca va/.test(m))
    return `I'm doing great, thanks for asking! 😊 Ready to help you with anything. What's on your mind?`

  // What are you / who are you
  if (/who are you|what are you|c'est quoi|qui es.tu/.test(m))
    return `I'm **UcaBot** 🤖, the AI assistant built into the **UcaLearn** platform.\n\nI can help you with:\n• **Your project** — Spring Boot, React, JWT, JPA, architecture\n• **Programming** — Java, JavaScript, Python, SQL, algorithms\n• **General knowledge** — science, math, history, languages\n• **Study help** — explanations, summaries, practice questions\n\nJust ask me anything!`

  // Thank you
  if (/thank|merci|shukran|thanks/.test(m))
    return `You're welcome! 😊 Don't hesitate to ask if you need anything else.`

  // ── SPRING BOOT ──────────────────────────────────────────────────
  if (/spring boot|springboot/.test(m) && !/react|frontend/.test(m))
    return `**Spring Boot** is a Java framework that makes building REST APIs fast and easy.\n\n**Key concepts:**\n• **@SpringBootApplication** — entry point, enables auto-config\n• **Embedded Tomcat** — no need to deploy separately, runs on port 8080\n• **Auto-configuration** — Spring detects what you need and sets it up\n• **Spring Data JPA** — database operations without writing SQL\n• **Spring Security** — authentication and authorization\n\n**Your app runs at:** http://localhost:8080/api\n\nWhat specifically do you want to know about Spring Boot?`

  // Annotations
  if (/@restcontroller|restcontroller/.test(m))
    return `**@RestController** combines two annotations:\n\n• **@Controller** — marks it as a Spring MVC controller\n• **@ResponseBody** — automatically converts return values to JSON\n\nSo instead of returning HTML views, it returns **data (JSON)** directly.\n\n\`\`\`java\n@RestController\n@RequestMapping("/api/courses")\npublic class CourseController {\n    @GetMapping\n    public List<Course> getAll() {\n        return courseService.getAll();\n    }\n}\n\`\`\`\n\nEvery endpoint in your UcaLearn backend uses this! 🎯`

  if (/@entity|jpa entity/.test(m))
    return `**@Entity** marks a Java class as a database table.\n\n\`\`\`java\n@Entity\n@Table(name = "courses")\npublic class Course {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    private String title;\n    private String category;\n}\n\`\`\`\n\nSpring Boot + JPA **automatically creates the table** from this class. No SQL needed! ✨\n\nYour UcaLearn project has 8 entities: User, Course, Lesson, Enrollment, Quiz, Question, QuizResult, ForumPost.`

  if (/repository|jparepository/.test(m))
    return `**JpaRepository** gives you CRUD methods for **free**, no SQL needed:\n\n• \`save(entity)\` — INSERT or UPDATE\n• \`findById(id)\` — SELECT by ID\n• \`findAll()\` — SELECT all\n• \`deleteById(id)\` — DELETE\n• \`count()\` — COUNT\n\n**Custom queries by method name:**\n\`\`\`java\nfindByEmail(String email)        // WHERE email = ?\nfindByRole(Role role)            // WHERE role = ?\nexistsByEmail(String email)      // SELECT EXISTS...\n\`\`\`\n\nSpring generates the SQL automatically from the method name! 🪄`

  if (/jwt|json web token|token/.test(m))
    return `**JWT (JSON Web Token)** — how UcaLearn handles authentication:\n\n**Flow:**\n1. User logs in → Backend verifies credentials\n2. Backend generates JWT token (signed with secret key)\n3. Frontend stores token in **localStorage**\n4. Every API request sends: \`Authorization: Bearer <token>\`\n5. Backend validates token on each request\n\n**Your JWT config:**\n• Secret: defined in application.properties\n• Expiration: 24 hours (86400000 ms)\n• Filter: JwtAuthFilter.java checks every request\n\nWithout a valid token → **401 Unauthorized** 🔒`

  if (/cors/.test(m))
    return `**CORS** (Cross-Origin Resource Sharing) is a browser security feature.\n\n**Problem:** Your React app (port **5173**) calls your Spring Boot API (port **8080**). The browser blocks this by default!\n\n**Solution in UcaLearn — CorsConfig.java:**\n\`\`\`java\nconfig.setAllowedOrigins(Arrays.asList(\n    "http://localhost:5173"\n));\nconfig.setAllowedMethods(Arrays.asList(\n    "GET","POST","PUT","DELETE","PATCH"\n));\n\`\`\`\n\nYour project already has this configured ✅`

  if (/service|@service/.test(m) && /spring|java/.test(m))
    return `**@Service** is the business logic layer in Spring Boot.\n\n**3-layer architecture in UcaLearn:**\n\`\`\`\nController (HTTP) → Service (Logic) → Repository (DB)\n\`\`\`\n\n• **Controller** — receives HTTP requests, returns responses\n• **Service** — contains all business logic (calculations, rules)\n• **Repository** — talks to the database\n\n**Why separate them?**\nEach layer has one responsibility. Easier to test, maintain, and understand. Your jury will love this explanation! 👍`

  // ── REACT ────────────────────────────────────────────────────────
  if (/react|jsx/.test(m) && !/spring|java/.test(m))
    return `**React** is a JavaScript library for building user interfaces.\n\n**Core concepts:**\n• **Component** — reusable piece of UI (a function that returns JSX)\n• **State** — data that changes over time, triggers re-render\n• **Props** — data passed from parent to child component\n• **Hooks** — functions that add logic to components\n\n**Your UcaLearn frontend uses:**\n• React Router — navigation between pages\n• Axios — HTTP calls to the backend\n• Context API — global state (AuthContext)\n• Vite — fast build tool\n\nWhat specifically about React do you want to know?`

  if (/usestate|use state/.test(m))
    return `**useState** — stores and updates values in a component.\n\n\`\`\`javascript\nconst [count, setCount] = useState(0)\n// count = current value\n// setCount = function to update it\n\nsetCount(1) // React re-renders the component!\n\`\`\`\n\n**In your UcaLearn project:**\n\`\`\`javascript\nconst [courses, setCourses] = useState([])\nconst [loading, setLoading] = useState(true)\nconst [error, setError]   = useState('')\n\`\`\`\n\nEvery time you call \`set...()\`, the component re-renders with the new value. ⚛️`

  if (/useeffect|use effect/.test(m))
    return `**useEffect** — runs code when the component loads or when a value changes.\n\n\`\`\`javascript\n// Run once when component mounts\nuseEffect(() => {\n    fetchCourses()\n}, []) // empty array = run once\n\n// Run when userId changes\nuseEffect(() => {\n    fetchUserData(userId)\n}, [userId])\n\`\`\`\n\n**In your UcaLearn StudentDashboard:**\n\`\`\`javascript\nuseEffect(() => {\n    enrollAPI.getByStudent(user.id)\n        .then(res => setEnrollments(res.data))\n}, [user.id])\n\`\`\`\n\nThis loads the student's courses when the page opens! 📱`

  // ── PYTHON ───────────────────────────────────────────────────────
  if (/python/.test(m))
    return `**Python** 🐍 — one of the most popular programming languages!\n\n**Key features:**\n• Simple, readable syntax\n• Great for data science, AI/ML, web, scripting\n• Huge ecosystem of libraries\n\n**Quick syntax:**\n\`\`\`python\n# Variables\nname = "Sara"\nage = 20\n\n# List\ncourses = ["Java", "React", "Python"]\n\n# Function\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Loop\nfor course in courses:\n    print(course)\n\`\`\`\n\nWhat do you want to do with Python?`

  // ── SQL ──────────────────────────────────────────────────────────
  if (/sql|mysql|database|base de données|h2/.test(m))
    return `**SQL** — language for managing relational databases.\n\n**Basic commands:**\n\`\`\`sql\n-- Get all courses\nSELECT * FROM courses;\n\n-- Get published courses\nSELECT * FROM courses WHERE published = true;\n\n-- Count enrollments per course\nSELECT course_id, COUNT(*) as total\nFROM enrollments\nGROUP BY course_id;\n\n-- Join: get student name + course name\nSELECT u.first_name, c.title\nFROM enrollments e\nJOIN users u ON e.student_id = u.id\nJOIN courses c ON e.course_id = c.id;\n\`\`\`\n\n**UcaLearn uses H2 (in-memory) for dev, MySQL for production.**\nYou can see all data at: http://localhost:8080/h2-console 🗄️`

  // ── ALGORITHMS ───────────────────────────────────────────────────
  if (/algorithm|sorting|binary search|complexity|big o/.test(m))
    return `**Algorithms & Complexity** 📊\n\n**Common sorting algorithms:**\n• **Bubble Sort** — O(n²) — simple but slow\n• **Quick Sort** — O(n log n) avg — fast, used in practice\n• **Merge Sort** — O(n log n) — stable, good for large data\n\n**Big O notation:**\n• O(1) — constant time (best)\n• O(log n) — binary search\n• O(n) — linear scan\n• O(n²) — nested loops (avoid!)\n\n**Binary search example:**\n\`\`\`java\nint binarySearch(int[] arr, int target) {\n    int left = 0, right = arr.length - 1;\n    while (left <= right) {\n        int mid = (left + right) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target)  left = mid + 1;\n        else                    right = mid - 1;\n    }\n    return -1;\n}\n\`\`\`\nWhat algorithm topic do you need?`

  // ── MATH ─────────────────────────────────────────────────────────
  if (/math|calcul|equation|derivative|integral|matrix/.test(m)) {
    // Try to evaluate simple math
    const calc = m.replace(/what is|calculate|compute|=\?/gi,'').trim()
    try {
      const result = Function(`"use strict"; return (${calc.replace(/[^0-9+\-*/().% ]/g,'')})`)()
      if (!isNaN(result)) return `The result is: **${result}** 🧮`
    } catch(e) {}
    return `**Mathematics** 🧮\n\nI can help with:\n• Algebra, calculus, statistics\n• Matrix operations\n• Probability\n• Discrete math (for CS)\n\n**For CS students — useful formulas:**\n• Complexity: O(n log n) for efficient sorting\n• Probability: P(A) = favorable / total\n• Binary: 2⁸ = 256 values, 2¹⁰ = 1024\n\nAsk me a specific math problem!`
  }

  // ── ARCHITECTURE / UML ───────────────────────────────────────────
  if (/architecture|uml|diagram|mvc|design pattern/.test(m))
    return `**Software Architecture — UcaLearn** 🏗️\n\n**Pattern: MVC (Model-View-Controller)**\n\`\`\`\nModel    → Java classes (User, Course, Enrollment...)\nView     → React components (LoginPage, Dashboard...)\nController → Spring REST controllers\n\`\`\`\n\n**Request flow:**\n\`\`\`\nBrowser → React → Axios HTTP → Spring Controller\n       → Service → Repository → H2/MySQL Database\n       ← JSON response ←←←←←←←←←←←←←\n\`\`\`\n\n**For your UML diagrams:**\n• **Class diagram** — show entity relationships\n• **Sequence diagram** — show login/enrollment flow\n• **Use case diagram** — Student/Professor/Admin actions\n\nWant me to describe any of these in detail?`

  // ── QUIZ SYSTEM ──────────────────────────────────────────────────
  if (/quiz|question|score|exam/.test(m))
    return `**UcaLearn Quiz System** 📝\n\n**How it works:**\n1. Professor creates a quiz with multiple-choice questions\n2. Student opens quiz → countdown timer starts\n3. Student selects answers (A/B/C/D)\n4. On submit → **QuizService.submitQuiz()** auto-corrects\n5. Score = (correct answers / total) × 100\n6. Pass if score ≥ passingScore (default **60%**)\n\n**Auto-correction code:**\n\`\`\`java\nfor (Question q : questions) {\n    String given = answers.get(q.getId());\n    if (given.equalsIgnoreCase(q.getCorrectAnswer()))\n        correct++;\n}\nint score = (correct * 100) / total;\nboolean passed = score >= quiz.getPassingScore();\n\`\`\`\n\nSimple, clean, and it works! ✅`

  // ── ENGLISH HELP ────────────────────────────────────────────────
  if (/english|presentation|soutenance|how to say|translate/.test(m))
    return `**Soutenance in English** 🎤 — Useful phrases:\n\n**Introduction:**\n"Good morning, our project is called UcaLearn, an e-learning platform built with Spring Boot and React."\n\n**Architecture:**\n"We used a REST API architecture. The frontend communicates with the backend via HTTP requests authenticated with JWT tokens."\n\n**Demo:**\n"Let me show you a live demonstration of the platform."\n\n**If you don't know the answer:**\n"That's a great question. We haven't implemented that yet, but it would be a good future improvement."\n\n**Conclusion:**\n"Thank you for your attention. We are happy to answer any questions."\n\nWant me to help with a specific part of your presentation?`

  // ── What is X ───────────────────────────────────────────────────
  if (/what is|c'est quoi|qu'est.ce|define|explain/.test(m)) {
    const topic = m.replace(/what is|c'est quoi|qu'est.ce que|explain|define/gi,'').trim()
    return `**${topic.charAt(0).toUpperCase()+topic.slice(1)}** — here's a clear explanation:\n\nThis is a broad topic! Here's what I know:\n\n• It's a concept used in computer science and software development\n• Understanding it helps build better applications\n\nCould you be more specific about what aspect of **"${topic}"** you want to understand? For example:\n• How it works technically?\n• How it's used in your project?\n• An example in Java or React?\n\nI'll give you a precise answer! 🎯`
  }

  // ── Default catch-all ────────────────────────────────────────────
  const responses = [
    `That's an interesting question! Here's my take:\n\n**"${msg}"** touches on some important concepts in software development and computer science.\n\nTo give you the most helpful answer, could you tell me:\n• Is this related to your **UcaLearn project**?\n• Is it about **Java/Spring Boot**?\n• Is it about **React/JavaScript**?\n• Or is it a **general question**?\n\nI'm ready to explain in detail! 💡`,
    `Great question! I want to make sure I give you the right answer about **"${msg}"**.\n\nHere are some things I can help you with right now:\n• Spring Boot annotations and concepts\n• React hooks and components\n• JWT authentication flow\n• Database and JPA queries\n• Algorithms and data structures\n• Your soutenance preparation\n\nWhich direction would be most helpful? 🚀`,
    `I hear you asking about **"${msg}"** — let me help!\n\nFor the best answer, a bit more context would help:\n• What are you trying to **build or fix**?\n• Which part of the project is this for?\n• Have you seen a specific **error message**?\n\nShare more details and I'll give you a precise, useful answer! 🤖`,
  ]
  return responses[msg.length % responses.length]
}

// ── Component ─────────────────────────────────────────────────────
export default function ChatbotPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const bottomRef  = useRef(null)
  const inputRef   = useRef(null)

  const [messages, setMessages] = useState([{
    id: 1, role: 'bot',
    text: `Hello **${user?.firstName}**! 👋 I'm **UcaBot**, your AI assistant!\n\nI can help you with any question — Spring Boot, React, your project, coding, math, or anything else.\n\nWhat would you like to know?`,
    time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
  }])
  const [input,  setInput]  = useState('')
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, typing])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText) return

    const userMsg = {
      id: Date.now(), role: 'user', text: userText,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    // Simulate thinking delay (0.6 - 1.4s)
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800))

    const history = messages.map(m => ({ role: m.role, text: m.text }))
    const botText = getResponse(userText, history)

    setMessages(prev => [...prev, {
      id: Date.now() + 1, role: 'bot', text: botText,
      time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    }])
    setTyping(false)
    inputRef.current?.focus()
  }

  // Render text with **bold** support + code blocks
  const renderText = (text) => {
    return text.split('\n').map((line, i, arr) => {
      // Code line
      if (line.startsWith('```') || line.endsWith('```')) {
        return <span key={i} style={{ display:'block', height:6 }}/>
      }
      // Inline code
      const codeRegex = /`([^`]+)`/g
      const boldRegex = /\*\*(.*?)\*\*/g

      let result = line
      const parts = []
      let lastIndex = 0
      const combined = [...line.matchAll(/\*\*(.*?)\*\*|`([^`]+)`/g)]

      if (combined.length === 0) {
        return <span key={i}>{line}{i < arr.length-1 && <br/>}</span>
      }

      combined.forEach((match, mi) => {
        if (match.index > lastIndex) {
          parts.push(<span key={`t${i}${mi}`}>{line.slice(lastIndex, match.index)}</span>)
        }
        if (match[1] !== undefined) {
          parts.push(<strong key={`b${i}${mi}`}>{match[1]}</strong>)
        } else {
          parts.push(<code key={`c${i}${mi}`} style={{ background:'rgba(0,0,0,0.08)', padding:'1px 6px', borderRadius:4, fontFamily:'monospace', fontSize:12 }}>{match[2]}</code>)
        }
        lastIndex = match.index + match[0].length
      })
      if (lastIndex < line.length) parts.push(<span key={`e${i}`}>{line.slice(lastIndex)}</span>)

      return <span key={i}>{parts}{i < arr.length-1 && <br/>}</span>
    })
  }

  const suggestions = [
    "How does JWT work?",
    "What is @RestController?",
    "Explain useEffect hook",
    "Help me prepare my soutenance",
  ]

  return (
    <div style={{ display:'flex', height:'100vh', background:'#f5f3ee' }}>
      {/* Mini sidebar */}
      <div style={{ width:60, background:'#1a1a2e', display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 0', gap:8 }}>
        <div style={{ width:36, height:36, background:'#e8490f', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:17, color:'white', marginBottom:16 }}>U</div>
        <div onClick={() => navigate(-1)} style={{ width:36, height:36, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:16, background:'rgba(255,255,255,0.06)' }} title="Back">←</div>
      </div>

      {/* Chat */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', maxWidth:780, margin:'0 auto', width:'100%' }}>
        {/* Header */}
        <div style={{ background:'white', padding:'14px 24px', display:'flex', alignItems:'center', gap:14, borderBottom:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ width:44, height:44, background:'linear-gradient(135deg,#e8490f,#2563ff)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🤖</div>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, color:'#1a1a2e' }}>UcaBot — AI Assistant</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#00b894' }}>
              <div style={{ width:6, height:6, background:'#00b894', borderRadius:'50%' }}></div>
              Online · Always ready to help
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display:'flex', gap:10, flexDirection: msg.role==='user'?'row-reverse':'row', alignItems:'flex-end' }}>
              <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, background: msg.role==='bot'?'linear-gradient(135deg,#e8490f,#2563ff)':'#e8490f', color:'white', fontWeight:700 }}>
                {msg.role==='bot' ? '🤖' : user?.firstName?.[0]}
              </div>
              <div style={{ maxWidth:'74%' }}>
                <div style={{ padding:'12px 16px', borderRadius:16, fontSize:13, lineHeight:1.75, background: msg.role==='bot'?'white':'#1a1a2e', color: msg.role==='bot'?'#1a1a2e':'rgba(255,255,255,0.92)', borderBottomLeftRadius: msg.role==='bot'?4:16, borderBottomRightRadius: msg.role==='user'?4:16, boxShadow: msg.role==='bot'?'0 2px 8px rgba(0,0,0,0.06)':'none' }}>
                  {renderText(msg.text)}
                </div>
                <div style={{ fontSize:10, color:'#6b6880', marginTop:4, textAlign: msg.role==='user'?'right':'left' }}>{msg.time}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#e8490f,#2563ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🤖</div>
              <div style={{ background:'white', padding:'14px 18px', borderRadius:16, borderBottomLeftRadius:4, boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                  {[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:'50%',background:'#aaa',animation:`pulse 1.2s ease ${i*0.2}s infinite` }}/>)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div style={{ padding:'0 24px 12px', display:'flex', gap:8, flexWrap:'wrap' }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                style={{ padding:'7px 14px', background:'white', border:'1px solid rgba(0,0,0,0.08)', borderRadius:100, fontSize:12, color:'#6b6880', cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e=>{e.target.style.borderColor='#e8490f';e.target.style.color='#e8490f'}}
                onMouseLeave={e=>{e.target.style.borderColor='rgba(0,0,0,0.08)';e.target.style.color='#6b6880'}}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ background:'white', borderTop:'1px solid rgba(0,0,0,0.06)', padding:'14px 20px', display:'flex', gap:12 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask UcaBot anything..."
            style={{ flex:1, background:'#f5f3ee', border:'none', borderRadius:10, padding:'10px 16px', fontSize:13, color:'#1a1a2e', outline:'none' }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim()||typing}
            style={{ width:40, height:40, background:'#e8490f', border:'none', borderRadius:10, color:'white', fontSize:16, cursor:input.trim()&&!typing?'pointer':'default', opacity:input.trim()&&!typing?1:0.5, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}