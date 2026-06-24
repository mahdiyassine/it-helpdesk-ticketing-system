import { useEffect, useState } from "react";
import api from "./api/api";

function ReportsAiPanel() {
  const [reports, setReports] = useState([]);
  const [aiTicket, setAiTicket] = useState({
    title: "",
    description: "",
  });

  const [aiResult, setAiResult] = useState(null);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    const response = await api.get("/Reports/tickets");
    setReports(response.data);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const exportCsv = () => {
    window.open("http://localhost:5291/api/Reports/tickets/export-csv");
  };

  const exportPdf = () => {
    window.print();
  };

  const analyzeTicket = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/Ai/analyze-ticket", {
        title: aiTicket.title,
        description: aiTicket.description,
      });

      setAiResult(response.data);
    } catch (error) {
      setAiResult({
        suggestedCategory: "Error",
        suggestedPriority: "Error",
        summary: error.response?.data || "Failed to analyze ticket.",
        troubleshootingSuggestions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const askAiAssistant = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/Ai/chat", {
        question: chatQuestion,
      });

      setChatAnswer(response.data.answer);
    } catch (error) {
      setChatAnswer(error.response?.data || "Failed to get assistant answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="panel" id="reports">
        <div className="section-header">
          <div>
            <p className="eyebrow">Reports</p>
            <h2>Reports & Exporting</h2>
            <p className="section-subtitle">
              Review ticket information and export reports for documentation.
            </p>
          </div>

          <div className="button-row">
            <button type="button" className="secondary-button" onClick={loadReports}>
              Refresh
            </button>

            <button type="button" onClick={exportCsv}>
              Export CSV / Excel
            </button>

            <button type="button" className="secondary-button" onClick={exportPdf}>
              Export PDF
            </button>
          </div>
        </div>

        <div className="report-summary">
          <div>
            <span>Total Report Rows</span>
            <strong>{reports.length}</strong>
          </div>

          <div>
            <span>Resolved</span>
            <strong>
              {reports.filter((ticket) => ticket.status === "Resolved").length}
            </strong>
          </div>

          <div>
            <span>High Priority</span>
            <strong>
              {reports.filter((ticket) => ticket.priority === "High").length}
            </strong>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Assigned To</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.ticketReference}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.category}</td>
                  <td>
                    <span className="badge">{ticket.priority}</span>
                  </td>
                  <td>
                    <span className="badge soft">{ticket.status}</span>
                  </td>
                  <td>{ticket.createdByUser}</td>
                  <td>{ticket.assignedToUser || "Unassigned"}</td>
                </tr>
              ))}

              {reports.length === 0 && (
                <tr>
                  <td colSpan="7">No report data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel" id="ai-analysis">
        <div className="section-header">
          <div>
            <p className="eyebrow">AI Support</p>
            <h2>AI Ticket Analysis</h2>
            <p className="section-subtitle">
              Generate category, priority, summary, and troubleshooting suggestions.
            </p>
          </div>
        </div>

        <div className="ai-layout">
          <form onSubmit={analyzeTicket} className="ticket-form compact-form">
            <div>
              <label>Ticket Title</label>
              <input
                value={aiTicket.title}
                onChange={(e) =>
                  setAiTicket({ ...aiTicket, title: e.target.value })
                }
                placeholder="Example: Printer not working"
                required
              />
            </div>

            <div>
              <label>Ticket Description</label>
              <textarea
                value={aiTicket.description}
                onChange={(e) =>
                  setAiTicket({ ...aiTicket, description: e.target.value })
                }
                placeholder="Describe the issue here..."
                required
              />
            </div>

            <button type="submit">
              {loading ? "Analyzing..." : "Analyze Ticket"}
            </button>
          </form>

          <div className="ai-preview">
            <p className="eyebrow">Preview</p>
            <h3>Suggested AI Output</h3>
            <p>
              The assistant can recommend the correct ticket category, detect
              priority level, summarize the issue, and suggest troubleshooting
              steps.
            </p>
          </div>
        </div>

        {aiResult && (
          <div className="ai-result">
            <div className="ai-result-grid">
              <div>
                <span className="mini-label">Suggested Category</span>
                <h3>{aiResult.suggestedCategory}</h3>
              </div>

              <div>
                <span className="mini-label">Suggested Priority</span>
                <h3>{aiResult.suggestedPriority}</h3>
              </div>
            </div>

            <div className="summary-box">
              <span className="mini-label">AI Summary</span>
              <p>{aiResult.summary}</p>
            </div>

            <div className="summary-box">
              <span className="mini-label">Troubleshooting Suggestions</span>

              {aiResult.troubleshootingSuggestions.length > 0 ? (
                <ul>
                  {aiResult.troubleshootingSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              ) : (
                <p>No suggestions available.</p>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="panel" id="ai-assistant">
        <div className="section-header">
          <div>
            <p className="eyebrow">Assistant</p>
            <h2>AI Chatbot Assistant</h2>
            <p className="section-subtitle">
              Ask quick IT support questions and get guided answers.
            </p>
          </div>
        </div>

        <div className="chat-shell">
          <form onSubmit={askAiAssistant} className="ticket-form">
            <label>Ask a support question</label>
            <input
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="Example: How do I reset a password?"
              required
            />

            <button type="submit">
              {loading ? "Thinking..." : "Ask Assistant"}
            </button>
          </form>

          {chatAnswer ? (
            <div className="ai-result chat-answer">
              <span className="mini-label">Assistant Answer</span>
              <p>{chatAnswer}</p>
            </div>
          ) : (
            <div className="empty-chat">
              <h3>Try asking:</h3>
              <p>How do I reset a password?</p>
              <p>How do I fix a printer issue?</p>
              <p>How do I handle a network problem?</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ReportsAiPanel;