import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Check, Upload, RefreshCw, Image as ImageIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const BANNERS = [
  {
    id: 'bandeau',
    name: 'Bandeau',
    url: 'https://raw.githubusercontent.com/MatheoWY/signatures/main/bandeau.png'
  },
  {
    id: 'bandeau2',
    name: 'Bandeau 2',
    url: 'https://raw.githubusercontent.com/MatheoWY/signatures/main/bandeau%202.png'
  }
];

const Signatures = () => {
  const [formData, setFormData] = useState({
    firstName: "Mathéo",
    lastName: "MARNAC",
    jobTitle: "Chargé de la Stratégie Digitale & Marketing",
    mobile: "06 72 01 74 23",
    photoUrl: "", // URL from GitHub
    bannerId: "bandeau",
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (value: string) => {
    setFormData((prev) => ({ ...prev, bannerId: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('firstName', formData.firstName);
    uploadData.append('lastName', formData.lastName);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur d'upload");
      }

      const data = await res.json();
      if (data.rawUrl) {
        setFormData(prev => ({ ...prev, photoUrl: data.rawUrl }));
        toast.success("Photo uploadée avec succès !");
      } else {
        throw new Error("URL invalide reçue du serveur");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'upload de l'image sur GitHub.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copySignature = () => {
    if (!previewRef.current) return;
    
    try {
      const range = document.createRange();
      range.selectNode(previewRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      toast.success("Signature copiée ! Vous pouvez la coller dans vos paramètres.");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la copie.");
    }
  };

  const copyHtml = () => {
    if (!previewRef.current) return;
    navigator.clipboard.writeText(previewRef.current.innerHTML).then(() => {
      toast.success("Code HTML copié !");
    });
  };

  const selectedBanner = BANNERS.find(b => b.id === formData.bannerId) || BANNERS[0];

  // Constants for styles
  const colors = {
    pink: "#e4007e",
    text: "#222222",
    muted: "#666666",
  };

  // URLs for static assets (Icons)
  // Using the raw github urls found or stable public URLs
  const ICON_BASE_URL = "https://raw.githubusercontent.com/MatheoWY/signatures/main/icones";
  const icons = {
    linkedin: `${ICON_BASE_URL}/linkedin.png`,
    facebook: `${ICON_BASE_URL}/facebook.png`,
    globe: `${ICON_BASE_URL}/site.png`,
    phone: "https://img.icons8.com/ios-glyphs/30/ffffff/phone.png", // White phone icon for pink bg
    badge: "https://www.workandyou.fr/wp-content/uploads/2018/10/logo-workandyou.png" // W&Y Logo
  };

  // Default avatar if none uploaded
  const defaultAvatar = "https://raw.githubusercontent.com/MatheoWY/signatures/main/Photos%20signatures%20(19)%20(1).png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Générateur de Signature
          </h1>
          <p className="text-muted-foreground">
            Créez votre signature officielle Work&You conforme à la charte graphique.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Fonction</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile (Optionnel)</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    placeholder="06 12 34 56 78"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Photo de profil (GitHub)</Label>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </div>
                    {isUploading && <RefreshCw className="animate-spin h-5 w-5 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    L'image sera uploadée sur le dépôt GitHub public pour être accessible dans les emails.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Choix de la bannière</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.bannerId} onValueChange={handleBannerChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BANNERS.map((banner) => (
                    <div key={banner.id}>
                      <RadioGroupItem value={banner.id} id={banner.id} className="peer sr-only" />
                      <Label
                        htmlFor={banner.id}
                        className="flex flex-col gap-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <img 
                          src={banner.url} 
                          alt={banner.name}
                          className="w-full h-auto rounded-sm object-cover aspect-[3/1]" 
                        />
                        <span className="text-sm font-medium text-center">{banner.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Preview Column */}
          <div className="space-y-6">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Aperçu & Export</CardTitle>
                <CardDescription>
                  Le rendu est optimisé pour Outlook, Gmail et Apple Mail.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white overflow-x-auto mb-6">
                  {/* Signature HTML Structure */}
                  <div ref={previewRef} style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '14px', color: colors.text, lineHeight: '1.4' }}>
                    <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          {/* LEFT COLUMN: Avatar + Socials */}
                          <td style={{ verticalAlign: 'top', paddingRight: '20px', width: '120px', textAlign: 'center' }}>
                            {/* Avatar Container */}
                            <div style={{ position: 'relative', width: '112px', margin: '0 auto' }}>
                              <img 
                                src={formData.photoUrl || defaultAvatar} 
                                alt={`${formData.firstName} ${formData.lastName}`}
                                width="112"
                                style={{
                                  display: 'block',
                                  width: '112px',
                                  height: '112px',
                                  objectFit: 'contain',
                                  backgroundColor: '#f3f4f6',
                                }}
                              />
                            </div>

                            {/* Spacer */}
                            <div style={{ height: '12px' }}></div>

                            {/* Social Icons Row */}
                            <table cellPadding="0" cellSpacing="0" align="center" style={{ margin: '0 auto' }}>
                              <tbody>
                                <tr>
                                  <td style={{ padding: '0 4px' }}>
                                    <a href="https://www.linkedin.com/company/work&you/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                      <img src={icons.linkedin} width="28" height="28" alt="LinkedIn" style={{ display: 'block' }} />
                                    </a>
                                  </td>
                                  <td style={{ padding: '0 4px' }}>
                                    <a href="https://www.workandyou.fr" style={{ textDecoration: 'none', display: 'block' }}>
                                      <img src={icons.globe} width="28" height="28" alt="Site" style={{ display: 'block' }} />
                                    </a>
                                  </td>
                                  <td style={{ padding: '0 4px' }}>
                                    <a href="https://www.facebook.com/workandyou" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                      <img src={icons.facebook} width="28" height="28" alt="Facebook" style={{ display: 'block' }} />
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>

                          {/* RIGHT COLUMN: Info */}
                          <td style={{ verticalAlign: 'top', paddingLeft: '20px', borderLeft: `2px solid ${colors.pink}` }}>
                            {/* Name & Title */}
                            <div style={{ marginBottom: '8px' }}>
                              <span style={{ color: colors.pink, fontWeight: 'bold', fontSize: '16px' }}>
                                {formData.firstName}
                              </span>
                              <span style={{ color: colors.pink, fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', marginLeft: '4px' }}>
                                {formData.lastName}
                              </span>
                              <span style={{ color: colors.pink, margin: '0 8px', fontWeight: 'bold' }}>|</span>
                              <span style={{ color: '#000000', fontWeight: 'bold', fontSize: '14px' }}>
                                {formData.jobTitle}
                              </span>
                            </div>

                            {/* Static Services Line */}
                            <div style={{ fontSize: '13px', color: '#000000', marginBottom: '12px' }}>
                              Cabinet de Recrutement <span style={{ color: '#999999' }}>|</span> Formation <span style={{ color: '#999999' }}>|</span> Événementiel <span style={{ color: '#999999' }}>|</span> Conseil RH
                            </div>

                            {/* Mobile/Phone */}
                            {formData.mobile && (
                              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ 
                                  width: '20px', 
                                  height: '20px', 
                                  backgroundColor: colors.pink, 
                                  borderRadius: '50%', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  marginRight: '8px'
                                }}>
                                  <img src={icons.phone} width="10" height="10" alt="Tel" style={{ display: 'block' }} />
                                </div>
                                <a href={`tel:${formData.mobile.replace(/\s/g, '')}`} style={{ color: '#000000', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                                  {formData.mobile}
                                </a>
                              </div>
                            )}

                            {/* Banner */}
                            <div style={{ marginTop: '8px' }}>
                              <a href="https://www.workandyou.fr">
                                <img 
                                  src={selectedBanner.url} 
                                  alt="Work&You Banner" 
                                  style={{ display: 'block', width: '100%', maxWidth: '380px', borderRadius: '4px' }}
                                />
                              </a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={copySignature} className="flex-1 bg-primary hover:bg-primary/90 h-12 text-lg">
                    <Copy className="mr-2 h-5 w-5" />
                    Copier la signature
                  </Button>
                  <Button variant="outline" onClick={copyHtml} className="flex-1 h-12">
                    <Check className="mr-2 h-5 w-5" />
                    Copier le HTML
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signatures;
