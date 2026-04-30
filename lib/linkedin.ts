/**
 * LinkedIn Post Generator
 * Generates professional LinkedIn posts from blog content
 */

export interface LinkedInPost {
  content: string
  hashtags: string[]
}

export function generateLinkedInPost(blogPost: {
  title: string
  excerpt: string
  category: string
  tags?: string[]
}): LinkedInPost {
  const { title, excerpt, category, tags = [] } = blogPost

  // Generate engaging opening
  const opening = `🚀 ${title}\n\n`

  // Add excerpt as the main content
  const content = `${excerpt}\n\n`

  // Add call to action
  const cta = `Read the full article on our blog to learn more.\n\n`

  // Add relevant hashtags
  const categoryTag = category.toLowerCase().replace(/\s+/g, '').replace(/&/g, '')
  const baseHashtags = ['#DigitalMarketing', '#BusinessGrowth', `#${categoryTag}`]
  const customHashtags = tags.map(tag => `#${tag.replace(/\s+/g, '')}`)
  const uniqueHashtags = Array.from(new Set([...baseHashtags, ...customHashtags]))
  const allHashtags = uniqueHashtags.slice(0, 10)

  const hashtags = allHashtags.join(' ')

  return {
    content: opening + content + cta,
    hashtags: allHashtags
  }
}

export function formatLinkedInForCopy(linkedinPost: LinkedInPost): string {
  return `${linkedinPost.content}${linkedinPost.hashtags}\n\n---\n*Powered by Eva-Tech-Studio*`
}
