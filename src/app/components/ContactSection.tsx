import { useState } from "react";
import { Mail, Phone, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { siteContent } from "../content";

// Web3Forms access key — get a free one at https://web3forms.com (enter the
// inbox you want submissions sent to). Safe to keep in client code.
// Can also be supplied via the VITE_WEB3FORMS_ACCESS_KEY env var.
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
  "ed7a54c5-8a81-45f1-b4b0-ac267c5381bb";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export function ContactSection() {
  const { title, subtitle, contactInfo, form } = siteContent.contact;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New ToGatherSG enquiry from ${formData.name || "website"}`,
          from_name: "ToGatherSG Website",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection and try again.");
    }
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
                disabled={status === "sending"}
                className="w-full bg-[#8A2BE2] hover:bg-[#8A2BE2]/90 text-white font-semibold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
              >
                {status === "sending" ? "Sending..." : form.submitButton}
              </Button>

              {status === "success" && (
                <p className="text-center text-green-600 font-medium" role="status">
                  Thanks! Your message has been sent — we'll get back to you soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-center text-red-600 font-medium" role="alert">
                  {errorMsg}
                </p>
              )}
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
