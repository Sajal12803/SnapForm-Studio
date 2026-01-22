import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Palette, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import productCasesRow from "@/assets/product-cases-row.png";

const benefits = [
  {
    icon: Palette,
    title: "Unique Artwork",
    description: "Every case is a one-of-a-kind masterpiece",
  },
  {
    icon: Shield,
    title: "Premium Protection",
    description: "Shock-absorbent materials for daily use",
  },
  {
    icon: Truck,
    title: "Global Shipping",
    description: "Free worldwide delivery in 7-14 days",
  },
];

const ProductHighlight = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-[80px] rounded-full" />
            <img
              src={productCasesRow}
              alt="Collection of custom anime phone cases featuring unique character designs"
              className="relative rounded-2xl w-full"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Wear Your <span className="gradient-text">Anime Self</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our custom anime phone cases are more than accessories—they're wearable art.
              Each design is carefully crafted to capture your unique personality in stunning anime style.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/product">
              <Button size="lg" className="neon-glow group">
                Start Creating
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;
