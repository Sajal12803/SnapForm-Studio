import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(270_91%_65%_/_0.15)_0%,_transparent_70%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Ready to See Yourself in <span className="gradient-text">Anime Style?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Upload your photo today and get a custom anime phone case that's uniquely you.
            Free shipping worldwide. Satisfaction guaranteed.
          </p>
          <Link to="/product">
            <Button size="lg" className="neon-glow group">
              Create Your Case Now
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
