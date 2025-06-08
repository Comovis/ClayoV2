import React from 'react';
import { Button, Textarea } from '@components/ui';
import { v4 as uuidv4 } from 'uuid'; // Unique identifier for filenames
import { supabase } from '../../supabaseClient'; // Supabase client setup

const RichTextEditor = ({ value, onChange }) => {
  const blogBucket = 'blog'; // Supabase storage bucket for blog images

  // Upload image to Supabase storage
  const uploadImageToSupabase = async (file) => {
    const uniqueFileName = `${uuidv4()}.${file.name.split('.').pop()}`; // Generate unique file name
    const filePath = `blog_images/${uniqueFileName}`;

    const { data, error } = await supabase.storage.from(blogBucket).upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error.message);
      throw new Error('Image upload failed');
    }

    // Return the file path for image URL generation
    return filePath;
  };

  // Handle image paste event
  const handlePaste = async (event) => {
    const clipboardItems = event.clipboardData.items;
    for (const item of clipboardItems) {
      if (item.type.startsWith('image')) {
        const file = item.getAsFile();
        if (file) {
          try {
            // Upload image to Supabase and generate the URL
            const uploadedImagePath = await uploadImageToSupabase(file);

            // Generate public URL from Supabase storage
            const { data: publicUrlData, error } = supabase.storage
              .from(blogBucket)
              .getPublicUrl(uploadedImagePath);

            if (error) {
              throw new Error('Failed to generate image URL');
            }

            const imageUrl = publicUrlData.publicUrl;

            // Insert the image URL into the content
            const updatedContent = `${value}\n![Image](${imageUrl})\n`;
            onChange(updatedContent);
          } catch (error) {
            console.error('Error pasting image:', error.message);
          }
        }
      }
    }
  };

  return (
    <div>
      <div className="mb-2">
        <Button type="button" onClick={() => onChange(`${value} **bold text** `)} className="mr-2">B</Button>
        <Button type="button" onClick={() => onChange(`${value} *italic text* `)} className="mr-2">I</Button>
        <Button type="button" onClick={() => onChange(`${value} [link text](https://example.com)`)}>Link</Button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className="w-full"
        onPaste={handlePaste} // Attach paste event listener
      />
    </div>
  );
};

export default RichTextEditor;
