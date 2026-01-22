import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, Shield, Truck, Loader2, Upload, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import animeCasePurple from "@/assets/anime-case-purple.png";
import animeCaseBlue from "@/assets/anime-case-blue.png";
import animeCasePink from "@/assets/anime-case-pink.png";

const trustBadges = [
  { icon: Shield, text: "Premium Materials" },
  { icon: Truck, text: "Free Worldwide Shipping" },
  { icon: Zap, text: "5-7 Day Delivery" },
];

const Product = () => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  const { addItem, isLoading: isCartLoading, getCheckoutUrl } = useCartStore();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const products = await fetchProducts(1);
        if (products.length > 0) {
          setProduct(products[0]);
          // Set first variant as default
          const firstVariant = products[0].node.variants.edges[0]?.node;
          if (firstVariant) {
            setSelectedVariant(firstVariant.id);
          }
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        toast({
          title: "Failed to load product",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProduct(false);
      }
    };
    loadProduct();
  }, [toast]);

  const getSelectedVariantData = () => {
    if (!product || !selectedVariant) return null;
    return product.node.variants.edges.find(v => v.node.id === selectedVariant)?.node;
  };

  const variantData = getSelectedVariantData();
  const isUltra = variantData?.title.includes('Ultra');
  const isPixel = variantData?.title.includes('Pixel');
  const isSamsung = variantData?.title.includes('Samsung');

  const handleAddToCart = async () => {
    if (!product || !variantData) {
      toast({
        title: "Please select a phone model",
        variant: "destructive",
      });
      return;
    }

    await addItem({
      product,
      variantId: variantData.id,
      variantTitle: variantData.title,
      price: variantData.price,
      quantity: 1,
      selectedOptions: variantData.selectedOptions || [],
      attributes: [
        { key: "Custom Image", value: previewUrls[0] || "" },
        { key: "Note", value: notes }
      ].filter(attr => attr.value)
    });

    toast({
      title: "Added to cart!",
      description: `${product.node.title} - ${variantData.title}`,
    });
  };

  const handleBuyNow = async () => {
    if (!product || !variantData) {
      toast({
        title: "Please select a phone model",
        variant: "destructive",
      });
      return;
    }

    await addItem({
      product,
      variantId: variantData.id,
      variantTitle: variantData.title,
      price: variantData.price,
      quantity: 1,
      selectedOptions: variantData.selectedOptions || [],
      attributes: [
        { key: "Custom Image", value: previewUrls[0] || "" },
        { key: "Note", value: notes }
      ].filter(attr => attr.value)
    });

    // Get checkout URL and redirect
    setTimeout(() => {
      const checkoutUrl = getCheckoutUrl();
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      }
    }, 500);
  };

  if (isLoadingProduct) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom text-center">
            <h1 className="text-3xl font-heading font-bold mb-4">No products found</h1>
            <p className="text-muted-foreground">Check back soon for our custom anime phone cases!</p>
          </div>
        </section>
      </Layout>
    );
  }

  const productImages = product
    ? [...previewUrls, ...product.node.images.edges.map(e => e.node.url), animeCasePurple, animeCaseBlue, animeCasePink]
    : [...previewUrls, animeCasePurple, animeCaseBlue, animeCasePink];

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Image */}
              <div className="relative mb-4 bg-secondary/30 rounded-2xl p-4 lg:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(270_91%_65%_/_0.1)_0%,_transparent_70%)]" />
                {productImages[selectedImage] && (
                  productImages[selectedImage].startsWith('blob:') ? (
                    <div className={`relative w-full max-w-[260px] mx-auto aspect-[9/19.5] bg-[#1a0b2e] shadow-[0_0_25px_rgba(168,85,247,0.3)] border-[8px] border-zinc-900 overflow-hidden ring-1 ring-white/20 ${isUltra ? 'rounded-xl' : 'rounded-[2.5rem]'}`}>
                      <img
                        src={productImages[selectedImage]}
                        alt="Custom Design"
                        className="w-full h-full object-cover"
                      />
                      {/* Gloss Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
                      {/* Camera Bump Placeholder */}
                      {isPixel ? (
                        /* Google Pixel Layout: Horizontal Bar - High Fidelity */
                        <div className="absolute top-8 left-0 right-0 h-10 bg-[#080808] border-y border-zinc-800 shadow-2xl flex items-center justify-between px-6 pointer-events-none z-10 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 opacity-30" />
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="h-7 px-3 rounded-full bg-[#050505] border border-zinc-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3">
                              <div className="w-4 h-4 rounded-full bg-[#000] ring-1 ring-zinc-700 shadow-[inset_0_0_4px_black]">
                                <div className="w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(50,50,150,0.3),_transparent_70%)]" />
                              </div>
                              <div className="w-4 h-4 rounded-full bg-[#000] ring-1 ring-zinc-700 shadow-[inset_0_0_4px_black]">
                                <div className="w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(50,50,150,0.3),_transparent_70%)]" />
                              </div>
                            </div>
                          </div>
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700 shadow-inner" />
                        </div>
                      ) : isSamsung ? (
                        /* Samsung Layout: Vertical Lenses - High Fidelity */
                        <div className="absolute top-4 left-4 flex gap-2 pointer-events-none select-none z-10">
                          <div className="flex flex-col gap-3">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className="w-9 h-9 rounded-full bg-[#050505] ring-1 ring-zinc-700 shadow-xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.15),_transparent_60%)]" />
                                <div className="absolute inset-1.5 rounded-full bg-[#000] shadow-[inset_0_2px_4px_black] border border-[#1a1a1a]" />
                                <div className="absolute top-[35%] left-[35%] w-1.5 h-1.5 rounded-full bg-blue-500/20 blur-[0.5px]" />
                              </div>
                            ))}
                          </div>
                          {isUltra && (
                            <div className="flex flex-col gap-5 mt-5">
                              <div className="w-7 h-7 rounded-full bg-[#050505] ring-1 ring-zinc-700 shadow-xl relative overflow-hidden">
                                <div className="absolute inset-1.5 rounded-full bg-[#000] shadow-inner" />
                                <div className="absolute top-[30%] left-[30%] w-1 h-1 rounded-full bg-white/10 blur-[0.5px]" />
                              </div>
                              <div className="w-4 h-4 rounded-full bg-[#111] ring-1 ring-zinc-600 ml-1.5 shadow-inner" /> {/* Flash/Sensor */}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* iPhone Pro Layout: CSS Camera Module */
                        <div className="absolute top-4 left-4 w-[42%] aspect-square bg-[#1c1c1c] rounded-[1.8rem] pointer-events-none shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20 overflow-hidden">
                          <div className="relative w-full h-full p-1.5">
                            {/* Top Left Lens */}
                            <div className="absolute top-1.5 left-1.5 w-[40%] aspect-square rounded-full bg-[#0a0a0a] ring-[3px] ring-[#2a2a2a] shadow-lg overflow-hidden">
                              <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0d0d15]" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,_rgba(255,255,255,0.15),_transparent_50%)]" />
                            </div>

                            {/* Top Right Lens */}
                            <div className="absolute top-1.5 right-1.5 w-[40%] aspect-square rounded-full bg-[#0a0a0a] ring-[3px] ring-[#2a2a2a] shadow-lg overflow-hidden">
                              <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0d0d15]" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,_rgba(255,255,255,0.15),_transparent_50%)]" />
                            </div>

                            {/* Bottom Center Lens */}
                            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[40%] aspect-square rounded-full bg-[#0a0a0a] ring-[3px] ring-[#2a2a2a] shadow-lg overflow-hidden">
                              <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0d0d15]" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,_rgba(255,255,255,0.15),_transparent_50%)]" />
                            </div>

                            {/* Flash */}
                            <div className="absolute top-2.5 right-[35%] w-3 h-3 rounded-full bg-[#e8d8a0]/80 shadow-[0_0_6px_rgba(255,220,150,0.4)]" />

                            {/* LiDAR */}
                            <div className="absolute bottom-3 right-2 w-2.5 h-2.5 rounded-full bg-[#151515] ring-1 ring-[#333]" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <img
                      src={productImages[selectedImage]}
                      alt={product.node.title}
                      className="relative w-full max-w-md mx-auto"
                    />
                  )
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground"
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-4">
                {product.node.title}
              </h1>

              <p className="text-muted-foreground mb-6">
                {product.node.description}
              </p>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-heading font-bold gradient-text">
                  $ {parseFloat(variantData?.price.amount || "0").toFixed(2)}
                </span>
              </div>

              {/* Form Fields */}
              <div className="space-y-6 mb-8">
                {/* Phone Model (Variant Selector) */}
                <div>
                  <Label htmlFor="phone-model" className="text-base mb-2 block">
                    Select Your Phone Model *
                  </Label>
                  <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                    <SelectTrigger id="phone-model" className="w-full bg-card">
                      <SelectValue placeholder="Choose your phone model" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {product.node.variants.edges.map((variant) => (
                        <SelectItem key={variant.node.id} value={variant.node.id}>
                          {variant.node.title} - ${parseFloat(variant.node.price.amount).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-base mb-2 block">
                    Order Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests? Upload your selfie after checkout via email."
                    className="bg-card border-border min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    After placing your order, you'll receive an email with instructions to upload your selfie and reference images.
                  </p>
                </div>

                {/* File Upload */}
                <div>
                  <Label htmlFor="file-upload" className="text-base mb-2 block">
                    Upload Your Selfie (Optional)
                  </Label>
                  <div className="w-full space-y-4">
                    {/* Upload Area */}
                    <label
                      htmlFor="file-upload"
                      className="relative w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden group bg-secondary/20"
                    >
                      <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">Click to upload photos</p>
                          <p className="text-xs">Select multiple images</p>
                        </div>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const newFiles = Array.from(e.target.files);
                            setSelectedFiles(prev => [...prev, ...newFiles]);
                            const newUrls = newFiles.map(file => URL.createObjectURL(file));
                            setPreviewUrls(prev => {
                              const updated = [...prev, ...newUrls];
                              return updated;
                            });
                            // Auto-select the first new image
                            // Since previews are now at the start, index is just the current length
                            setSelectedImage(previewUrls.length);
                          }
                        }}
                      />
                    </label>

                    {/* Previews Grid */}
                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-secondary/10">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => {
                                  setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                  setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isCartLoading || !selectedVariant}
                >
                  {isCartLoading ? (
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 w-5 h-5" />
                  )}
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  className="flex-1 neon-glow"
                  onClick={handleBuyNow}
                  disabled={isCartLoading || !selectedVariant}
                >
                  {isCartLoading ? (
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="mr-2 w-5 h-5" />
                  )}
                  Buy Now
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <badge.icon className="w-4 h-4 text-primary" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 lg:mt-24"
          >
            <div className="max-w-3xl">
              <h2 className="text-2xl font-heading font-bold mb-6">
                About Your Custom Case
              </h2>
              <div className="space-y-8">
                <div className="bg-secondary/20 p-6 rounded-xl border border-border">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Each SnapForm Studio case is a unique piece of art. Our talented artists
                    use a combination of AI-assisted tools and hand-finishing techniques to
                    transform your photo into stunning anime-style artwork.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-heading font-semibold mb-4 text-foreground">
                      <Sparkles className="w-5 h-5 text-primary" />
                      How It Works
                    </h3>
                    <ol className="space-y-3">
                      {[
                        "Place your order and select your phone model",
                        "You'll receive an email with instructions to upload your selfie",
                        "Our artists create your custom anime artwork",
                        "We print and ship your case within 5-7 days"
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3 text-muted-foreground">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-heading font-semibold mb-4 text-foreground">
                      <Shield className="w-5 h-5 text-primary" />
                      Premium Quality
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Durable polycarbonate shell with TPU bumper",
                        "Raised edges for screen and camera protection",
                        "Precision cutouts for all ports and buttons",
                        "Wireless charging compatible",
                        "Vibrant, fade-resistant print"
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-muted-foreground">
                          <Check className="w-5 h-5 text-primary/60 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Product;
