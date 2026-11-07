import { describe, expect, it } from 'vitest'
import { formatBlogContent } from './formatBlog'

describe('formatBlogContent', () => {
  it('renders headings, lists, and paragraph breaks', () => {
    const html = formatBlogContent('# Title\n\n## Section\n\n- First\n- Second\n\n1. Ranked')

    expect(html).toContain('<h1>Title</h1>')
    expect(html).toContain('<h2>Section</h2>')
    expect(html).toContain('• First<br>')
    expect(html).toContain('• Second<br>')
    expect(html).toContain('1. Ranked<br>')
    expect(html).toContain('<br><br>')
  })

  it('renders bold text and safe links', () => {
    const html = formatBlogContent('See **this** and [site](https://example.com/path).')

    expect(html).toContain('<strong>this</strong>')
    expect(html).toContain('<a href="https://example.com/path">site</a>')
  })

  it('escapes html and ignores unsafe links', () => {
    const html = formatBlogContent('5 < 6 and [click](javascript:alert(1))')

    expect(html).toContain('5 &lt; 6')
    expect(html).not.toContain('<a href="javascript:')
    expect(html).toContain('[click](javascript:alert(1))')
  })
})
