"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { UserList } from "@/components/admin/user-list";
import { listAllUsers, promoteUser } from "@/lib/controllers/users";
import { getMeta, insertMeta, saveFavIcon } from "@/lib/controllers/meta";
import { deleteHeadScript, deleteScript, getAdSettings, getAllHeadScripts, getAllScripts, parseElementAttributesFromText, saveHeadScript, saveScript, updateAdSettings } from "@/lib/controllers/ads";
import { toast, Toaster } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdTypeSettings } from '@/components/ad-type-settings';
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadFavIcon } from "@/lib/services/storage-services";
import { AdSettings } from "@/types/ads";
import { SavedScript, HeaderScript } from "@/types/script";


export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUserList, setShowUserList] = useState(false);
  const [showAdSettings, setShowAdSettings] = useState(false);
  const [isMetadataModified, setIsMetadataModified] = useState(false);
  const [showAdSenseSettings, setShowAdSenseSettings] = useState(false);
  const [adSenseScript, setAdSenseScript] = useState("");
  const [adSenseScriptName, setAdSenseScriptName] = useState("");
  const [adSenseTargetElement, setAdSenseTargetElement] = useState("");
  const [adSenseInjectionPosition, setAdSenseInjectionPosition] = useState("before");
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>([]);
  const [editingScript, setEditingScript] = useState<SavedScript | null>(null);
  const [showHeaderScripts, setShowHeaderScripts] = useState(false);
  const [headerScripts, setHeaderScripts] = useState<HeaderScript[]>([]);
  const [newHeaderScript, setNewHeaderScript] = useState<HeaderScript>({ id: 0, name: '', script: '' });
  const [editingHeaderScript, setEditingHeaderScript] = useState<HeaderScript | null>(null);
  const [reload, setReload] = useState(false);
  const router = useRouter();

  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");

  const [adSettings, setAdSettings] = useState<AdSettings>({
    google_client_id: "",
    carousel_ad_frequency: 5,
    carousel_ad_slot: "",
    carousel_ad_format: "auto",
    carousel_ad_full_width: true,
    sidebar_ad_slot: "",
    sidebar_ad_format: "auto",
    sidebar_ad_full_width: false,
    game_view_ad_slot: "",
    game_view_ad_format: "auto",
    game_view_ad_full_width: true,
    comment_section_ad_slot: "",
    comment_section_ad_format: "auto",
    comment_section_ad_full_width: true,
    show_carousel_ads: true,
    show_sidebar_ads: true,
    show_game_view_ads: true,
    show_comment_section_ads: true,
    sidebar_ad_count: 2
  });

  const [faviconUrls, setFaviconUrls] = useState({
    favicon: null,
    svg: null,
    favicon16: null,
    favicon32: null,
    androidChrome192: null,
    androidChrome512: null,
    appleTouchIcon: null,
  });

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }
  
    try {
      // Upload favicon
      const response = await uploadFavIcon(file);
      if (response.error) {
        console.error(`Error uploading favIcon: ${response.error}`);
        toast.error(`Error uploading favicon: ${response.error}`);
        return;
      }
  
      // Save favicon
      if (response.url) {
        const saveResponse = await saveFavIcon(type, response.url);
        if (saveResponse.status !== 200) {
          console.error(`Error saving favIcon: ${saveResponse.status}`);
          return;
        }
  
        // Update favicon URLs
        const base64Result = await convertFileToBase64(file);
        if (base64Result) {
          setFaviconUrls((prev) => ({ ...prev, [type]: base64Result }));
        }
      }
    } catch (error) {
      console.error("Unexpected error in handleFaviconUpload: ", error);
      toast.error("An unexpected error occurred while uploading the favicon.");
    }
  };
  
  const convertFileToBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          resolve(null);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };  


  useEffect(() => {
    async function fetchUsers() {
      const result = await listAllUsers(currentPage);
      if ('error' in result) {
        console.error(result.error);
      } else {
        const users = result.users;
        const total = result.total;
        setUsers(users);
        setTotalPages(total);
      }
    }
    const fetchScripts = async () => {
      const adScripts = await getAllScripts();
      if (adScripts.status === 200 && adScripts.data) {
        setSavedScripts(adScripts.data);
      } else {
        toast.error("Error fetching AdSense scripts");
      }

      const headScripts = await getAllHeadScripts();
      if (headScripts.data) {
        setHeaderScripts(headScripts.data);
      } else {
        toast.error("Error fetching header scripts");
      }
    };

    fetchScripts();
    fetchUsers();
  }, [currentPage, reload]);

  useEffect(() => {
    const fetch = async () => {
      const {data, error} = await getMeta();
      if (error) {
        toast.error('Error fetching site metadata');
      }
      if (data !== null && !isMetadataModified) {
        setSiteTitle(data.site_name);
        setSiteDescription(data.description);
      }
      setIsMetadataModified(false);
    }
    fetch();
  }, [isMetadataModified]);

  useEffect(() => {
    const fetchAdSettings = async () => {
      const { data, error } = await getAdSettings();
      if (error) {
        if (error.code === 'PGRST116' || data === null) {
          toast.error('No settings created yet!');
        } else {
          toast.error('Error fetching ad settings');
        }
      }
      if (data !== null) {
        setAdSettings(data);
      }
    }
    fetchAdSettings();
  }, []);

  const handleDeleteUser = async (id: string) => {
    const result = await listAllUsers(currentPage);
    if ('error' in result) {
      console.error(result.error);
    } else {
      setUsers(result.users);
      setTotalPages(result.total);
    }
  };

  const handlePromoteUser = async (id: string) => {
    const res = await promoteUser(id);
    setReload(!reload);
    if (!res.success) {
      console.error(res.message);
    }
  };

  const saveSiteMeta = async () => {
    const res = await insertMeta(siteTitle, siteDescription);
    if (res.error) {
      console.error(`error inserting metadata: ${res.error}`)
    }

    toast.success(`Site meta saved successfully`);
    setReload(!reload);
  };

  const saveAdSettings = async () => {
    const res = await updateAdSettings(adSettings);
    if (res.error) {
      console.error(`error updating ad settings: ${res.error}`);
      toast.error('Error updating ad settings');
    } else {
      toast.success('Ad settings saved successfully');
    }
  };

  const saveAdSenseScript = async () => {
    const parsedElement = await parseElementAttributesFromText(adSenseTargetElement);
    const pushScript: SavedScript = {
      id: "create",
      name: adSenseScriptName,
      element: adSenseTargetElement,
      position: adSenseInjectionPosition,
      parsedElement: parsedElement,
      script: adSenseScript
    };
    const response = await saveScript(pushScript);
    if (response.message) {
      toast.error('Error saving the script');
      console.error(response.message);
    } else if (response.data) {
      setSavedScripts([...savedScripts, response.data]);
      toast.success("Successfully saved the script");
      setAdSenseScriptName("");
      setAdSenseScript("");
      setAdSenseTargetElement("");
      setAdSenseInjectionPosition("before");
    }
  };

  const updateSavedScript = async (updatedScript: SavedScript) => {
    const parsedElement = await parseElementAttributesFromText(updatedScript.element);
    const pushScript: SavedScript = {
      id: updatedScript.id,
      name: updatedScript.name,
      element: updatedScript.element,
      position: updatedScript.position,
      parsedElement: parsedElement,
      script: updatedScript.script
    };
    console.log(pushScript)
    const response = await saveScript(pushScript);
    if (response.message) {
      toast.error('Error updated the script');
      console.error(response.message);
    } else if (response.data) {
      // setSavedScripts([...savedScripts, response.data]);
      setReload(!reload);
      router.refresh();
      toast.success("Successfully updated the script!");
      setAdSenseScriptName("");
      setAdSenseScript("");
      setAdSenseTargetElement("");
      setAdSenseInjectionPosition("before");
    }
  };

  const deleteSavedScript = async (id: string) => {
    const {status, message} = await deleteScript(id);
    if (status === 200) {
      setReload(!reload);
      setSavedScripts(savedScripts.filter((script) => script.id !== id));
      toast.success("AdSense script deleted successfully");
    } else {
      console.error(message);
      toast.error("Error deleting script");
    }
  };

  const createHeaderScript = async () => {
    const newScript = { ...newHeaderScript, id: -1 };
    const {data, error} = await saveHeadScript(newScript);
    if (error) {
      toast.error(error);
    }
    setHeaderScripts([...headerScripts, newScript]);
    setNewHeaderScript({ id: 0, name: '', script: '' });
    toast.success("Header script created successfully");
  };

  const updateHeaderScript = async (updatedScript: HeaderScript) => {
    const {data, error} = await saveHeadScript(updatedScript);
    if (error) {
      toast.error(error);
    } else if (data) {
      setHeaderScripts(headerScripts.map(script => 
        script.id === data.id ? data : script
      ));
      setEditingHeaderScript(null);
      toast.success("Header script updated successfully");
    }
  };

  const deleteHeaderScript = async (id: number) => {
    const response = await deleteHeadScript(id);
    if (response.status === 200) {
      setHeaderScripts(headerScripts.filter((script) => script.id !== id));
      toast.success("Header script deleted successfully");
    } else {
      toast.error("Error deleting script");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-900 to-purple-900 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
        Settings
      </h1>

      {/* General Settings */}
      <Card className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="site-title" className="text-white">
              Site Name
            </Label>
            <Input
              id="site-title"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="Enter your site name"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="site-description" className="text-white">
              Site Description
            </Label>
            <Textarea
              id="site-description"
              value={siteDescription}
              onChange={(e) => {
                setSiteDescription(e.target.value)
              }}
              placeholder="Enter your site description"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            onClick={async () => {
              await saveSiteMeta()
              setIsMetadataModified(true)
            }}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Favicon Settings */}
      <Card className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Favicon Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="favicon" className="text-white">Favicon (ICO)</Label>
            <Input
              id="favicon"
              type="file"
              accept=".ico"
              onChange={(e) => handleFaviconUpload(e, 'favicon')}
              className="border-white"
            />
            {faviconUrls.favicon && <img src={faviconUrls.favicon} alt="Favicon" className="w-8 h-8" />}
          </div>
          {/* <div className="flex flex-col space-y-2">
            <Label htmlFor="favicon-svg" className="text-white">Favicon (SVG)</Label>
            <Input
              id="favicon-svg"
              type="file"
              accept=".svg"
              onChange={(e) => handleFaviconUpload(e, 'svg')}
              className="border-gray-300"
            />
            {faviconUrls.svg && <img src={faviconUrls.svg} alt="Favicon SVG" className="w-8 h-8" />}
          </div> */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="favicon-16" className="text-white">Favicon 16x16 (PNG)</Label>
            <Input
              id="favicon-16"
              type="file"
              accept=".png"
              onChange={(e) => handleFaviconUpload(e, 'favicon16')}
              className="border-gray-300"
            />
            {faviconUrls.favicon16 && <img src={faviconUrls.favicon16} alt="Favicon 16x16" className="w-4 h-4" />}
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="favicon-32" className="text-white">Favicon 32x32 (PNG)</Label>
            <Input
              id="favicon-32"
              type="file"
              accept=".png"
              onChange={(e) => handleFaviconUpload(e, 'favicon32')}
              className="border-gray-300"
            />
            {faviconUrls.favicon32 && <img src={faviconUrls.favicon32} alt="Favicon 32x32" className="w-8 h-8" />}
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="android-chrome-192" className="text-white">Android Chrome 192x192 (PNG)</Label>
            <Input
              id="android-chrome-192"
              type="file"
              accept=".png"
              onChange={(e) => handleFaviconUpload(e, 'androidChrome192')}
              className="border-gray-300"
            />
            {faviconUrls.androidChrome192 && <img src={faviconUrls.androidChrome192} alt="Android Chrome 192x192" className="w-12 h-12" />}
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="android-chrome-512" className="text-white">Android Chrome 512x512 (PNG)</Label>
            <Input
              id="android-chrome-512"
              type="file"
              accept=".png"
              onChange={(e) => handleFaviconUpload(e, 'androidChrome512')}
              className="border-gray-300"
            />
            {faviconUrls.androidChrome512 && <img src={faviconUrls.androidChrome512} alt="Android Chrome 512x512" className="w-16 h-16" />}
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="apple-touch-icon" className="text-white">Apple Touch Icon (PNG)</Label>
            <Input
              id="apple-touch-icon"
              type="file"
              accept=".png"
              onChange={(e) => handleFaviconUpload(e, 'appleTouchIcon')}
              className="border-gray-300"
            />
            {faviconUrls.appleTouchIcon && <img src={faviconUrls.appleTouchIcon} alt="Apple Touch Icon" className="w-16 h-16" />}
          </div>
        </CardContent>
      </Card>
      {/* User Management */}
      <Card className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader
          className="cursor-pointer flex flex-row items-center justify-between"
          onClick={() => setShowUserList(!showUserList)}
        >
          <CardTitle className="text-xl font-semibold text-white">User Management</CardTitle>
          {showUserList ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white">Manage users and their access levels.</p>
          {showUserList && (
            <UserList
              users={users}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onDelete={handleDeleteUser}
              onPromote={handlePromoteUser}
            />
          )}
        </CardContent>
      </Card>

      {/* Header Script Management */}
      <Card className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader
          className="cursor-pointer flex flex-row items-center justify-between"
          onClick={() => setShowHeaderScripts(!showHeaderScripts)}
        >
          <CardTitle className="text-xl font-semibold text-white">Header Script Management</CardTitle>
          {showHeaderScripts ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
        </CardHeader>
        <CardContent className="space-y-4">
          {showHeaderScripts && (
            <>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="header-script-name" className="text-white">Script Name</Label>
                <Input
                  id="header-script-name"
                  value={newHeaderScript.name}
                  onChange={(e) => setNewHeaderScript({...newHeaderScript, name: e.target.value})}
                  placeholder="Enter a name for this header script"
                  className="border-gray-300"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="header-script-content" className="text-white">Script Content</Label>
                <Textarea
                  id="header-script-content"
                  value={newHeaderScript.script}
                  onChange={(e) => setNewHeaderScript({...newHeaderScript, script: e.target.value})}
                  placeholder="Enter the header content like meta tags or scripts."
                  className="border-gray-300 min-h-[150px]"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onClick={createHeaderScript}
              >
                Add Header Script
              </Button>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Saved Header Scripts</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {headerScripts.map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>{script.name}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingHeaderScript(script)}>
                                  <Pencil className="h-4 w-4 mr-2"/>
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Header Script</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-header-name" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="edit-header-name"
                                      value={editingHeaderScript?.name || ''}
                                      onChange={(e) => setEditingHeaderScript(prev => prev ? {...prev, name: e.target.value} : null)}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-header-content" className="text-right">
                                      Content
                                    </Label>
                                    <Textarea
                                      id="edit-header-content"
                                      value={editingHeaderScript?.script || ''}
                                      onChange={(e) => setEditingHeaderScript(prev => prev ? {...prev, script: e.target.value} : null)}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button onClick={() => editingHeaderScript && updateHeaderScript(editingHeaderScript)}>
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteHeaderScript(script.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* AdSense Script Management */}
      <Card className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader
          className="cursor-pointer flex flex-row items-center justify-between"
          onClick={() => setShowAdSenseSettings(!showAdSenseSettings)}
        >
          <CardTitle className="text-xl font-semibold text-white">Body Script Management</CardTitle>
          {showAdSenseSettings ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
        </CardHeader>
        <CardContent className="space-y-4">
          {showAdSenseSettings && (
            <>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="adsense-name" className="text-white">Script Name</Label>
                <Input
                  id="adsense-name"
                  value={adSenseScriptName}
                  onChange={(e) => setAdSenseScriptName(e.target.value)}
                  placeholder="Enter a name for this script"
                  className="border-gray-300"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="adsense-target" className="text-white">Target Element</Label>
                <Input
                  id="adsense-target"
                  value={adSenseTargetElement}
                  onChange={(e) => setAdSenseTargetElement(e.target.value)}
                  placeholder="Enter target element (e.g., <div>, <h1>)"
                  className="border-gray-300"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="adsense-position" className="text-white">Injection Position</Label>
                <Select
                  value={adSenseInjectionPosition}
                  onValueChange={(value) => setAdSenseInjectionPosition(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select injection position" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="before">Before</SelectItem>
                    <SelectItem value="after">After</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="adsense-script" className="text-white">AdSense Script</Label>
                <Textarea
                  id="adsense-script"
                  value={adSenseScript}
                  onChange={(e) => setAdSenseScript(e.target.value)}
                  placeholder="Paste your script here. Be sure to verify that your script is secure and its syntax is correct as it can be harmful to your website."
                  className="border-gray-300 min-h-[150px]"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onClick={saveAdSenseScript}
              >
                Save AdSense Script
              </Button>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Saved Scripts</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Target Element</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedScripts.map((script) => (
                      <TableRow key={script.id}>
                        <TableCell>{script.name}</TableCell>
                        <TableCell>{script.element}</TableCell>
                        <TableCell>{script.position}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setEditingScript(script)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Script</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-name" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="edit-name"
                                      value={editingScript?.name || ''}
                                      onChange={(e) => editingScript ? setEditingScript({...editingScript, name: e.target.value}) : setEditingScript({...script, name: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-element" className="text-right">
                                      Element
                                    </Label>
                                    <Input
                                      id="edit-element"
                                      value={editingScript?.element}
                                      onChange={(e) => editingScript ? setEditingScript({...editingScript, element: e.target.value}) : setEditingScript({...script, element: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-position" className="text-right">
                                      Position
                                    </Label>
                                    <Select
                                      value={editingScript?.position}
                                      onValueChange={(value) => editingScript ? setEditingScript({...editingScript, position: value}) : setEditingScript({...script, position: value})}
                                    >
                                      <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-white">
                                        <SelectItem value="before">Before</SelectItem>
                                        <SelectItem value="after">After</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-script" className="text-right">
                                      Script
                                    </Label>
                                    <Textarea
                                      id="edit-script"
                                      value={editingScript?.script}
                                      onChange={(e) => editingScript ? setEditingScript({...editingScript, script: e.target.value}) : setEditingScript({...script, script: e.target.value})}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button onClick={() => updateSavedScript(editingScript ?? script)}>
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteSavedScript(script.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Ad Management */}
      <Card className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader
          className="cursor-pointer flex flex-row items-center justify-between"
          onClick={() => setShowAdSettings(!showAdSettings)}
        >
          <CardTitle className="text-xl font-semibold text-white">Ad Management</CardTitle>
          {showAdSettings ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
        </CardHeader>
        <CardContent className="space-y-4">
          {showAdSettings && (
            <>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="google_client_id" className="text-white">Google Client ID</Label>
                <Input
                  id="google_client_id"
                  value={adSettings.google_client_id}
                  onChange={(e) => setAdSettings({...adSettings, google_client_id: e.target.value})}
                  placeholder="Enter your Google Client ID"
                  className="border-gray-300"
                />
              </div>

              <AdTypeSettings
                adType="carousel"
                settings={{
                  show: adSettings.show_carousel_ads,
                  slot: adSettings.carousel_ad_slot,
                  format: adSettings.carousel_ad_format,
                  fullWidth: adSettings.carousel_ad_full_width,
                  frequency: adSettings.carousel_ad_frequency,
                }}
                onSettingsChange={(newSettings) => setAdSettings({
                  ...adSettings,
                  show_carousel_ads: newSettings.show,
                  carousel_ad_slot: newSettings.slot,
                  carousel_ad_format: newSettings.format,
                  carousel_ad_full_width: newSettings.fullWidth,
                  carousel_ad_frequency: newSettings.frequency,
                })}
              />

              <AdTypeSettings
                adType="sidebar"
                settings={{
                  show: adSettings.show_sidebar_ads,
                  slot: adSettings.sidebar_ad_slot,
                  format: adSettings.sidebar_ad_format,
                  fullWidth: adSettings.sidebar_ad_full_width,
                  count: adSettings.sidebar_ad_count,
                }}
                onSettingsChange={(newSettings) => setAdSettings({
                  ...adSettings,
                  show_sidebar_ads: newSettings.show,
                  sidebar_ad_slot: newSettings.slot,
                  sidebar_ad_format: newSettings.format,
                  sidebar_ad_full_width: newSettings.fullWidth,
                  sidebar_ad_count: newSettings.count,
                })}
              />

              <AdTypeSettings
                adType="gameView"
                settings={{
                  show: adSettings.show_game_view_ads,
                  slot: adSettings.game_view_ad_slot,
                  format: adSettings.game_view_ad_format,
                  fullWidth: adSettings.game_view_ad_full_width,
                }}
                onSettingsChange={(newSettings) => setAdSettings({
                  ...adSettings,
                  show_game_view_ads: newSettings.show,
                  game_view_ad_slot: newSettings.slot,
                  game_view_ad_format: newSettings.format,
                  game_view_ad_full_width: newSettings.fullWidth,
                })}
              />

              <AdTypeSettings
                adType="commentSection"
                settings={{
                  show: adSettings.show_comment_section_ads,
                  slot: adSettings.comment_section_ad_slot,
                  format: adSettings.comment_section_ad_format,
                  fullWidth: adSettings.comment_section_ad_full_width,
                }}
                onSettingsChange={(newSettings) => setAdSettings({
                  ...adSettings,
                  show_comment_section_ads: newSettings.show,
                  comment_section_ad_slot: newSettings.slot,
                  comment_section_ad_format: newSettings.format,
                  comment_section_ad_full_width: newSettings.fullWidth,
                })}
              />

              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onClick={saveAdSettings}
              >
                Save Ad Settings
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <Toaster position="bottom-right" />
    </div>
  );
}