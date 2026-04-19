import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useRestaurantInfo } from "../../hooks/useApi";

const ContactPage = () => {
  const { restaurantInfo, loading } = useRestaurantInfo();

  if (loading) {
    return <div className="text-center py-16 text-espresso">Loading...</div>;
  }

  if (!restaurantInfo) {
    return (
      <div className="text-center py-16 text-espresso">
        Unable to load restaurant information.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-forest mb-4">Contact Us</h2>
        <p className="text-espresso max-w-2xl mx-auto">
          Get in touch with us for catering, events, or any questions
          about The Cafecito Club.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-forest mb-6">Get In Touch</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-sage mr-3" />
              <div>
                <p className="text-espresso">{restaurantInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-forest mb-6 flex items-center">
            <Clock className="h-6 w-6 text-sage mr-2" />
            Opening Hours
          </h3>
          <div className="space-y-2">
            {Object.entries(restaurantInfo.hours).map(([day, hours]) => (
              <div key={day} className="flex justify-between">
                <span className="font-medium text-forest capitalize">{day}:</span>
                <span className="text-espresso">{hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold text-forest mb-6">Send us a Message</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-forest mb-2">
              Subject
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-forest mb-2">
              Message
            </label>
            <textarea
              rows="4"
              className="w-full px-4 py-3 border border-sand rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              className="bg-sage text-white px-8 py-3 rounded-lg font-medium hover:bg-forest transition-colors"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
