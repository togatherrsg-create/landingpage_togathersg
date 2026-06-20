import { useState } from "react";
import { Mail, Phone, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { siteContent } from "../content";

export function ContactSection() {
  const { title, subtitle, contactInfo, form } = siteContent.contact;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (could be connected to an API)
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-xl text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>

              <div className="space-y-4">
                <Card className="p-4 flex items-center gap-4 border-2 border-gray-100 rounded-xl hover:border-[#F4C300] transition-colors">
                  <div className="w-12 h-12 bg-[#F4C300] rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium text-left">Email</p>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-900 font-semibold hover:text-[#8A2BE2] transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-4 border-2 border-gray-100 rounded-xl hover:border-[#F4C300] transition-colors">
                  <div className="w-12 h-12 bg-[#8A2BE2] rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-gray-900 font-semibold hover:text-[#8A2BE2] transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-4 border-2 border-gray-100 rounded-xl hover:border-[#F4C300] transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F4C300] to-[#F4C300] rounded-lg flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Instagram</p>
                    <a
                      href={`https://instagram.com/${contactInfo.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 font-semibold hover:text-[#8A2BE2] transition-colors"
                    >
                      {contactInfo.instagram}
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8 border-2 border-gray-100 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder={form.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-[#8A2BE2] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={form.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-[#8A2BE2] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={form.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-[#8A2BE2] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder={form.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full rounded-lg border-2 border-gray-200 focus:border-[#8A2BE2] transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#8A2BE2] hover:bg-[#8A2BE2]/90 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {form.submitButton}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
