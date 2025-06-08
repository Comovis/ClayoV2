"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Clock, FileText, Tag, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { useBlogService, type BlogPost } from "../../Hooks/useBlogService"

interface BlogCardProps {
  post: BlogPost
  getCategoryColor: (category: string | null) => string
  formatDate: (dateString: string | null) => string
}

const BlogImage: React.FC<{ src: string | null; alt: string; className?: string }> = ({
  src,
  alt,
  className = "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200",
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
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">No image available</p>
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
              <ImageIcon className="h-8 w-8 mx-auto mb-1" />
              <p className="text-xs">Loading...</p>
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
        loading="lazy"
        crossOrigin="anonymous"
      />
    </div>
  )
}

const BlogCard: React.FC<BlogCardProps> = ({ post, getCategoryColor, formatDate }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <BlogImage src={post.featured_image_url} alt={post.title} />
        {post.category && (
          <div className="absolute top-4 left-4 z-20">
            <Badge className={getCategoryColor(post.category)}>
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          <Link to={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {post.excerpt && <p className="text-gray-600 text-sm line-clamp-3 mb-3 leading-relaxed">{post.excerpt}</p>}

        <div className="flex items-center text-xs text-gray-500 mb-3 flex-wrap gap-2">
          {post.published_at && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(post.published_at)}</span>
            </div>
          )}
          {post.read_time && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.read_time} min read</span>
            </div>
          )}
          {post.author_name && (
            <div className="flex items-center">
              <span className="text-gray-400">by</span>
              <span className="ml-1 font-medium">{post.author_name}</span>
            </div>
          )}
        </div>

        {post.seo_keywords && post.seo_keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.seo_keywords.slice(0, 3).map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                <Tag className="h-2 w-2 mr-1" />
                {keyword}
              </Badge>
            ))}
            {post.seo_keywords.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-1 text-gray-500">
                +{post.seo_keywords.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MainBlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [posts, setPosts] = useState<BlogPost[]>([])

  const { getPublishedPosts, isLoading, error, clearMessages } = useBlogService()

  useEffect(() => {
    const fetchPosts = async () => {
      clearMessages()
      const fetchedPosts = await getPublishedPosts()
      if (fetchedPosts) {
        setPosts(fetchedPosts)
      }
    }
    fetchPosts()
  }, [getPublishedPosts, clearMessages])

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      console.error("Invalid date string:", dateString, e)
      return "Invalid Date"
    }
  }, [])

  const getCategoryColor = useCallback((category: string | null) => {
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
  }, [])

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.seo_keywords &&
        post.seo_keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (post.author_name && post.author_name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Blog - Latest Insights from Clayo</title>
        <meta
          name="description"
          content="Read the latest articles, insights, and updates from Clayo's blog. Stay informed about maritime industry trends, compliance, and technology."
        />
        <meta name="keywords" content="maritime, shipping, compliance, technology, blog, insights" />
      </Helmet>

      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Insights & Updates</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stay informed about maritime industry trends, compliance updates, and technological innovations.
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-8 relative max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Search articles by title, author, category, or keywords..."
          className="pl-10 pr-4 py-3 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading articles...</h3>
          <p className="text-gray-600">Please wait while we fetch the latest content.</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading articles</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No articles found" : "No articles published yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? "No articles match your search criteria. Try a different search term."
              : "There are no blog articles published yet. Check back soon for the latest insights!"}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")} className="border-gray-300 hover:bg-gray-50">
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Blog Posts Grid */}
      {!isLoading && !error && filteredPosts.length > 0 && (
        <>
          <div className="mb-6 text-sm text-gray-600 text-center">
            {searchQuery ? (
              <p>
                Found {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""} matching "{searchQuery}"
              </p>
            ) : (
              <p>
                Showing {filteredPosts.length} published article{filteredPosts.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} getCategoryColor={getCategoryColor} formatDate={formatDate} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
