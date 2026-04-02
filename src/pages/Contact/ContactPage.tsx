import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import {
  INSTITUTION_NAME,
  INSTITUTION_ADDRESS,
  EVENT_CITY,
  EVENT_STATE,
  EVENT_COUNTRY,
  EVENT_PINCODE,
  EVENT_MAIL,
  EVENT_INSTAGRAM,
  EVENT_CONTACTS,
} from "@/utils/constants";

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-bold sm:text-[60px] text-primary text-[40px] sm:mb-20 mb-15 text-center">
        CONTACT US
      </h1>

      <div className="w-full space-y-16">
        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Get In Touch
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              Have questions about registration, payments, or the event? We're
              here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Email
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <a
              href={`mailto:${EVENT_MAIL}`}
              className="text-base leading-relaxed text-[#eef5ff] flex items-center gap-3 hover:text-accent transition-colors"
            >
              <Mail className="w-5 h-5 flex-shrink-0" />
              {EVENT_MAIL}
            </a>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Phone
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <ul className="space-y-4">
              {EVENT_CONTACTS.map((contact, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-[#eef5ff]"
                >
                  <Phone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-base font-semibold text-primary">
                      {contact.name}
                    </p>
                    <p className="text-sm opacity-80">{contact.role}</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-base hover:text-accent transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Address
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <div className="flex items-start gap-3 text-[#eef5ff]">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-base leading-relaxed">
                <p className="font-semibold text-primary">{INSTITUTION_NAME}</p>
                <p>{INSTITUTION_ADDRESS}</p>
                <p>
                  {EVENT_CITY}, {EVENT_STATE}
                </p>
                <p>
                  {EVENT_COUNTRY} — {EVENT_PINCODE}
                </p>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/jBKf68bn6moy17hm8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 underline text-accent text-base"
            >
              Get Directions on Google Maps
            </a>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Social Media
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <a
              href={EVENT_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base leading-relaxed text-[#eef5ff] flex items-center gap-3 hover:text-accent transition-colors"
            >
              <Instagram className="w-5 h-5 flex-shrink-0" />
              Follow us on Instagram
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
