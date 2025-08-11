# AB's Uncle VoiceMode UI Design (Frontend Only)

> **Note:** This markdown describes the UI only. No backend, voice, or API logic is implemented here. For backend integration, see the planned separate markdown file.

---

## Page Location
- Add this as a new page under the main site's Projects section.
- Page Title: **AB's Uncle VoiceMode**

## UI Layout & Theme
- **Theme:** Match the current website's theme (fonts, colors, glowing text, spacing, and button style).
- **Glowing Title:** The page title `AB's Uncle VoiceMode` should glow, using the same glowing text effect as other highlighted titles on the site.
- **Center Layout:** All main content is centered both vertically and horizontally.
- **Responsiveness:** The layout should be mobile-friendly and responsive.

---

## UI Components

### 1. Glowing Title
```jsx
<h1 className="glow-title">AB's Uncle VoiceMode</h1>
```
- Use the site's existing `glow-title` or equivalent class for glowing effect.

### 2. Record Button (Centered)
```jsx
<button className="record-btn">
  <span className="mic-icon" />
  {isRecording ? 'Stop Recording' : 'Start Recording'}
</button>
```
- Place button in the center of the page.
- Use a microphone icon (`mic-icon`), styled to match the site's iconography.
- Button glows or pulses slightly when active (recording).
- Button uses the same color scheme and border-radius as other interactive elements.

### 3. Transcript Display
```jsx
<div className="transcript-box">
  {transcript.length === 0 ? (
    <span className="placeholder">Transcript will appear here...</span>
  ) : (
    <pre className="transcript-text">{transcript}</pre>
  )}
</div>
```
- Box below the button, styled to match the site's terminal or chat-like UI.
- Shows live transcript as user speaks (simulated for UI only).
- If no transcript, show a friendly placeholder.

### 4. (Optional) Subtle Particle/Glow Effects
- If the current site uses animated particles or glows, add a subtle background effect for consistency.

---

## Example JSX Structure
```jsx
<div className="voice-mode-container">
  <h1 className="glow-title">AB's Uncle VoiceMode</h1>
  <button className="record-btn">
    <span className="mic-icon" />
    {isRecording ? 'Stop Recording' : 'Start Recording'}
  </button>
  <div className="transcript-box">
    {transcript.length === 0 ? (
      <span className="placeholder">Transcript will appear here...</span>
    ) : (
      <pre className="transcript-text">{transcript}</pre>
    )}
  </div>
</div>
```

---

## CSS/Styling Notes
- Use existing CSS classes from your site for glow, button, and layout.
- `glow-title`: For glowing animated text (reuse from homepage or projects page).
- `record-btn`: Large, rounded, with glowing border. Pulses/glows when active.
- `mic-icon`: Use SVG or icon font, styled to match site's icon style.
- `transcript-box`: Styled like terminal/chat window. Monospaced font. Subtle background.
- `placeholder`: Dimmed, italic, friendly prompt.
- `voice-mode-container`: Center content with flex/grid, responsive.

---

## Accessibility
- Button should have accessible label ("Start Recording"/"Stop Recording").
- Ensure color contrast meets accessibility standards.

---

## Integration
- Add a link/card for "AB's Uncle VoiceMode" on the Projects page, styled like other project links/cards.
- When backend is ready, transcript box will display live transcript from voice recognition.

---

## To-Do (For Backend/LLM)
- Implement microphone/recording logic.
- Connect to backend for real-time transcription.
- Display transcript updates in real time.
- Handle errors and permissions gracefully.

---

**This markdown is for UI only. No backend logic is included.**
