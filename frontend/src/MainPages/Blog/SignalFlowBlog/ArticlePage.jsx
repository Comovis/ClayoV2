import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@components/ui/button";
import { supabase } from '../../Auth/SupabaseAuth';
import { useUser } from '../../Auth/Contexts/UserContext';

const fallbackImageUrl = 'https://qblzmxsljsycygymepiy.supabase.co/storage/v1/object/public/misc/Screenshot%202024-09-07%20at%2019.52.24.png?t=2024-09-07T18%3A52%3A49.957Z';

const generateImageUrl = async (filePath) => {
  if (!filePath) return fallbackImageUrl;

  try {
    const { data, error } = await supabase
      .storage
      .from('blog')
      .getPublicUrl(filePath);

    if (error) {
      console.error("Error generating image URL:", error);
      return fallbackImageUrl;
    }

    return data.publicUrl;
  } catch (err) {
    console.error("Error fetching the image URL:", err);
    return fallbackImageUrl;
  }
};

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(fallbackImageUrl);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { accessToken, user } = useUser();

  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching admin status:', error);
        } else {
          setIsAdmin(data.is_admin);
        }
      }
    };

    fetchAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiBaseUrl = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_DEVELOPMENT_URL
          : import.meta.env.VITE_API_URL;

        if (!apiBaseUrl) {
          throw new Error('API base URL is undefined.');
        }

        const response = await fetch(`${apiBaseUrl}/api/blog/slug/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch the blog post');
        }

        const data = await response.json();
        setPost(data);

        if (data.image_url) {
          const generatedImageUrl = await generateImageUrl(data.image_url);
          setImageUrl(generatedImageUrl);
        } else {
          setImageUrl(fallbackImageUrl);
        }

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    const apiBaseUrl = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_DEVELOPMENT_URL
      : import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiBaseUrl}/api/delete-blog/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the blog post');
      }

      alert('Blog post deleted successfully!');
      navigate('/blog');
    } catch (error) {
      alert(`Error deleting the post: ${error.message}`);
    }
  };

  const handleEdit = () => {
    navigate(`/blog/edit/${post.id}`);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>;
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Blog post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{post.title ? `${post.title} - SignalFlow Blog` : 'SignalFlow Blog'}</title>
        <meta 
          name="description" 
          content={post.excerpt || "Read detailed insights on trading, market trends, and AI-driven analysis from SignalFlow's blog."} 
        />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title || 'SignalFlow Blog'} />
        <meta name="twitter:description" content={post.excerpt || 'Read in-depth articles and insights from SignalFlow.'} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:url" content={window.location.href} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={post.title || 'SignalFlow Blog'} />
        <meta property="og:description" content={post.excerpt || 'Explore in-depth articles on trading and AI-driven insights.'} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />

        {/* Apple/Google Meta Tags */}
        <meta name="apple-mobile-web-app-title" content={post.title || 'SignalFlow Blog'} />
        <meta name="application-name" content="SignalFlow Blog" />
      </Helmet>
      
      <div className="max-w-3xl mx-auto">
        <Button variant="link" className="mb-4" onClick={() => navigate('/blog')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Button>

        {isAdmin && (
          <div className="mb-4 flex space-x-4">
            <Button variant="destructive" onClick={handleDelete}>
              Delete Blog Post
            </Button>
            <Button variant="default" onClick={handleEdit}>
              Edit Blog Post
            </Button>
          </div>
        )}

        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-500 mb-6">{new Date(post.created_at).toLocaleDateString()}</p>
          
          {post.image_url && (
            <img 
              src={imageUrl} 
              alt={post.title} 
              className="w-full h-auto object-cover rounded-lg mb-6"
            />
          )}
          
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>
      </div>
    </div>
  );
};

// Inline styles for article content
const articleContentStyles = `
  .article-content h2 {
    @apply text-3xl font-bold mt-8 mb-4;
  }
  .article-content h3 {
    @apply text-2xl font-semibold mt-6 mb-3;
  }
  .article-content p {
    @apply mb-4 leading-relaxed;
  }
  .article-content ul, .article-content ol {
    @apply mb-4 pl-6;
  }
  .article-content li {
    @apply mb-2;
  }
  .article-content blockquote {
    @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4;
  }
`;

// Add styles to the document
const styleTag = document.createElement('style');
styleTag.textContent = articleContentStyles;
document.head.appendChild(styleTag);

export default ArticlePage;
