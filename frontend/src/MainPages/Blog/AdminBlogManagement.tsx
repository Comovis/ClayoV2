"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom" // Using react-router-dom Link
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Calendar,
  User,
  FileText,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import the blog service hook and user context
import { useBlogService, BlogPost } from "../../Hooks/useBlogService"
import { useUser } from "../../Auth/Contexts/UserContext"

export default function AdminBlogManagementPage() {
  const [activeTab, setActiveTab] = useState("all-posts")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [posts, setPosts] = useState<BlogPost[]>([]) // State to hold live blog posts
  // State for displaying submission feedback (success/error messages)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null, message: string | null }>({ type: null, message: null });

  // Initialize the blog service hook and user context
  const {
    getAllPostsForAdmin,
    deletePost,
    isLoading,
    error,
    success,
    clearMessages,
  } = useBlogService();
  const { isAuthenticated, user, isLoading: userLoading } = useUser();

  // --- Client-side Admin Access Check ---
  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated) {
        setSubmitStatus({ type: 'error', message: "You must be logged in to access this page." });
        // Optionally, redirect to login page here if not using a protected route setup
        // router.push('/login');
      } else if (!user?.is_clayo_admin) {
          setSubmitStatus({ type: 'error', message: "You are not authorized to view this page." });
          // Optionally, redirect to a different page for unauthorized users
          // router.push('/dashboard');
      }
    }
  }, [userLoading, isAuthenticated, user]); // Depend on userLoading, isAuthenticated, user

  // --- Fetch Blog Posts ---
  useEffect(() => {
    const fetchPosts = async () => {
      // Only fetch if user is authenticated and is an admin
      if (isAuthenticated && user?.is_clayo_admin) {
        const fetchedPosts = await getAllPostsForAdmin();
        if (fetchedPosts) {
          setPosts(fetchedPosts);
        }
      }
    };
    fetchPosts();
  }, [isAuthenticated, user, getAllPostsForAdmin]); // Re-fetch when authentication status or user details change

  // --- Handle API Response Feedback ---
  useEffect(() => {
      if (error) {
          setSubmitStatus({ type: 'error', message: error });
      } else if (success) {
          setSubmitStatus({ type: 'success', message: success });
      }
      // Automatically clear success/error messages after a few seconds
      const timer = setTimeout(() => clearMessages(), 5000); // Clear after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer on component unmount or re-render
  }, [error, success, clearMessages]);

  // --- Delete Post Handler ---
  const handleDeletePost = useCallback(async (postId: string) => {
    // Client-side authorization check before attempting deletion
    if (!isAuthenticated || !user?.is_clayo_admin) {
        setSubmitStatus({ type: 'error', message: "You are not authorized to perform this action." });
        return;
    }

    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
        clearMessages(); // Clear any existing messages
        setSubmitStatus({ type: null, message: null }); // Clear local status

        const deleted = await deletePost(postId);
        if (deleted) {
            // Update local state to remove the deleted post instantly
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
            setSubmitStatus({ type: 'success', message: "Blog post deleted successfully!" });
        } else {
            // Error is already set by the hook and handled by the useEffect above
        }
    }
  }, [isAuthenticated, user, deletePost, clearMessages]);

  // Helper to format date
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

  // Helper to get category color (kept from your original file)
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

  // Filtering and searching logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.author_name?.toLowerCase().includes(searchTerm.toLowerCase()); // Also search by author name
    const matchesCategory = filterCategory === "all" || post.category?.toLowerCase() === filterCategory.toLowerCase();
    const matchesStatus = filterStatus === "all" || post.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Show loading/unauthorized states
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  // If user is not authenticated or not an admin, display an unauthorized message
  if (!isAuthenticated || !user?.is_clayo_admin) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <p>{submitStatus.message || "You are not authorized to view this page."}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
        <h1 className="text-lg font-semibold">Blog Management</h1>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/admin/blog/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create New Article
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all-posts">All Posts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
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
                <SelectTrigger className="w-[180px]">
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
                <div className={`p-4 rounded-lg text-sm ${submitStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} border ${submitStatus.type === 'success' ? 'border-green-200' : 'border-red-200'}`}>
                    {submitStatus.message}
                </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Blog Articles</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Published At</TableHead>
                    <TableHead>Read Time</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p>Loading blog posts...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && filteredPosts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No blog posts found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <Link to={`/admin/blog/edit/${post.id}`} className="hover:text-blue-600">
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(post.category)}>
                          {post.category ? post.category.charAt(0).toUpperCase() + post.category.slice(1) : "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.status === "published" ? "default" : "outline"}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{post.author_name || "Clayo Team"}</TableCell> {/* Use author_name from backend */}
                      <TableCell>{formatDate(post.published_at)}</TableCell> {/* Use published_at from backend */}
                      <TableCell>{post.read_time || 'N/A'} min</TableCell> {/* Use read_time from backend */}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Public View Link */}
                            <Link to={`/blog/${post.slug}`} target="_blank">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Public
                              </DropdownMenuItem>
                            </Link>
                            {/* Edit Link */}
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/blog/edit/${post.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/* Delete Action */}
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePost(post.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </div>
  )
}