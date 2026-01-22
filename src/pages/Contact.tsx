import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  {
    question: "How does the custom anime case process work?",
    answer:
      "Simply upload your selfie and any inspiration images, select your phone model, and place your order. Our artists will create a unique anime-style artwork based on your photo, which is then printed on a premium phone case and shipped to you.",
  },
  {
    question: "How long does it take to receive my case?",
    answer:
      "After placing your order, our artists will create your custom design within 3-5 business days. Once approved, your case is printed and shipped. Delivery typically takes 7-14 business days depending on your location. Total time from order to delivery is usually 10-19 business days.",
  },
  {
    question: "Can I request revisions to my design?",
    answer:
      "Yes! We want you to love your case. After our artists create your initial design, you'll receive a preview. You can request up to 2 revisions free of charge to ensure the artwork is perfect before printing.",
  },
  {
    question: "What photo should I upload for the best results?",
    answer:
      "For best results, upload a clear, well-lit photo where your face is clearly visible. Front-facing photos work best. You can also upload reference images showing the anime style, pose, or outfit you'd like us to incorporate.",
  },
  {
    question: "What phone models do you support?",
    answer:
      "We support all major iPhone models (iPhone 14-16 series), Samsung Galaxy S series (S23-S24), and Google Pixel phones (Pixel 9 series). If you don't see your phone model, contact us and we'll do our best to accommodate your request.",
  },
  {
    question: "What is your return and refund policy?",
    answer:
      "Since each case is custom-made, we cannot accept returns on custom orders. However, if there's a printing defect or your case arrives damaged, we'll replace it free of charge. We also offer a satisfaction guarantee during the design approval phase.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We offer free worldwide shipping on all orders. International delivery typically takes 14-21 business days. Tracking is provided for all orders.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your case ships, you'll receive an email with tracking information. You can use this to monitor your package's journey to your doorstep.",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out to our team or check our FAQ below.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-semibold">Send us a message</h2>
                    <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="mb-2 block">
                      Your Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="bg-secondary border-border"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2 block">
                      Your Message
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="bg-secondary border-border min-h-[150px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full neon-glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>

                {/* Email */}
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Or email us directly:</p>
                  <a
                    href="mailto:support@snapformstudio.com"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    support@snapformstudio.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-heading font-bold mb-6">
                Frequently Asked Questions
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      <span className="font-medium pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
