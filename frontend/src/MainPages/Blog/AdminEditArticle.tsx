"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
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
  Trash2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Import the blog service hook and its types
import { useBlogService, type UpdateBlogPostBody } from "../../Hooks/useBlogService"
// Import user context for authentication and admin check
import { useUser } from "../../Auth/Contexts/UserContext"

interface FormData extends Partial<UpdateBlogPostBody> {
  featured: boolean
  seoKeywords: string
  readTime: number
  tags?: string[]
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

  // Reset states when url changes
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
          crossOrigin="anonymous"
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

export default function AdminEditArticlePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // State for form data, initialized with empty values
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [] as string[],
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
  const [newTag, setNewTag] = useState("")
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({
    type: null,
    message: null,
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize the blog service hook and user context
  const { getBlogPostById, updatePost, deletePost, isLoading, error, success, clearMessages } = useBlogService()
  const { isAuthenticated, user, isLoading: userLoading } = useUser()

  // --- Client-side Admin Access Check ---
  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated) {
        setSubmitStatus({ type: "error", message: "You must be logged in to access this page." })
      } else if (!user?.is_clayo_admin) {
        setSubmitStatus({ type: "error", message: "You are not authorized to edit blog posts." })
      }
    }
  }, [userLoading, isAuthenticated, user, navigate])

  // --- Fetch Post Data on Component Mount and ID Change ---
  useEffect(() => {
    const fetchPost = async () => {
      if (id && isAuthenticated && user?.is_clayo_admin) {
        clearMessages()
        setSubmitStatus({ type: null, message: null })

        const post = await getBlogPostById(id)
        if (post) {
          setFormData({
            title: post.title || "",
            slug: post.slug || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            category: post.category || "",
            tags: post.tags || [],
            featuredImage: post.featured_image_url || "", // Fix field name mismatch
            featured: post.featured || false,
            status: post.status,
            seoTitle: post.seo_title || "", // Fix field name mismatch
            seoDescription: post.seo_description || "", // Fix field name mismatch
            seoKeywords: Array.isArray(post.seo_keywords) ? post.seo_keywords.join(", ") : post.seo_keywords || "",
            readTime: post.read_time || 0, // Fix field name mismatch
          })

          // Set image preview URL if there's a featured image
          if (post.featured_image_url) {
            setImagePreviewUrl(post.featured_image_url)
          }
        } else {
          setSubmitStatus({ type: "error", message: "Blog post not found or you don't have access." })
        }
      }
    }

    if (id) {
      fetchPost()
    }
  }, [id, getBlogPostById, isAuthenticated, user, navigate, clearMessages])

  // --- Handle API Response Feedback ---
  useEffect(() => {
    if (error) {
      setSubmitStatus({ type: "error", message: error })
    } else if (success) {
      setSubmitStatus({ type: "success", message: success })
    }
    const timer = setTimeout(() => clearMessages(), 5000)
    return () => clearTimeout(timer)
  }, [error, success, clearMessages])

  // Auto-generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }, [])

  // Handle input changes, including auto-slug generation
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Handle select changes for category and status
  const handleSelectChange = useCallback((value: string, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }, [])

  // Handle switch changes
  const handleSwitchChange = useCallback((checked: boolean, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: checked }))
  }, [])

  // Handle adding a new tag
  const handleAddTag = useCallback(() => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag("")
    }
  }, [newTag, formData.tags])

  // Handle removing a tag
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }))
  }, [])

  // Handle image file change
  const handleImageFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setSubmitStatus({ type: "error", message: "Please select a valid image file." })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({ type: "error", message: "Image file size must be less than 5MB." })
        return
      }

      setSelectedImageFile(file)
      setImagePreviewUrl(URL.createObjectURL(file))
      // Clear any URL that was manually entered
      setFormData((prev) => ({ ...prev, featuredImage: "" }))
    }
  }, [])

  // Handle image URL change
  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData((prev) => ({ ...prev, featuredImage: url }))

    if (url) {
      // Clear file selection when URL is entered
      setSelectedImageFile(null)
      setImagePreviewUrl(url)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } else {
      setImagePreviewUrl("")
    }
  }, [])

  // Handle removing image
  const handleRemoveImage = useCallback(() => {
    setSelectedImageFile(null)
    setImagePreviewUrl("")
    setFormData((prev) => ({ ...prev, featuredImage: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  // --- Handle Update Submission ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    clearMessages()
    setSubmitStatus({ type: null, message: null })

    if (!id) {
      setSubmitStatus({
        type: "error",
        message: "No post ID found for update. Please ensure you are editing an existing post.",
      })
      return
    }
    if (!isAuthenticated || !user?.is_clayo_admin) {
      setSubmitStatus({ type: "error", message: "You are not authorized to update blog posts." })
      return
    }

    if (!formData.title || !formData.slug || !formData.content || !formData.category) {
      setSubmitStatus({ type: "error", message: "Title, Slug, Content, and Category are required fields." })
      return
    }

    const updateData: UpdateBlogPostBody = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || undefined,
      content: formData.content,
      category: formData.category || undefined,
      tags: formData.tags && formData.tags.length > 0 ? formData.tags : undefined,
      featuredImage: formData.featuredImage || undefined,
      status: formData.status as UpdateBlogPostBody["status"],
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

    // Call updatePost with the image file if one is selected
    await updatePost(id, updateData, selectedImageFile || undefined)
  }

  // --- Handle Delete Post ---
  const handleDelete = async () => {
    if (!id) {
      setSubmitStatus({ type: "error", message: "No post ID found for deletion." })
      return
    }
    if (!isAuthenticated || !user?.is_clayo_admin) {
      setSubmitStatus({ type: "error", message: "You are not authorized to delete blog posts." })
      return
    }

    clearMessages()
    setSubmitStatus({ type: null, message: null })
    setDeleteDialogOpen(false)

    const deleted = await deletePost(id)
    if (deleted) {
      setSubmitStatus({ type: "success", message: "Blog post deleted successfully!" })
      // Short delay before navigation to show success message
      setTimeout(() => navigate("/admin/blog"), 1500)
    }
  }

  // Show loading state
  if (userLoading || (id && !formData.title && !error && !success && !submitStatus.message)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>{userLoading ? "Loading user data..." : "Loading blog post data..."}</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated or not an admin
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

  // If no ID is provided
  if (!id) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>No article ID provided for editing.</p>
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
          {formData.slug && (
            <Link to={`/blog/${formData.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Public
              </Button>
            </Link>
          )}
          <Button size="sm" type="submit" form="edit-blog-post-form" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Article
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isLoading}
            className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Article
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="col-span-2 space-y-6">
            {/* Submission Status Message */}
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

            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form id="edit-blog-post-form" onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter article title"
                      value={formData.title || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      placeholder="auto-generated-from-title"
                      value={formData.slug || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      rows={3}
                      placeholder="A short summary for search results and previews..."
                      value={formData.excerpt || ""}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category || ""}
                      onValueChange={(value) => handleSelectChange(value, "category")}
                    >
                      <SelectTrigger disabled={isLoading}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="safety">Safety</SelectItem>
                        <SelectItem value="sustainability">Sustainability</SelectItem>
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
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="newTag"
                        placeholder="Add a new tag (e.g., IMO, Digitalization)"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                        disabled={isLoading || !newTag.trim()}
                      >
                        Add Tag
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(formData.tags || []).map((tag, index) => (
                        <Badge
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center"
                        >
                          {tag}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={() => handleRemoveTag(tag)}
                            aria-label={`Remove ${tag} tag`}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Featured Image Card */}
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
                      disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
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
                    value={formData.featuredImage || ""}
                    onChange={handleImageUrlChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Mark as Featured</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleSwitchChange(checked, "featured")}
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 space-y-6">
            {/* Status & Visibility Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status || "draft"}
                    onValueChange={(value) => handleSelectChange(value, "status")}
                  >
                    <SelectTrigger disabled={isLoading}>
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

            {/* Content Editor Card */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <Button variant="outline" size="sm" disabled={isLoading} type="button">
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLoading} type="button">
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLoading} type="button">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLoading} type="button">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLoading} type="button">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={isLoading} type="button">
                    <Hash className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  id="content"
                  rows={15}
                  placeholder="Start writing your article content here... Supports Markdown."
                  value={formData.content || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </CardContent>
            </Card>

            {/* SEO Settings */}
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
                    value={formData.seoTitle || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoTitle?.length || 0}/60 characters</p>
                </div>

                <div>
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    placeholder="SEO meta description..."
                    rows={3}
                    value={formData.seoDescription || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seoDescription?.length || 0}/160 characters</p>
                </div>

                <div>
                  <Label htmlFor="seoKeywords">Keywords</Label>
                  <Input
                    id="seoKeywords"
                    placeholder="keyword1, keyword2, keyword3"
                    value={formData.seoKeywords || ""}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the article and remove all associated data from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isLoading ? "Deleting..." : "Delete Article"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
