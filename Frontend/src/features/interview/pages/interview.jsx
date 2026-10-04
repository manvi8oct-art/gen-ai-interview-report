import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview'
import '../../../styles/interview.scss'

// const exampleReport = {
//   matchScore: 88,
//   technicalQuestions: [
//     {
//       question: 'Explain the Node.js event loop and how it handles asynchronous operations.',
//       intention: "To assess the candidate's understanding of Node.js asynchronous execution.",
//       answer:
//         'The candidate should explain the event loop, call stack, callback queue and how asynchronous operations are handled.',
//     },
//     {
//       question: 'How do you optimize a MongoDB aggregation pipeline?',
//       intention: 'To test practical experience with MongoDB performance optimization.',
//       answer:
//         'Focus on using $match as early as possible, proper indexing and reducing unnecessary documents.',
//     },
//     {
//       question: 'Can you describe the Cache-Aside pattern?',
//       intention: "To evaluate the candidate's understanding of caching strategies.",
//       answer:
//         'The candidate should explain that the application first checks the cache and fetches data from the database when the data is unavailable.',
//     },
//   ],
//   behavioralQuestions: [
//     {
//       question: 'Tell me about a challenging project you worked on.',
//       intention: 'To understand problem-solving and project experience.',
//       answer: 'The candidate should explain the challenge, their approach and the final outcome.',
//     },
//     {
//       question: 'How do you approach learning a new technology?',
//       intention: 'To assess adaptability and the ability to learn independently.',
//       answer:
//         'The candidate should describe their process of learning documentation, building small projects and applying the technology.',
//     },
//   ],
//   skillGaps: [
//     { skill: 'Message Queues (Kafka/RabbitMQ)', severity: 'high' },
//     { skill: 'Advanced Docker & CI/CD Pipelines', severity: 'medium' },
//     { skill: 'Distributed Systems Design', severity: 'medium' },
//     { skill: 'Production-level Redis management', severity: 'low' },
//   ],
//   preparationPlan: [
//     {
//       day: 1,
//       focus: 'Message Queues',
//       tasks: ['Learn the basics of message queues.', 'Study Kafka and RabbitMQ fundamentals.'],
//     },
//     {
//       day: 2,
//       focus: 'Docker & CI/CD',
//       tasks: ['Learn Docker fundamentals.', 'Understand basic CI/CD pipelines.'],
//     },
//     {
//       day: 3,
//       focus: 'Redis',
//       tasks: ['Learn Redis caching.', 'Understand production-level Redis concepts.'],
//     },
//     {
//       day: 4,
//       focus: 'System Design & Microservices',
//       tasks: [
//         'Study microservices communication patterns.',
//         'Learn about the API Gateway pattern and Circuit Breaker.',
//       ],
//     },
//     {
//       day: 5,
//       focus: 'Message Queues & DevOps Basics',
//       tasks: [
//         'Watch introductory tutorials on RabbitMQ or Kafka.',
//         'Dockerize the project and understand the basic deployment workflow.',
//       ],
//     },
//     {
//       day: 6,
//       focus: 'Data Structures & Algorithms',
//       tasks: ['Revise important data structures.', 'Practice common interview problems.'],
//     },
//   ],
// }

const sections = [
  { id: 'technical', label: 'Technical questions', shortLabel: 'Technical' },
  { id: 'behavioral', label: 'Behavioral questions', shortLabel: 'Behavioral' },
  { id: 'roadmap', label: 'Road Map', shortLabel: 'Road map' },
]

const getQuestionText = (item) =>
  typeof item === 'string' ? item : item?.question ?? item?.questions ?? ''

const Interview = () => {
  const { interviewId } = useParams()
  const { report, getReportById } = useInterview()
  const [activeSection, setActiveSection] = useState('technical')
  const [loadState, setLoadState] = useState({ interviewId: null, error: '' })
  const isLoadingReport = loadState.interviewId !== interviewId

  useEffect(() => {
    let cancelled = false

    getReportById(interviewId)
      .then(() => {
        if (!cancelled) {
          setLoadState({ interviewId, error: '' })
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadState({
            interviewId,
            error:
            error.response?.data?.message ||
            error.message ||
            'Could not load this interview report.'
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [getReportById, interviewId])

  if (isLoadingReport) {
    return (
      <main className="interview-status" role="status">
        <p>Loading your interview report...</p>
      </main>
    )
  }

  const loadError = isLoadingReport ? '' : loadState.error
  if (loadError || !report) {
    return (
      <main className="interview-status">
        <section className="interview-status-card" role="alert">
          <h1>Could not load interview report</h1>
          <p>{loadError || 'The requested interview report was not found.'}</p>
          <Link to="/">Return to the home page</Link>
        </section>
      </main>
    )
  }

  const technicalQuestions = report.technicalQuestions ?? []
  const behavioralQuestions = report.behavioralQuestions ?? []
  const skillGaps = report.skillGaps ?? report.skillGap ?? []
  const preparationPlan = report.preparationPlan ?? []
  const activeLabel = sections.find((section) => section.id === activeSection)?.label
  const matchScore = Math.max(0, Math.min(100, report.matchScore ?? 0))

  return (
    <main className="interview-page">
      <section className="interview-workspace" aria-label="Interview preparation workspace">
        <nav className="workspace-navigation" aria-label="Interview sections">
          <div className="navigation-heading">
            <span className="navigation-mark" aria-hidden="true">i</span>
            <div>
              <span className="eyebrow">YOUR PREPARATION</span>
              <h1>Interview plan</h1>
            </div>
          </div>

          <div className="navigation-links" role="tablist" aria-label="Preparation sections">
            {sections.map((section) => (
              <button
                key={section.id}
                id={`${section.id}-tab`}
                className={`navigation-link${activeSection === section.id ? ' is-active' : ''}`}
                type="button"
                role="tab"
                aria-selected={activeSection === section.id}
                aria-controls="workspace-panel"
                onClick={() => setActiveSection(section.id)}
              >
                <span className="navigation-link-icon" aria-hidden="true">
                  {section.id === 'technical' ? '01' : section.id === 'behavioral' ? '02' : '03'}
                </span>
                <span>{section.label}</span>
                <span className="navigation-chevron" aria-hidden="true">›</span>
              </button>
            ))}
          </div>

          <div className="navigation-note">
            <span className="note-spark" aria-hidden="true">✦</span>
            <p>Small, focused practice makes a stronger interview.</p>
          </div>
        </nav>

        <section
          className="workspace-main"
          id="workspace-panel"
          role="tabpanel"
          aria-labelledby={`${activeSection}-tab`}
          key={activeSection}
        >
          <header className="content-heading">
            <span className="eyebrow">YOUR PERSONALIZED GUIDE</span>
            <h2>{activeLabel}</h2>
            <p>
              {activeSection === 'technical' &&
                'Practice the concepts most relevant to your next role.'}
              {activeSection === 'behavioral' &&
                'Prepare clear stories that show how you work and solve problems.'}
              {activeSection === 'roadmap' &&
                'Follow this focused, day-by-day plan to close your skill gaps.'}
            </p>
          </header>

          {activeSection === 'technical' && (
            <div className="question-list">
              {technicalQuestions.length ? (
                technicalQuestions.map((item, index) => (
                  <details className="question-card" key={`${getQuestionText(item)}-${index}`}>
                    <summary>
                      <span className="question-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="question-title">{getQuestionText(item)}</span>
                      <span className="question-toggle" aria-hidden="true">+</span>
                    </summary>
                    {item?.intention && (
                      <p className="question-intention">
                        <span>WHAT THIS ASSESSES</span>
                        {item.intention}
                      </p>
                    )}
                    {item?.answer && (
                      <p className="answer-guidance">
                        <span>ANSWER GUIDE</span>
                        {item.answer}
                      </p>
                    )}
                  </details>
                ))
              ) : (
                <p className="empty-state">No technical questions are available yet.</p>
              )}
            </div>
          )}

          {activeSection === 'behavioral' && (
            <div className="question-list">
              {behavioralQuestions.length ? (
                behavioralQuestions.map((item, index) => (
                  <details className="question-card" key={`${getQuestionText(item)}-${index}`}>
                    <summary>
                      <span className="question-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="question-title">{getQuestionText(item)}</span>
                      <span className="question-toggle" aria-hidden="true">+</span>
                    </summary>
                    {item?.intention && (
                      <p className="question-intention">
                        <span>WHAT THIS ASSESSES</span>
                        {item.intention}
                      </p>
                    )}
                    {item?.answer && (
                      <p className="answer-guidance">
                        <span>ANSWER GUIDE</span>
                        {item.answer}
                      </p>
                    )}
                  </details>
                ))
              ) : (
                <p className="empty-state">No behavioral questions are available yet.</p>
              )}
            </div>
          )}

          {activeSection === 'roadmap' && (
            <div className="roadmap-list">
              {preparationPlan.length ? (
                preparationPlan.map((item, index) => {
                  const day = typeof item === 'string' ? `Day ${index + 1}` : `Day ${item.day ?? index + 1}`
                  const focus = typeof item === 'string' ? item.replace(/^Day \d+:\s*/, '') : item.focus
                  const tasks = typeof item === 'string' ? [] : item.tasks ?? []

                  return (
                    <article className="roadmap-card" key={`${day}-${focus}`}>
                      <span className="roadmap-day">{day}</span>
                      <div className="roadmap-details">
                        <h3>{focus}</h3>
                        {tasks.length > 0 && (
                          <ul>
                            {tasks.map((task) => <li key={task}>{task}</li>)}
                          </ul>
                        )}
                      </div>
                    </article>
                  )
                })
              ) : (
                <p className="empty-state">No preparation plan is available yet.</p>
              )}
            </div>
          )}
        </section>

        <aside className="workspace-sidebar" aria-label="Interview insights">
          <section className="score-card" aria-label={`Match score: ${matchScore} percent`}>
            <div className="sidebar-section-heading">
              <h2>Profile match</h2>
              <span className="score-indicator" aria-hidden="true">✦</span>
            </div>
            <div className="score-display">
              <div className="score-ring" style={{ '--score': `${matchScore}%` }}>
                <span>{matchScore}<small>%</small></span>
              </div>
              <p>
                <strong>{matchScore >= 80 ? 'Strong match' : matchScore >= 60 ? 'Good match' : 'Keep building'}</strong>
                <span>{matchScore >= 80 ? "You're off to a great start." : 'Focus on the skill gaps below.'}</span>
              </p>
            </div>
            <div className="score-track" aria-hidden="true">
              <span style={{ width: `${matchScore}%` }} />
            </div>
          </section>

          <section className="skill-section">
            <div className="sidebar-section-heading">
              <div>
                <span className="eyebrow">FOCUS AREAS</span>
                <h2>Skill gaps</h2>
              </div>
              <span className="skill-count">{skillGaps.length}</span>
            </div>
            {skillGaps.length ? (
              <ul className="skill-list">
                {skillGaps.map((item, index) => {
                  const skill = typeof item === 'string' ? item : item.skill
                  const severity = typeof item === 'string' ? 'medium' : item.severity ?? 'medium'
                  return (
                    <li className="skill-item" key={`${skill}-${index}`}>
                      <span className="skill-dot" data-severity={severity} aria-hidden="true" />
                      <span>{skill}</span>
                      <span className={`severity-label severity-${severity}`}>{severity}</span>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="empty-state">No skill gaps identified.</p>
            )}
          </section>

          <div className="sidebar-footer">
            <span className="footer-orb" aria-hidden="true">✦</span>
            <p>Tailored for your next step.</p>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Interview
