"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, Tag, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

import { useBlogService, type BlogPost } from "../../Hooks/useBlogService"

const ArticleImage: React.FC<{ src: string | null; alt: string; className?: string }> = ({
  src,
  alt,
  className = "w-full h-full object-cover",
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  // Reset states when src changes
  useEffect(() => {
    setImageError(false)
    setImageLoading(true)
  }, [src])

  if (!src || imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <ImageIcon className="h-16 w-16 mx-auto mb-3" />
          <p className="text-lg font-medium">No featured image</p>
          <p className="text-sm">This article doesn't have a featured image</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div className={`${className} bg-gray-100 flex items-center justify-center absolute inset-0 z-10`}>
          <div className="text-center text-gray-400">
            <div className="animate-pulse">
              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">Loading image...</p>
            </div>
          </div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager" // Load immediately for featured images
        crossOrigin="anonymous"
      />
    </div>
  )
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [submitStatus, setSubmitStatus] = useState<{ type: "error" | null; message: string | null }>({
    type: null,
    message: null,
  })

  const { getBlogPostBySlug, isLoading, error, clearMessages } = useBlogService()

  // --- Fetch Post Data on Component Mount and Slug Change ---
  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        clearMessages()
        setSubmitStatus({ type: null, message: null })

        const fetchedPost = await getBlogPostBySlug(slug)
        if (fetchedPost) {
          setPost(fetchedPost)
        } else {
          setSubmitStatus({
            type: "error",
            message: error || "Article not found or an error occurred while fetching.",
          })
        }
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug, getBlogPostBySlug, error, clearMessages])

  // Helper function to format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      console.error("Invalid date string:", dateString, e)
      return "Invalid Date"
    }
  }

  // Helper function to get category-specific badge color
  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case "compliance":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "technology":
        return "bg-green-100 text-green-800 border-green-200"
      case "operations":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "safety":
        return "bg-red-100 text-red-800 border-red-200"
      case "sustainability":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between p-4 md:p-6 bg-white border-b">
          <Link to="/blog" className="flex items-center text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to all articles
          </Link>
        </header>
        <main className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading article...</h3>
              <p className="text-gray-600">Please wait while we fetch the content.</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // --- Render Error/Not Found State ---
  if (!post || submitStatus.type === "error") {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between p-4 md:p-6 bg-white border-b">
          <Link to="/blog" className="flex items-center text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to all articles
          </Link>
        </header>
        <main className="flex-1 flex justify-center items-center">
          <div className="text-center text-red-600 p-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold mb-4">
              {submitStatus.message || "Failed to load article or article not found."}
            </h3>
            <Link to="/blog" className="text-blue-600 hover:underline flex items-center justify-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Go back to all articles
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // --- Render Article Content ---
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 md:p-6 bg-white border-b sticky top-0 z-50">
        <Link to="/blog" className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to all articles
        </Link>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share article</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <Bookmark className="h-5 w-5" />
            <span className="sr-only">Bookmark article</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          {/* Featured Image Section */}
          {post.featured_image_url && (
            <div className="relative w-full h-80 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
              <ArticleImage src={post.featured_image_url} alt={post.title} />
            </div>
          )}

          {/* Article Header */}
          <div className="mb-8">
            {post.category && (
              <Badge className={`${getCategoryColor(post.category)} mb-4 text-sm px-3 py-1`}>
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </Badge>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && <p className="text-xl text-gray-600 leading-relaxed mb-6 font-light">{post.excerpt}</p>}

            <div className="flex items-center text-gray-600 text-sm space-x-6 flex-wrap gap-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{post.author_name || "Clayo Team"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              {post.read_time && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{post.read_time} min read</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg prose-gray max-w-none mb-12">
            <ReactMarkdown
              components={{
                // Customize markdown rendering for better styling
                h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>,
                h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xl font-medium mt-4 mb-2 text-gray-900">{children}</h3>,
                p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-800">{children}</p>,
                ul: ({ children }) => <ul className="mb-4 pl-6 space-y-2">{children}</ul>,
                ol: ({ children }) => <ol className="mb-4 pl-6 space-y-2">{children}</ol>,
                li: ({ children }) => <li className="text-gray-800">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">{children}</pre>
                ),
              }}
            >
              {post.content || ""}
            </ReactMarkdown>
          </div>

          {/* Tags Section */}
          {post.seo_keywords && post.seo_keywords.length > 0 && (
            <div className="border-t pt-8 mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {post.seo_keywords.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-1">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles Section */}
          <section className="border-t pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder related articles - these would be fetched dynamically */}
              <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  <ArticleImage
                    src="/placeholder.svg"
                    alt="Future of Maritime Autonomy"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-100 text-blue-800">Compliance</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    <Link to="#" className="hover:underline">
                      Future of Maritime Autonomy
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    Exploring the advancements and challenges in autonomous shipping technologies.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Jan 10, 2024
                    <Clock className="h-3 w-3 ml-3 mr-1" />7 min read
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  <ArticleImage
                    src="/placeholder.svg"
                    alt="AI in Port Operations"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-100 text-green-800">Technology</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    <Link to="#" className="hover:underline">
                      AI in Port Operations
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    How artificial intelligence is revolutionizing efficiency and safety in ports.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 28, 2023
                    <Clock className="h-3 w-3 ml-3 mr-1" />9 min read
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  <ArticleImage
                    src="/placeholder.svg"
                    alt="Green Shipping Initiatives"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-100 text-purple-800">Sustainability</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    <Link to="#" className="hover:underline">
                      Green Shipping Initiatives
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    New strategies for reducing carbon footprint in the maritime industry.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Nov 05, 2023
                    <Clock className="h-3 w-3 ml-3 mr-1" />6 min read
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </article>
      </main>
    </div>
  )
}
