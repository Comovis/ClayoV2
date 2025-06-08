"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Bold,
  Italic,
  List,
  LinkIcon,
  ImageIcon,
  Hash,
  Loader2,
  Sparkles,
  Wand2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  RotateCcw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useBlogService, type CreateBlogPostBody } from "../../Hooks/useBlogService"
import { useUser } from "../../Auth/Contexts/UserContext"

interface FormData extends CreateBlogPostBody {
  featured: boolean
  seoKeywords: string
  readTime: number
}

interface TopicSuggestion {
  title: string
  hook: string
  keywords: string[]
  controversy?: string
  value?: string
}

const ImagePreview: React.FC<{
  file: File | null
  url: string
  onRemove: () => void
  disabled: boolean
}> = ({ file, url, onRemove, disabled }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  useEffect(() => {
    setImageError(false)
    setImageLoading(true)
  }, [url])

  if (!url) return null

  return (
    <div className="relative">
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-md">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}
      {imageError ? (
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-md">
          <div className="text-center text-gray-400">
            <ImageIcon className="h-8 w-8 mx-auto mb-1" />
            <p className="text-xs">Failed to load image</p>
          </div>
        </div>
      ) : (
        <img
          src={url || "/placeholder.svg"}
          alt="Featured Image Preview"
          className="mx-auto mb-4 object-cover h-32 w-auto rounded-md max-w-full"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        onClick={onRemove}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
      {file && (
        <div className="text-xs text-gray-500 mt-2">
          <p>File: {file.name}</p>
          <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  )
}

export default function NewBlogPostPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    featuredImage: "",
    featured: false,
    status: "draft",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    readTime: 0,
  })

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")
  const [previewMode, setPreviewMode] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string | null
  }>({ type: null, message: null })

  // AI-related state
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false)
  const [topicSuggestions, setTopicSuggestions] = useState<TopicSuggestion[]>([])
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null)
  const [aiGenerationStep, setAiGenerationStep] = useState<"idle" | "generating" | "complete">("idle")
  const [titleExists, setTitleExists] = useState<boolean | null>(null)
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [userVerified, setUserVerified] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { createPost, isLoading, error, success, clearMessages, generateAIBlogPost, generateTopicSuggestions } =
    useBlogService()
  const { isAuthenticated, user, isLoading: userLoading } = useUser()

  // Wait for user verification to complete
  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated) {
        setSubmitStatus({ type: "error", message: "You must be logged in to access this page." })
        setUserVerified(false)
      } else if (!user?.is_clayo_admin) {
        setSubmitStatus({ type: "error", message: "You are not authorized to create blog posts." })
        setUserVerified(false)
      } else {
        setUserVerified(true)
        setSubmitStatus({ type: null, message: null })
      }
    }
  }, [userLoading, isAuthenticated, user])

  // Load initial topic suggestions only after user is verified
  useEffect(() => {
    if (userVerified && topicSuggestions.length === 0) {
      loadTopicSuggestions()
    }
  }, [userVerified])

  const loadTopicSuggestions = async () => {
    setLoadingTopics(true)
    try {
      const result = await generateTopicSuggestions()
      if (result?.success && result.suggestions) {
        setTopicSuggestions(result.suggestions)
      }
    } catch (error) {
      console.error("Failed to load topic suggestions:", error)
    } finally {
      setLoadingTopics(false)
    }
  }

  const handleGenerateMoreTopics = async () => {
    await loadTopicSuggestions()
  }

  // Check for duplicate titles when title changes
  useEffect(() => {
    const checkTitle = async () => {
      if (formData.title.length > 3) {
        // Simple check - in real implementation, call API to check database
        const slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")

        // Simulate API call - replace with actual endpoint
        setTitleExists(false) // For now, assume no duplicates
      } else {
        setTitleExists(null)
      }
    }

    const timeoutId = setTimeout(checkTitle, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.title])

  const handleShowTopicSuggestions = () => {
    setShowTopicSuggestions(true)
  }

  const handleSelectTopic = async (topic: TopicSuggestion) => {
    setSelectedTopic(topic)
    setShowTopicSuggestions(false)
    setAiGenerationStep("generating")

    // Clean the title to remove any markdown formatting
    const cleanTitle = topic.title
      .replace(/^#+\s*\d*\.?\s*/, "")
      .replace(/^["']|["']$/g, "")
      .trim()

    // Immediately update form with topic data
    setFormData((prev) => ({
      ...prev,
      title: cleanTitle,
      slug: cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-"),
      seoKeywords: topic.keywords?.join(", ") || "",
    }))

    try {
      // Make sure both title and hook are provided
      if (!cleanTitle || !topic.hook) {
        setSubmitStatus({
          type: "error",
          message: "Missing title or hook for content generation. Please try another topic.",
        })
        setAiGenerationStep("idle")
        return
      }

      // Auto-generate content based on selected topic
      const result = await generateAIBlogPost({
        title: cleanTitle,
        hook: topic.hook,
        targetKeywords: topic.keywords || [],
        tone: "controversial",
        wordCount: 1500,
      })

      console.log("AI Blog Post Generation Result:", result)

      if (result?.success && result.blog) {
        console.log("Blog data received:", result.blog)

        // Force update with setTimeout to ensure state changes properly
        setTimeout(() => {
          setFormData((prev) => {
            console.log("Updating form data with:", {
              title: result.blog.title || cleanTitle, // Use generated title or fallback to cleanTitle
              slug: result.blog.slug || prev.slug, // Use generated slug or keep existing
              content: result.blog.content || "",
              excerpt: result.blog.excerpt || "",
              category: result.blog.category?.toLowerCase() || "customer-service", // Normalize category case
              seoTitle: result.blog.seoTitle || "",
              seoDescription: result.blog.seoDescription || "",
              seoKeywords: Array.isArray(result.blog.seoKeywords)
                ? result.blog.seoKeywords.join(", ")
                : result.blog.seoKeywords || prev.seoKeywords, // Handle array conversion
              readTime: result.blog.readTime || 0,
            })

            return {
              ...prev,
              title: result.blog.title || cleanTitle, // Keep the title from AI or use cleaned topic title
              slug: result.blog.slug || prev.slug, // Keep the slug from AI or use existing
              content: result.blog.content || "",
              excerpt: result.blog.excerpt || "",
              category: result.blog.category?.toLowerCase() || "customer-service", // Normalize category case
              seoTitle: result.blog.seoTitle || "",
              seoDescription: result.blog.seoDescription || "",
              seoKeywords: Array.isArray(result.blog.seoKeywords)
                ? result.blog.seoKeywords.join(", ")
                : result.blog.seoKeywords || prev.seoKeywords, // Properly convert array to string
              readTime: result.blog.readTime || 0,
            }
          })
          setAiGenerationStep("complete")
        }, 100)
      } else {
        console.error("Failed to generate content:", result)
        setSubmitStatus({
          type: "error",
          message: result?.error || "Failed to generate content. Please try again.",
        })
        setAiGenerationStep("idle")
      }
    } catch (error) {
      console.error("Error generating content:", error)
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to generate content. Please try again.",
      })
      setAiGenerationStep("idle")
    }
  }

  const handleRegenerateContent = async () => {
    if (!selectedTopic) return

    setAiGenerationStep("generating")
    try {
      // Make sure both title and hook are provided
      if (!formData.title || !selectedTopic.hook) {
        setSubmitStatus({
          type: "error",
          message: "Missing title or hook for content regeneration.",
        })
        setAiGenerationStep("idle")
        return
      }

      const result = await generateAIBlogPost({
        title: formData.title, // Use current form title
        hook: selectedTopic.hook,
        targetKeywords: selectedTopic.keywords || [],
        tone: "controversial",
        wordCount: 1500,
      })

      console.log("AI Blog Post Regeneration Result:", result)

      if (result?.success && result.blog) {
        console.log("Regenerated blog data:", result.blog)

        // Force update with setTimeout
        setTimeout(() => {
          setFormData((prev) => {
            console.log("Updating form data for regeneration")
            return {
              ...prev,
              content: result.blog.content || prev.content,
              excerpt: result.blog.excerpt || prev.excerpt,
              category: result.blog.category?.toLowerCase() || prev.category, // Normalize category case
              seoTitle: result.blog.seoTitle || prev.seoTitle,
              seoDescription: result.blog.seoDescription || prev.seoDescription,
              seoKeywords: Array.isArray(result.blog.seoKeywords)
                ? result.blog.seoKeywords.join(", ")
                : result.blog.seoKeywords || prev.seoKeywords, // Properly convert array to string
              readTime: result.blog.readTime || prev.readTime,
            }
          })
          setAiGenerationStep("complete")
        }, 100)
      } else {
        console.error("Failed to regenerate content:", result)
        setSubmitStatus({
          type: "error",
          message: result?.error || "Failed to regenerate content. Please try again.",
        })
        setAiGenerationStep("idle")
      }
    } catch (error) {
      console.error("Error regenerating content:", error)
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to regenerate content. Please try again.",
      })
      setAiGenerationStep("idle")
    }
  }

  useEffect(() => {
    if (error) {
      setSubmitStatus({ type: "error", message: error })
    } else if (success) {
      setSubmitStatus({ type: "success", message: success })
      // Reset form on success
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        featuredImage: "",
        featured: false,
        status: "draft",
        seoTitle: "",
        seoDescription: "",
        seoKeywords: "",
        readTime: 0,
      })
      setSelectedImageFile(null)
      setImagePreviewUrl("")
      setSelectedTopic(null)
      setAiGenerationStep("idle")
    }
    const timer = setTimeout(() => clearMessages(), 5000)
    return () => clearTimeout(timer)
  }, [error, success, clearMessages])

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData((prev) => {
        const newState = { ...prev, [id]: value }
        if (id === "title") {
          newState.slug = generateSlug(value)
        }
        return newState
      })
    },
    [generateSlug],
  )

  const handleSwitchChange = useCallback((checked: boolean, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }, [])

  const handleImageFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setSubmitStatus({ type: "error", message: "Please select a valid image file." })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({ type: "error", message: "Image file size must be less than 5MB." })
        return
      }

      setSelectedImageFile(file)
      setImagePreviewUrl(URL.createObjectURL(file))
      setFormData((prev) => ({ ...prev, featuredImage: "" }))
    }
  }, [])

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData((prev) => ({ ...prev, featuredImage: url }))

    if (url) {
      setSelectedImageFile(null)
      setImagePreviewUrl(url)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } else {
      setImagePreviewUrl("")
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setSelectedImageFile(null)
    setImagePreviewUrl("")
    setFormData((prev) => ({ ...prev, featuredImage: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    setSubmitStatus({ type: null, message: null })

    if (!isAuthenticated || !user?.is_clayo_admin) {
      setSubmitStatus({ type: "error", message: "You are not authorized to perform this action." })
      return
    }

    if (!formData.title || !formData.slug || !formData.content || !formData.category) {
      setSubmitStatus({ type: "error", message: "Title, Slug, Content, and Category are required fields." })
      return
    }

    const postData: CreateBlogPostBody = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || undefined,
      content: formData.content,
      category: formData.category || undefined,
      featuredImage: formData.featuredImage || undefined,
      status: formData.status,
      seoTitle: formData.seoTitle || undefined,
      seoDescription: formData.seoDescription || undefined,
      seoKeywords: formData.seoKeywords
        ? formData.seoKeywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k.length > 0)
        : undefined,
      readTime: formData.readTime > 0 ? formData.readTime : undefined,
    }

    await createPost(postData, selectedImageFile || undefined)
  }

  // Show loading until user verification is complete
  if (userLoading || !userVerified) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>{userLoading ? "Verifying user permissions..." : "Loading..."}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user?.is_clayo_admin) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p>{submitStatus.message || "You are not authorized to view this page."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <Link
          to="/admin/blog"
          className="flex items-center gap-2 text-lg font-semibold hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Blog Management
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)} disabled={isLoading}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button
            size="sm"
            type="submit"
            form="blog-post-form"
            disabled={isLoading || aiGenerationStep === "generating"}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Article
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        {/* AI-First Start Section */}
        {!selectedTopic && (
          <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-16 w-16 text-blue-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Start with AI-Powered Ideas</h2>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Get controversial, attention-grabbing blog topics tailored to your AI customer service platform
              </p>
              <Button
                onClick={handleShowTopicSuggestions}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loadingTopics}
              >
                {loadingTopics ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Loading Ideas...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate AI Topic Ideas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* AI Generation Progress */}
        {selectedTopic && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {aiGenerationStep === "generating" && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                  {aiGenerationStep === "complete" && <CheckCircle className="h-5 w-5 text-green-600" />}
                  <div>
                    <h3 className="font-medium text-gray-900">AI-Generated Content</h3>
                    <p className="text-sm text-gray-600">
                      {aiGenerationStep === "generating" && "Generating content..."}
                      {aiGenerationStep === "complete" && "Content generated successfully! You can edit below."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {aiGenerationStep === "complete" && (
                    <Button variant="outline" size="sm" onClick={handleRegenerateContent} disabled={isLoading}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTopic(null)
                      setAiGenerationStep("idle")
                      setFormData({
                        title: "",
                        slug: "",
                        excerpt: "",
                        content: "",
                        category: "",
                        featuredImage: "",
                        featured: false,
                        status: "draft",
                        seoTitle: "",
                        seoDescription: "",
                        seoKeywords: "",
                        readTime: 0,
                      })
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start Over
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="col-span-2 space-y-6">
            {submitStatus.message && (
              <div
                className={`p-4 rounded-lg text-sm border ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Basic Information
                  {!selectedTopic && (
                    <Button variant="outline" size="sm" onClick={handleShowTopicSuggestions} disabled={loadingTopics}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Ideas
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form id="blog-post-form" onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="flex items-center justify-between">
                      Title *{titleExists === false && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {titleExists === true && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter article title"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={isLoading || aiGenerationStep === "generating"}
                      required
                      className={titleExists === true ? "border-orange-300" : ""}
                    />
                    {titleExists === true && (
                      <p className="text-xs text-orange-600 mt-1">A similar title already exists</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="auto-generated-from-title"
                      value={formData.slug}
                      onChange={handleChange}
                      disabled={isLoading || aiGenerationStep === "generating"}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      rows={3}
                      placeholder="A short summary for search results and previews..."
                      value={formData.excerpt}
                      onChange={handleChange}
                      disabled={isLoading || aiGenerationStep === "generating"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                      disabled={isLoading || aiGenerationStep === "generating"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer-service">Customer Service</SelectItem>
                        <SelectItem value="ai-automation">AI & Automation</SelectItem>
                        <SelectItem value="product-updates">Product Updates</SelectItem>
                        <SelectItem value="industry-insights">Industry Insights</SelectItem>
                        <SelectItem value="case-studies">Case Studies</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="readTime">Read Time (minutes)</Label>
                    <Input
                      id="readTime"
                      type="number"
                      placeholder="e.g., 5"
                      value={formData.readTime || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, readTime: Number.parseInt(e.target.value) || 0 }))
                      }
                      min="0"
                      disabled={isLoading || aiGenerationStep === "generating"}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {imagePreviewUrl ? (
                    <ImagePreview
                      file={selectedImageFile}
                      url={imagePreviewUrl}
                      onRemove={handleRemoveImage}
                      disabled={isLoading || aiGenerationStep === "generating"}
                    />
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Drag & drop your image here, or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, WebP up to 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={isLoading || aiGenerationStep === "generating"}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || aiGenerationStep === "generating"}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </>
                  )}
                </div>

                <div className="relative">
                  <Label htmlFor="featuredImageURL">Or paste an image URL</Label>
                  <Input
                    id="featuredImageURL"
                    placeholder="https://example.com/image.jpg"
                    value={formData.featuredImage}
                    onChange={handleImageUrlChange}
                    disabled={isLoading || aiGenerationStep === "generating"}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Mark as Featured</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange(checked, "featured")}
                    disabled={isLoading || aiGenerationStep === "generating"}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value as "draft" | "published" | "archived" }))
                    }
                    disabled={isLoading || aiGenerationStep === "generating"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || aiGenerationStep === "generating"}
                    type="button"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || aiGenerationStep === "generating"}
                    type="button"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || aiGenerationStep === "generating"}
                    type="button"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || aiGenerationStep === "generating"}
                    type="button"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || aiGenerationStep === "generating"}
                    type="button"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isLoading || aiGenerationStep === "generating"}
                    type="button"
                  >
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  id="content"
                  rows={15}
                  placeholder="Start writing your article content here... Supports Markdown."
                  value={formData.content}
                  onChange={handleChange}
                  disabled={isLoading || aiGenerationStep === "generating"}
                  required
                />
                {selectedTopic && aiGenerationStep === "complete" && (
                  <div className="flex items-center justify-between text-sm text-gray-600 bg-green-50 p-2 rounded">
                    <span>✨ AI-generated content ready for editing</span>
                    <Button variant="ghost" size="sm" onClick={handleRegenerateContent} disabled={isLoading}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    placeholder="SEO optimized title..."
                    value={formData.seoTitle}
                    onChange={handleChange}
                    disabled={isLoading || aiGenerationStep === "generating"}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
                </div>
                <div>
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="SEO meta description..."
                    rows={3}
                    value={formData.seoDescription}
                    onChange={handleChange}
                    disabled={isLoading || aiGenerationStep === "generating"}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
                </div>
                <div>
                  <Label htmlFor="seoKeywords">Keywords</Label>
                  <Input
                    id="seoKeywords"
                    placeholder="keyword1, keyword2, keyword3"
                    value={formData.seoKeywords}
                    onChange={handleChange}
                    disabled={isLoading || aiGenerationStep === "generating"}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Topic Suggestions Dialog */}
      <Dialog open={showTopicSuggestions} onOpenChange={setShowTopicSuggestions}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                AI-Generated Topic Ideas
              </div>
              <Button variant="outline" size="sm" onClick={handleGenerateMoreTopics} disabled={loadingTopics}>
                {loadingTopics ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate More
                  </>
                )}
              </Button>
            </DialogTitle>
            <DialogDescription>
              Choose a controversial, attention-grabbing topic for your AI customer service blog post
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {loadingTopics ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2">Generating fresh topic ideas...</span>
              </div>
            ) : (
              topicSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleSelectTopic(suggestion)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 flex-1 pr-4">{suggestion.title}</h3>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Wand2 className="h-4 w-4 mr-1" />
                      Use This
                    </Button>
                  </div>
                  <p className="text-gray-600 mb-3">{suggestion.hook}</p>
                  {suggestion.keywords && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {suggestion.keywords.map((keyword, kidx) => (
                        <Badge key={kidx} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {suggestion.controversy && (
                    <p className="text-sm text-orange-600 font-medium">💥 {suggestion.controversy}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
