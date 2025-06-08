import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Search, ArrowRight } from 'lucide-react';
import { supabase } from '../../Auth/SupabaseAuth';

const fallbackImageUrl = 'https://qblzmxsljsycygymepiy.supabase.co/storage/v1/object/public/misc/Screenshot%202024-09-07%20at%2019.52.24.png?t=2024-09-07T18%3A52%3A49.957Z';

const generateImageUrl = (fileName) => {
  if (!fileName) return fallbackImageUrl;
  
  let parsedFileName = fileName;
  try {
    const parsed = JSON.parse(fileName);
    parsedFileName = Array.isArray(parsed) ? parsed[0] : parsed;
  } catch (e) {
    // If it's not JSON, use the original fileName
  }

  if (!parsedFileName) return fallbackImageUrl;

  const { data, error } = supabase.storage.from('blog').getPublicUrl(parsedFileName);
  if (error) {
    console.error("Error generating image URL:", error);
    return fallbackImageUrl;
  }
  return data.publicUrl || fallbackImageUrl;
};

const BlogCard = ({ slug, title, excerpt, image_url, created_at }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigate(`/blog/${slug}`);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${image_url}`);
    setImageError(true);
  };

  return (
    <Card className="mb-6 cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="p-0">
        <img
          src={imageError ? fallbackImageUrl : image_url}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={handleImageError}
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{new Date(created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="link" className="p-0">
          Read more <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiBaseUrl = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_DEVELOPMENT_URL
          : import.meta.env.VITE_API_URL;

        if (!apiBaseUrl) {
          throw new Error('API base URL is undefined.');
        }

        const response = await fetch(`${apiBaseUrl}/api/blog`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data = await response.json();
        const updatedPosts = data.map((post) => {
          const imageUrl = generateImageUrl(post.image_url);
          return { ...post, image_url: imageUrl };
        });

        console.log("Updated blog posts with image URLs:", updatedPosts);
        setBlogPosts(updatedPosts);
      } catch (error) {
        console.error("Error in fetchPosts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Blog - Latest Insights from SignalFlow</title>
        <meta 
          name="description" 
          content="Read the latest articles, insights, and updates from SignalFlow's blog. Stay informed about market trends, AI-driven trading, and more." 
        />
      </Helmet>
      
      <div className="mb-8 relative">
        <Input
          type="text"
          placeholder="Search articles..."
          className="pl-10 pr-4 py-2 w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            image_url={post.image_url}
            created_at={post.created_at}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
