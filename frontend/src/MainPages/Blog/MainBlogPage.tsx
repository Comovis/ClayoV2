
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, FileText, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

import { useBlogService, BlogPost } from '../../Hooks/useBlogService';

interface BlogCardProps {
  post: BlogPost;
  getCategoryColor: (category: string | null) => string;
  formatDate: (dateString: string | null) => string;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, getCategoryColor, formatDate }) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={post.featured_image_url || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {post.category && (
          <div className="absolute top-4 left-4">
            <Badge className={getCategoryColor(post.category)}>
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
        <div className="flex items-center text-xs text-gray-500 mb-3">
          {post.published_at && (
            <>
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(post.published_at)}
            </>
          )}
          {post.read_time && (
            <>
              <Clock className="h-3 w-3 ml-3 mr-1" />
              {post.read_time} min read
            </>
          )}
        </div>
        {post.seo_keywords && post.seo_keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.seo_keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {keyword}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function MainBlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const {
    getPublishedPosts,
    isLoading,
    error,
    clearMessages,
  } = useBlogService();

  useEffect(() => {
    const fetchPosts = async () => {
      clearMessages();
      const fetchedPosts = await getPublishedPosts();
      if (fetchedPosts) {
        setPosts(fetchedPosts);
      }
    };
    fetchPosts();
  }, [getPublishedPosts, clearMessages]);

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return "Invalid Date";
    }
  }, []);

  const getCategoryColor = useCallback((category: string | null) => {
    switch (category?.toLowerCase()) {
      case "compliance": return "bg-blue-100 text-blue-800";
      case "technology": return "bg-green-100 text-green-800";
      case "operations": return "bg-yellow-100 text-yellow-800";
      case "safety": return "bg-red-100 text-red-800";
      case "sustainability": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (post.seo_keywords && post.seo_keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Blog - Latest Insights from Clayo</title>
        <meta
          name="description"
          content="Read the latest articles, insights, and updates from Clayo's blog. Stay informed about maritime industry trends, compliance, and technology."
        />
      </Helmet>

      <div className="mb-8 relative">
        <Input
          type="text"
          placeholder="Search articles by title, excerpt, category, or keywords..."
          className="pl-10 pr-4 py-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4 animate-pulse" />
          <p className="text-gray-600">Loading articles...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center py-12 text-red-600">
          <p>Error loading articles: {error}</p>
          <p className="mt-2 text-sm text-gray-500">Please try again later.</p>
        </div>
      )}

      {!isLoading && !error && filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? "No articles match your search criteria. Try a different search term."
              : "There are no blog articles published yet. Check back soon!"}
          </p>
          {searchQuery && (
            <Button variant="outline" className="mt-4" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              getCategoryColor={getCategoryColor}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  )
}
