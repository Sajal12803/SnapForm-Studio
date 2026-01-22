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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    ? [...product.node.images.edges.map(e => e.node.url), animeCasePurple, animeCaseBlue, animeCasePink]
    : [animeCasePurple, animeCaseBlue, animeCasePink];

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
                  <img
                    src={productImages[selectedImage]}
                    alt={product.node.title}
                    className="relative w-full max-w-md mx-auto"
                  />
                )}
              </div>

              {/* Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-3">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
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
                  {variantData?.price.currencyCode} {parseFloat(variantData?.price.amount || "0").toFixed(2)}
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
                          {variant.node.title} - {variant.node.price.currencyCode} {parseFloat(variant.node.price.amount).toFixed(2)}
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
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full relative overflow-hidden"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      {selectedFile ? (
                        <span className="truncate">{selectedFile.name}</span>
                      ) : (
                        <>
                          <Upload className="mr-2 w-4 h-4" />
                          Choose Image
                        </>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </Button>
                    {selectedFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Or you can upload via email after checkout.
                  </p>
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
