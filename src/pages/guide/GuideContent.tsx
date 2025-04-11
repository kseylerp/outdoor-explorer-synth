
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GuideContent = () => {
  const [contentType, setContentType] = useState('article');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'd implement the actual saving functionality
    console.log('Saving content:', { contentType, title, content });
    alert('Content saved successfully!');
  };
  
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };
  
  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="content-type">Content Type</Label>
            <Select 
              value={contentType}
              onValueChange={setContentType}
            >
              <SelectTrigger id="content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="tip">Travel Tip</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              className="min-h-[300px]"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={togglePreview}>
            {previewVisible ? 'Edit Content' : 'Preview'}
          </Button>
          <Button type="submit">Publish Content</Button>
        </div>
      </form>
      
      {previewVisible && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">{title || 'Untitled'}</h2>
              <div className="whitespace-pre-wrap">
                {content || 'No content to preview.'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Content Writing Tips</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Focus on providing unique, insider knowledge that travelers can't easily find elsewhere.</li>
          <li>Include specific details like best times to visit, hidden spots, and local customs.</li>
          <li>Add personal anecdotes to make your content engaging and authentic.</li>
          <li>Consider including practical information like costs, transportation options, and safety tips.</li>
          <li>Use descriptive language that helps readers visualize the experience.</li>
        </ul>
      </div>
    </div>
  );
};

export default GuideContent;
