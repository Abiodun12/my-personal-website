function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function formatBlogContent(content: string) {
  const escaped = escapeHtml(content)

  const withCode = escaped.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, lang: string, code: string) => {
      const language = lang.replace(/[^a-zA-Z0-9_-]/g, '')
      return `<pre><code class="${language}">${code.replace(/\n$/, '')}</code></pre>`
    }
  )

  const withInline = withCode
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
      '<a href="$2">$1</a>'
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  return withInline
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^- (.*)$/gm, '• $1<br>')
    .replace(/^(\d+)\. (.*)$/gm, '$1. $2<br>')
    .replace(/\n\n/g, '<br><br>')
}
