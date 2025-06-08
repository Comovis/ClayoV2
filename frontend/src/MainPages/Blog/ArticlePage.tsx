"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom" // Changed from "next/link", added useParams
// Removed: import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'; // Import for rendering markdown content

// Import the blog service hook and its types
import { useBlogService, BlogPost } from "../../Hooks/useBlogService" // Adjust path and add BlogPost type

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>() // Get the 'slug' from the URL parameters
  const [post, setPost] = useState<BlogPost | null>(null) // State to store the fetched blog post
  // State for displaying error messages (no success messages needed for a public read page)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'error' | null, message: string | null }>({ type: null, message: null });

  // Initialize the blog service hook to get data and loading/error states
  const {
    getBlogPostBySlug,
    isLoading, // Boolean: true when fetching, false otherwise
    error, // String: error message if an API call fails
    clearMessages, // Function to clear internal hook messages
  } = useBlogService();

  // --- Fetch Post Data on Component Mount and Slug Change ---
  useEffect(() => {
    const fetchPost = async () => {
      if (slug) { // Ensure slug is available before attempting to fetch
        clearMessages(); // Clear any previous messages from the hook
        setSubmitStatus({ type: null, message: null }); // Clear local status

        const fetchedPost = await getBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost); // Update state with fetched post
        } else {
            // If getBlogPostBySlug returns null, it means the article was not found or an error occurred
            setSubmitStatus({ type: 'error', message: error || "Article not found or an error occurred while fetching." });
        }
      }
    };

    if (slug) {
        fetchPost();
    }
  }, [slug, getBlogPostBySlug, error, clearMessages]); // Dependencies: re-run if slug or hook functions change

  // Helper function to format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return "Invalid Date";
    }
  };

  // Helper function to get category-specific badge color (reused from other blog components)
  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case "compliance": return "bg-blue-100 text-blue-800";
      case "technology": return "bg-green-100 text-green-800";
      case "operations": return "bg-yellow-100 text-yellow-800";
      case "safety": return "bg-red-100 text-red-800";
      case "sustainability": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading article...</p>
      </div>
    );
  }

  // --- Render Error/Not Found State ---
  // Show if not loading, and post is null or there's a submitStatus error
  if (!post || submitStatus.type === 'error') {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-600 p-4">
        <p className="text-lg font-semibold mb-4">{submitStatus.message || "Failed to load article or article not found."}</p>
        <Link to="/blog" className="text-blue-600 hover:underline flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go back to all articles
        </Link>
      </div>
    );
  }

  // --- Render Article Content ---
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-4 md:p-6 bg-white border-b">
        <Link to="/blog" className="flex items-center text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to all articles
        </Link>
        <div className="flex space-x-2">
          {/* Share and Bookmark buttons - functional implementation would be separate */}
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <Share2 className="h-5 w-5" />
            <span className="sr-only">Share</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <Bookmark className="h-5 w-5" />
            <span className="sr-only">Bookmark</span>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
          {post.featured_image && (
            <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden shadow-md">
              {/* Replaced next/image Image component with standard <img> tag */}
              <img
                src={post.featured_image} // Use the featured_image URL from the fetched post
                alt={post.title}
                className="w-full h-full object-cover" // Tailwind classes for sizing and object fit
              />
            </div>
          )}

          <Badge className={`${getCategoryColor(post.category)} mb-4`}>
            {post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1) : "Uncategorized"}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center text-gray-600 text-sm mb-8 space-x-4 flex-wrap">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{post.author_name || "Clayo Team"}</span> {/* Display author name */}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.published_at)}</span> {/* Display formatted publish date */}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.read_time || 'N/A'} min read</span> {/* Display read time */}
            </div>
          </div>

          {/* Render article content using ReactMarkdown */}
          {/* Apply Tailwind's 'prose' classes for basic markdown styling */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <ReactMarkdown>{post.content || ''}</ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-100 text-gray-700">
                    <Tag className="h-3 w-3 mr-1" /> {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles Section - This section would typically fetch
              related posts dynamically from the backend based on category/tags.
              Keeping the mock structure for now as it was in your original file. */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* These would be fetched dynamically based on category/tags, for now mock placeholders */}
              <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  {/* Replaced next/image Image component with standard <img> tag */}
                  <img
                    src="/placeholder.svg" // Placeholder image for related articles
                    alt="Related Article"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge>Compliance</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    <Link to="#">Future of Maritime Autonomy</Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    Exploring the advancements and challenges in autonomous shipping technologies.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Jan 10, 2024
                    <Clock className="h-3 w-3 ml-3 mr-1" />
                    7 min read
                  </div>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  {/* Replaced next/image Image component with standard <img> tag */}
                  <img
                    src="/placeholder.svg" // Placeholder image for related articles
                    alt="Related Article"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge>Technology</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    <Link to="#">AI in Port Operations</Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    How artificial intelligence is revolutionizing efficiency and safety in ports.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Dec 28, 2023
                    <Clock className="h-3 w-3 ml-3 mr-1" />
                    9 min read
                  </div>
                </CardContent>
              </Card>
              <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                <div className="relative">
                  {/* Replaced next/image Image component with standard <img> tag */}
                  <img
                    src="/placeholder.svg" // Placeholder image for related articles
                    alt="Related Article"
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge>Sustainability</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    <Link to="#">Green Shipping Initiatives</Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    New strategies for reducing carbon footprint in the maritime industry.
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    Nov 05, 2023
                    <Clock className="h-3 w-3 ml-3 mr-1" />
                    6 min read
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