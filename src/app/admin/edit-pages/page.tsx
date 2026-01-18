"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';
import { getAllPages, getContactInfo, updatePage, upsertContactInfo } from "@/lib/controllers/dynamic-pages";
import { PlusCircle, Trash2 } from 'lucide-react';
import { ContactInfo } from "@/app/(dashboard)/pages/contacts/page";
import * as monaco from 'monaco-editor';

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const saveContent = async (page: string, content: string) => {
  await updatePage(page, content);
  return new Promise(resolve => setTimeout(resolve, 1000));
};

const htmlSuggestions = [
  { label: '<h1>', insertText: '<h1>$1</h1>' },
  { label: '<p>', insertText: '<p>$1</p>' },
  { label: '<a>', insertText: '<a href="$1">$2</a>' },
  { label: '<ul>', insertText: '<ul>\n  <li>$1</li>\n</ul>' },
  { label: '<ol>', insertText: '<ol>\n  <li>$1</li>\n</ol>' },
  { label: '<strong>', insertText: '<strong>$1</strong>' },
  { label: '<em>', insertText: '<em>$1</em>' },
  { label: '<img>', insertText: '<img src="$1" alt="$2" />' },
  { label: '<div>', insertText: '<div>\n  $1\n</div>' },
  { label: '<span>', insertText: '<span>$1</span>' },
];

const initialContactInfo: ContactInfo = {
  id: 1,
  title: "Contact Information",
  description: "Get in touch with us using the information below.",
  address: '123 Gaming Street, Pixel City, 12345',
  email: 'support@gamegrid.com',
  phone: '+1 (555) 123-4567',
  formTitle: "Get in Touch",
  formDescription: "We'd love to hear from you. Please fill out this form and we'll get back to you as soon as possible.",
  socialTitle: "Follow Us",
  socialLinks: [
    { platform: 'facebook', url: 'https://facebook.com/gamegrid' },
    { platform: 'twitter', url: 'https://twitter.com/gamegrid' },
    { platform: 'instagram', url: 'https://instagram.com/gamegrid' },
  ]
};

export default function PolicyEditorPage() {
  const [selectedPage, setSelectedPage] = useState("about");
  const [pageContents, setPageContents] = useState<{[key: string]: string}>({
    "about": "",
    "contact": "",
    "cookies": "",
    "dmca": "",
    "terms": "",
    "privacy": ""
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (selectedPage === "contact") {
        await upsertContactInfo(contactInfo);
      } else {
        await saveContent(selectedPage, pageContents[selectedPage]);
      }
    } catch (error) {
      console.error(
        selectedPage === "contact"
          ? `Failed to update contacts: ${error}`
          : `Failed to save content: ${error}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setPageContents(prev => ({
        ...prev,
        [selectedPage]: value
      }));
    }
  };

  const handleContactInfoChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    setContactInfo(prev => {
      const newLinks = [...prev.socialLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, socialLinks: newLinks };
    });
  };

  const addSocialLink = () => {
    setContactInfo(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }));
  };

  const removeSocialLink = (index: number) => {
    setContactInfo(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pages = await getAllPages();
        const contents: { [key: string]: string } = {};
        pages.forEach((page: { slug: string; content: string }) => {
          contents[page.slug] = page.content;
        });
        setPageContents(contents);
        const contacts = await getContactInfo();
        if (contacts.title) {
          setContactInfo(contacts);
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchPages();
  }, [])

  return (
    <div className="space-y-6 p-6 md:p-8 bg-background text-foreground">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Policy & Content Editor</h1>
        <p className="text-muted-foreground mt-2">Manage dynamic pages, contact information, and policies</p>
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl font-semibold text-foreground">
            Edit Pages & Policies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Label htmlFor="page-select" className="text-sm font-semibold text-foreground block mb-3">Select Page</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger id="page-select" className="bg-muted border-border text-foreground">
                  <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="about">About Us</SelectItem>
                  <SelectItem value="contact">Contact Us</SelectItem>
                  <SelectItem value="cookies">Cookies Policy</SelectItem>
                  <SelectItem value="dmca">DMCA Policy</SelectItem>
                  <SelectItem value="terms">Terms of Service</SelectItem>
                  <SelectItem value="privacy">Privacy Policy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              {selectedPage === "contact" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium text-foreground block mb-2">Title</Label>
                      <Input
                        id="title"
                        value={contactInfo.title}
                        onChange={(e) => handleContactInfoChange('title', e.target.value)}
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <Label htmlFor="formTitle" className="text-sm font-medium text-foreground block mb-2">Form Title</Label>
                      <Input
                        id="formTitle"
                        value={contactInfo.formTitle}
                        onChange={(e) => handleContactInfoChange('formTitle', e.target.value)}
                        className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {selectedPage === "contact" ? (
            <div className="space-y-6 border-t border-border pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-foreground block mb-2">Description</Label>
                  <Textarea
                    id="description"
                    value={contactInfo.description}
                    onChange={(e) => handleContactInfoChange('description', e.target.value)}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="formDescription" className="text-sm font-medium text-foreground block mb-2">Form Description</Label>
                  <Textarea
                    id="formDescription"
                    value={contactInfo.formDescription}
                    onChange={(e) => handleContactInfoChange('formDescription', e.target.value)}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Label htmlFor="address" className="text-sm font-medium text-foreground block mb-2">Address</Label>
                  <Input
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) => handleContactInfoChange('address', e.target.value)}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground block mb-2">Email</Label>
                  <Input
                    id="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground block mb-2">Phone</Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="socialTitle" className="text-sm font-medium text-foreground block mb-2">Social Media Title</Label>
                <Input
                  id="socialTitle"
                  value={contactInfo.socialTitle}
                  onChange={(e) => handleContactInfoChange('socialTitle', e.target.value)}
                  className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                <Label className="text-sm font-medium text-foreground block">Social Media Links</Label>
                <div className="text-xs text-muted-foreground">Use a short platform name (e.g., Facebook) and the full URL.</div>
                {contactInfo.socialLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-2 items-center">
                    <Input
                      placeholder="Platform (e.g., Facebook)"
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    />
                    <Input
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      className="bg-muted border-border text-foreground placeholder:text-muted-foreground w-full"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addSocialLink}
                  className="w-full bg-muted border-border text-foreground hover:bg-muted/80"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Social Link
                </Button>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="edit" className="w-full border-t border-border pt-6">
              <TabsList className="bg-muted mb-4">
                <TabsTrigger value="edit" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Edit</TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-0">
                <div className="h-[600px] border border-border rounded-lg overflow-hidden bg-muted">
                  <MonacoEditor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={pageContents[selectedPage]}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'on',
                      suggestOnTriggerCharacters: true,
                      quickSuggestions: true,
                    }}
                    beforeMount={(monaco) => {
                      monaco.languages.setLanguageConfiguration('html', {
                        autoClosingPairs: [
                          { open: '<', close: '>' },
                          { open: '"', close: '"' },
                          { open: "'", close: "'" }
                        ],
                        brackets: [
                          ['<', '>']
                        ]
                      });
                      monaco.languages.registerCompletionItemProvider('html', {
                        provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
                          const suggestions = htmlSuggestions.map((item) => ({
                            label: item.label,
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: item.insertText,
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            range: {
                              startLineNumber: position.lineNumber,
                              startColumn: position.column,
                              endLineNumber: position.lineNumber,
                              endColumn: position.column
                            }
                          }));

                          return {
                            suggestions: suggestions,
                            incomplete: false
                          };
                        }
                      });
                    }}
                  />
                </div>
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                <div className="border border-border p-6 h-[600px] overflow-auto rounded-lg bg-muted prose prose-invert max-w-none text-foreground">
                  <div dangerouslySetInnerHTML={{ __html: pageContents[selectedPage] }} />
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex justify-end gap-3 border-t border-border pt-6 mt-6">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}