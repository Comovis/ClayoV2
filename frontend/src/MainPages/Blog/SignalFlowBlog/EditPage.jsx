import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Save, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { useUser } from '../../Auth/Contexts/UserContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../Auth/SupabaseAuth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Convert base64 to File object
const base64ToFile = (base64String, fileName) => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
};

// Extract base64 images from content, upload to Supabase, and replace with URLs
const extractAndUploadBase64Images = async (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const imgElements = doc.getElementsByTagName('img');
  const uploadedImageUrls = [];

  for (let img of imgElements) {
    const src = img.getAttribute('src');

    // Check if the src is a base64-encoded image
    if (src.startsWith('data:image')) {
      const uniqueId = uuidv4();
      const fileExt = src.substring(src.indexOf('/') + 1, src.indexOf(';'));
      const fileName = `${uniqueId}.${fileExt}`;
      const file = base64ToFile(src, fileName);

      // Upload the file to Supabase
      const { data, error } = await supabase.storage
        .from('blog')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error.message);
        throw new Error('Image upload failed');
      }

      // Get the public URL of the uploaded file
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from('blog')
        .getPublicUrl(fileName);

      if (publicUrlError || !publicUrlData?.publicUrl) {
        console.error('Failed to generate image URL:', publicUrlError);
        throw new Error('Failed to generate image URL');
      }

      // Replace base64 image with the public URL in the content
      img.setAttribute('src', publicUrlData.publicUrl);

      // Store the relative image URL for the database
      uploadedImageUrls.push(fileName);
    }
  }

  return {
    updatedContent: doc.body.innerHTML, // Return the updated content with URLs
    uploadedImageUrls,
  };
};

const RichTextEditor = ({ value, onChange }) => {
  const quillRef = useRef(null);

  // Modules for the editor
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image']
    ],
  };

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      theme="snow"
    />
  );
};

const EditPage = () => {
  const { accessToken, user } = useUser();
  const navigate = useNavigate(); // Initialize useNavigate

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (content) {
      const textContent = content.replace(/<[^>]+>/g, '');
      setMetaDescription(textContent.slice(0, 150));
    }
  }, [content]);

  useEffect(() => {
    if (category || tags) {
      const keywords = [category, ...tags.split(',').map(tag => tag.trim())].filter(Boolean);
      setMetaKeywords(keywords.join(', '));
    }
  }, [category, tags]);

  const handlePublish = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!accessToken || !user) {
      setError('User not authenticated');
      return;
    }

    try {
      const apiBaseUrl = import.meta.env.MODE === 'development'
        ? import.meta.env.VITE_DEVELOPMENT_URL
        : import.meta.env.VITE_API_URL;

      // Extract base64 images and replace them with URLs
      const { updatedContent, uploadedImageUrls } = await extractAndUploadBase64Images(content);
      
      const payload = {
        title,
        content: updatedContent,  // Use the content with image URLs
        category,
        tags: tags.split(',').map(tag => tag.trim()),
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        author_id: user.id,
        image_url: uploadedImageUrls,  // Send the image file paths as an array
      };

      const response = await fetch(`${apiBaseUrl}/api/create-blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish the article');
      }

      // Navigate to the blog page after successful publish
      navigate('/blog'); // Redirect to blog list
    } catch (error) {
      setError(error.message);
    }
  };

  const PreviewDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Eye className="mr-2 h-4 w-4" /> Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>{title || 'Article Preview'}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>{title || 'Edit Article'}</title>
        <meta name="description" content={metaDescription || 'Editing an article'} />
        <meta name="keywords" content={metaKeywords || 'blog, article, editing'} />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      <div className="space-y-6">
        {error && <div className="text-red-500">{error}</div>}
        {successMessage && <div className="text-green-500">{successMessage}</div>}

        <div>
          <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title"
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</Label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="grid grid-cols-2 gap-4">

       <div>
        <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</Label>
        <Select onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
      <SelectContent>
  <SelectItem value="solana">Solana</SelectItem>
  <SelectItem value="blockchain-technology">Blockchain Technology</SelectItem>
  <SelectItem value="crypto-trading">Crypto Trading</SelectItem>
  <SelectItem value="token-monitoring">Token Monitoring</SelectItem>
  <SelectItem value="signal-detection">Signal Detection</SelectItem>
  <SelectItem value="defi">Decentralized Finance (DeFi)</SelectItem>
  <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
  <SelectItem value="market-analysis">Market Analysis</SelectItem>
  <SelectItem value="blockchain-trends">Blockchain Trends</SelectItem>
  <SelectItem value="crypto-investing">Crypto Investing</SelectItem>
  <SelectItem value="transaction-processing">Transaction Processing</SelectItem>
  <SelectItem value="trading-strategies">Trading Strategies</SelectItem>
  <SelectItem value="solana-projects">Solana Projects</SelectItem>
  <SelectItem value="tokenomics">Tokenomics</SelectItem>
  <SelectItem value="blockchain-security">Blockchain Security</SelectItem>
  <SelectItem value="ai-in-crypto">AI in Crypto</SelectItem>
  <SelectItem value="crypto-news">Crypto News</SelectItem>
  <SelectItem value="blockchain-development">Blockchain Development</SelectItem>
  <SelectItem value="decentralized-apps">Decentralized Apps (DApps)</SelectItem>
  <SelectItem value="nft">Non-Fungible Tokens (NFTs)</SelectItem>
  <SelectItem value="crypto-signals">Crypto Signals</SelectItem>
  <SelectItem value="wallet-growth">Wallet Growth Analysis</SelectItem>
  <SelectItem value="market-capitalization">Market Capitalization</SelectItem>
  <SelectItem value="liquidity-analysis">Liquidity Analysis</SelectItem>
  <SelectItem value="buy-sell-ratio">Buy-to-Sell Ratio</SelectItem>
  <SelectItem value="emerging-tokens">Emerging Tokens</SelectItem>
  <SelectItem value="blockchain-scaling">Blockchain Scaling</SelectItem>
  <SelectItem value="investor-insights">Investor Insights</SelectItem>
  <SelectItem value="crypto-education">Crypto Education</SelectItem>
</SelectContent>

        </Select>
      </div>


          <div>
            <Label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button onClick={handlePublish}>
            <Save className="mr-2 h-4 w-4" /> Publish
          </Button>
          <PreviewDialog />
        </div>
      </div>
    </div>
  );
};

export default EditPage;
