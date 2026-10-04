import '../../../styles/home.scss'

import React, { useEffect, useRef, useState } from 'react'

import { useInterview } from '../hooks/useInterview'

import { Link, useNavigate } from 'react-router'

const Home = () => {
  const { loading, generateReport, getAllReports, reports } = useInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [generationError, setGenerationError] = useState('')
  const [reportsLoading, setReportsLoading] = useState(true)
  const [reportsError, setReportsError] = useState('')
  const resumeInputRef = useRef()

  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    getAllReports()
      .catch((error) => {
        if (!cancelled) {
          setReportsError(
            error.response?.data?.message ||
            error.message ||
            'Could not load your saved reports.'
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setReportsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [getAllReports])

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0] ?? null
    setGenerationError('')
    try {
      const data = await generateReport(resumeFile, selfDescription, jobDescription)
      navigate(`/interview/${data.interviewReport._id}`)
    } catch (error) {
      setGenerationError(
        error.response?.data?.message ||
        (error.request
          ? 'Could not reach the server. Check that the backend is running and try again.'
          : error.message || 'Report generation failed. Please try again.')
      )
    }
  }


const SectionIcon = ({ type }) => (
  <span className="section-icon" aria-hidden="true">
    {type === 'job' ? (
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1.4 14.4 8 8 14.6 1.6 8 8 1.4Z" />
      </svg>
    ) : (
      <svg viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.4c-3 0-5.4 1.5-5.4 3.4v1.8h10.8v-1.8c0-1.9-2.4-3.4-5.4-3.4Z" />
      </svg>
    )}
  </span>
)

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7.2 18.3h10a3.8 3.8 0 0 0 .3-7.6 5.6 5.6 0 0 0-10.8-1.2 4.4 4.4 0 0 0 .5 8.8Z"
      fill="currentColor"
    />
    <path d="M12 15.2v-5m0 0-2 2m2-2 2 2" stroke="#10131d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SparkleIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="m8 1 1.5 5.1L14.5 8l-5 1.9L8 15l-1.5-5.1L1.5 8l5-1.9L8 1Z" />
  </svg>
)

// const Home = ({
//   jobDescription = '',
//   selfDescription = '',
//   resumeName = '',
//   onJobDescriptionChange,
//   onSelfDescriptionChange,
//   onResumeChange,
//   onGenerate,
// }) => {
  return (
    <main className="home">
      <section className="interview-screen" aria-labelledby="page-title">
        <div className="screen-content">
          <header className="page-heading">
            <h1 id="page-title">
              Create Your Custom <span>Interview Plan</span>
            </h1>
            <p>
              Let our AI analyze the job requirements and your unique profile to build a
              <br className="desktop-break" /> winning strategy.
            </p>
            <span className="heading-spark" aria-hidden="true" />
          </header>

          <form
            className="interview-card"
            aria-busy={loading}
            onSubmit={(event) => {
              event.preventDefault()
              handleGenerateReport()
            }}
          >
            <div className="form-columns">
              <section className="job-column" aria-labelledby="job-heading">
                <h2 className="field-heading" id="job-heading">
                  <SectionIcon type="job" />
                  Target Job Description
                </h2>
                <div className="job-textarea-wrap">
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    maxLength={1000}
                    defaultValue={jobDescription}
                    onChange= {(event) => {setJobDescription(event.target.value)}}
                    placeholder={'Paste the full job description here...\n\ne.g. Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'}
                    aria-label="Target job description"
                  />
                  <span className="character-count">Maximum 1000 characters</span>
                </div>
              </section>

              <section className="profile-column" aria-labelledby="profile-heading">
                <h2 className="field-heading" id="profile-heading">
                  <SectionIcon type="profile" />
                  Your Profile
                </h2>

                <div className="upload-group">
                  <div className="field-label-row">
                    <label htmlFor="resume">Upload Resume</label>
                    <span>PDF (Max 5MB)</span>
                  </div>
                  <input
                    ref={resumeInputRef}
                    className="visually-hidden"
                    type="file"
                    name="resume"
                    id="resume"
                    accept=".pdf,application/pdf"
                  />
                  <label
                    className="upload-dropzone"
                    htmlFor="resume"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => event.preventDefault()}
                  >
                    <span className="upload-icon">
                      <UploadIcon />
                    </span>
                    <span className="upload-primary">Click to upload or drag & drop</span>
                    <span className="upload-secondary">PDF (Max 5MB)</span>
                  </label>
                </div>

                <div className="or-divider" aria-hidden="true">
                  <span>OR</span>
                </div>

                <div className="description-group">
                  <label htmlFor="selfDescription">Quick Self-Description</label>
                  <textarea
                  onChange={(event) => {setSelfDescription(event.target.value)}}
                    id="selfDescription"
                    name="selfDescription"
                    defaultValue={selfDescription}
                    
                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  />
                </div>

                <p className="form-hint">
                  <span className="hint-dot" aria-hidden="true" />
                  <span>
                    Either a <strong>Resume</strong> or a <strong>Self-Description</strong> is
                    required to generate a personalized plan.
                  </span>
                </p>
              </section>
            </div>

            {generationError && (
              <p className="generation-error" role="alert">
                {generationError}
              </p>
            )}

            <footer className="card-footer">
              <p>AI-Powered Strategy Generation <span aria-hidden="true">·</span> Approx 30s</p>
              <button
                className="generate-button"
                type="submit"
                disabled={loading}
              >
                <SparkleIcon />
                {loading ? 'Generating Report...' : 'Generate My Interview Strategy'}
              </button>
            </footer>
          </form>

          <section className="saved-reports" aria-labelledby="saved-reports-heading">
            <header className="saved-reports-heading">
              <div>
                <span className="eyebrow">YOUR LIBRARY</span>
                <h2 id="saved-reports-heading">Saved interview reports</h2>
              </div>
              {!reportsLoading && !reportsError && (
                <span className="saved-reports-count">{reports.length}</span>
              )}
            </header>

            {reportsLoading ? (
              <p className="saved-reports-message" role="status">Loading your saved reports...</p>
            ) : reportsError ? (
              <p className="saved-reports-message saved-reports-error" role="alert">{reportsError}</p>
            ) : reports.length ? (
              <ul className="saved-reports-list">
                {reports.map((savedReport) => (
                  <li key={savedReport._id}>
                    <Link className="saved-report-link" to={`/interview/${savedReport._id}`}>
                      <span className="saved-report-icon" aria-hidden="true">
                        <SparkleIcon />
                      </span>
                      <span className="saved-report-details">
                        <strong>{savedReport.title || 'Interview report'}</strong>
                        <span>
                          {savedReport.createdAt
                            ? new Date(savedReport.createdAt).toLocaleDateString()
                            : 'Saved report'}
                          {typeof savedReport.matchScore === 'number' &&
                            ` · ${savedReport.matchScore}% match`}
                        </span>
                      </span>
                      <span className="saved-report-arrow" aria-hidden="true">›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="saved-reports-message">
                Your reports will appear here after you generate your first interview plan.
              </p>
            )}
          </section>

          <nav className="screen-footer" aria-label="Additional resources">
            <a href="#how-it-works">How it works</a>
            <a href="#privacy">Privacy</a>
            <a href="#help">Help</a>
          </nav>
        </div>
      </section>
    </main>
  )
}

export default Home
