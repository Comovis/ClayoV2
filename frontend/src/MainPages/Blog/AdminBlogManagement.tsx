"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Edit, Trash2, Eye, ImageIcon, TrendingUp, Loader2, AlertCircle, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Import the blog service hook and user context
import { useBlogService, type BlogPost } from "../../Hooks/useBlogService"
import { useUser } from "../../Auth/Contexts/UserContext"

// Image thumbnail component for the table
const ImageThumbnail: React.FC<{ src: string | null; alt: string }> = ({ src, alt }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  if (!src || imageError) {
    return (
      <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded">
        <ImageIcon className="h-5 w-5 text-gray-400" />
      </div>
    )
  }

  return (
    <div className="relative w-12 h-12">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="w-12 h-12 object-cover rounded"
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        crossOrigin="anonymous"
      />
    </div>
  )
}

export default function AdminBlogManagementPage() {
  const [activeTab, setActiveTab] = useState("all-posts")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [topicIdeasOpen, setTopicIdeasOpen] = useState(false)

  // State for displaying submission feedback
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error" | null; message: string | null }>({
    type: null,
    message: null,
  })

  // Initialize the blog service hook and user context
  const { getAllPostsForAdmin, deletePost, isLoading, error, success, clearMessages } = useBlogService()
  const { isAuthenticated, user, isLoading: userLoading } = useUser()

  // --- Client-side Admin Access Check ---
  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated) {
        setSubmitStatus({ type: "error", message: "You must be logged in to access this page." })
      } else if (!user?.is_clayo_admin) {
        setSubmitStatus({ type: "error", message: "You are not authorized to view this page." })
      }
    }
  }, [userLoading, isAuthenticated, user])

  // --- Fetch Blog Posts ---
  useEffect(() => {
    const fetchPosts = async () => {
      // Only fetch if user is authenticated and is an admin
      if (isAuthenticated && user?.is_clayo_admin) {
        const fetchedPosts = await getAllPostsForAdmin()
        if (fetchedPosts) {
          setPosts(fetchedPosts)
        }
      }
    }
    fetchPosts()
  }, [isAuthenticated, user, getAllPostsForAdmin])

  // --- Handle API Response Feedback ---
  useEffect(() => {
    if (error) {
      setSubmitStatus({ type: "error", message: error })
    } else if (success) {
      setSubmitStatus({ type: "success", message: success })
    }
    // Automatically clear success/error messages after a few seconds
    const timer = setTimeout(() => clearMessages(), 5000)
    return () => clearTimeout(timer)
  }, [error, success, clearMessages])

  // --- Delete Post Handler ---
  const handleDeletePost = useCallback(
    async (postId: string) => {
      // Client-side authorization check before attempting deletion
      if (!isAuthenticated || !user?.is_clayo_admin) {
        setSubmitStatus({ type: "error", message: "You are not authorized to perform this action." })
        return
      }

      clearMessages()
      setSubmitStatus({ type: null, message: null })
      setDeleteDialogOpen(false)

      const deleted = await deletePost(postId)
      if (deleted) {
        // Update local state to remove the deleted post instantly
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
        setSubmitStatus({ type: "success", message: "Blog post deleted successfully!" })
      }
      // Reset the post to delete
      setPostToDelete(null)
    },
    [isAuthenticated, user, deletePost, clearMessages],
  )

  const handleGenerateTopics = () => {
    setTopicIdeasOpen(true)
  }

  // Helper to format date
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

  // Helper to get category color
  const getCategoryColor = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case "compliance":
        return "bg-blue-100 text-blue-800"
      case "technology":
        return "bg-green-100 text-green-800"
      case "operations":
        return "bg-yellow-100 text-yellow-800"
      case "safety":
        return "bg-red-100 text-red-800"
      case "sustainability":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filtering and searching logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || post.category?.toLowerCase() === filterCategory.toLowerCase()
    const matchesStatus = filterStatus === "all" || post.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Show loading/unauthorized states
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading user data...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated or not an admin, display an unauthorized message
  if (!isAuthenticated || !user?.is_clayo_admin) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p>{submitStatus.message || "You are not authorized to view this page."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <h1 className="text-lg font-semibold">Blog Management</h1>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleGenerateTopics} disabled={isLoading}>
            <Lightbulb className="h-4 w-4 mr-2" />
            AI Topic Ideas
          </Button>
          <Link to="/admin/blog/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create New Article
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all-posts">All Posts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-9 w-full md:w-[220px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="sustainability">Sustainability</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all-posts" className="space-y-6">
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

            <Card>
              <CardHeader>
                <CardTitle>All Blog Articles</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Published At</TableHead>
                        <TableHead>Read Time</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex items-center justify-center space-x-2">
                              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                              <p>Loading blog posts...</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!isLoading && filteredPosts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No blog posts found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id} className="group">
                          <TableCell className="p-4">
                            <ImageThumbnail src={post.featured_image_url || "/placeholder.svg"} alt={post.title} />
                          </TableCell>
                          <TableCell className="font-medium p-4">
                            <Link to={`/admin/blog/edit/${post.id}`} className="hover:text-blue-600">
                              {post.title}
                            </Link>
                          </TableCell>
                          <TableCell className="p-4">
                            <Badge className={getCategoryColor(post.category)}>
                              {post.category
                                ? post.category.charAt(0).toUpperCase() + post.category.slice(1)
                                : "Uncategorized"}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-4">
                            <Badge variant={post.status === "published" ? "default" : "outline"}>
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-4">{post.author_name || "Clayo Team"}</TableCell>
                          <TableCell className="p-4">{formatDate(post.published_at)}</TableCell>
                          <TableCell className="p-4">{post.read_time || "N/A"} min</TableCell>
                          <TableCell className="p-4">
                            <div className="flex items-center gap-1">
                              {/* View Public Button */}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                <Link to={`/blog/${post.slug}`} target="_blank" title="View Public">
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>

                              {/* Edit Button */}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                <Link to={`/admin/blog/edit/${post.id}`} title="Edit">
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>

                              {/* Delete Button */}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setPostToDelete(post.id)
                                  setDeleteDialogOpen(true)
                                }}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-500">Detailed analytics and insights coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
              onClick={() => postToDelete && handleDeletePost(postToDelete)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isLoading ? "Deleting..." : "Delete Article"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Topic Ideas Dialog */}
      <Dialog open={topicIdeasOpen} onOpenChange={setTopicIdeasOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AI Topic Ideas</DialogTitle>
            <DialogDescription>
              Here are some topic ideas generated by AI to inspire your next blog post.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Feature coming soon...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
