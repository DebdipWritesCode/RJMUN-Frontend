import {
  INSTITUTION_ADDRESS,
  EVENT_CITY,
  EVENT_CONTACTS,
  EVENT_COUNTRY,
  EVENT_INSTAGRAM,
  EVENT_LOGO_PATH,
  EVENT_MAIL,
  EVENT_PINCODE,
  EVENT_STATE,
  INSTITUTION_NAME,
} from "../utils/constants";

import { Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="bg-footer-bg text-footer-text py-8 px-6 md:px-20 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex flex-col items-start gap-3">
          <img src={EVENT_LOGO_PATH} alt="Event Logo" className="w-20 h-auto" />
          <a
            href="https://maps.app.goo.gl/jBKf68bn6moy17hm8"
            className="underline text-lg font-medium"
            target="_blank"
            rel="noopener noreferrer">
            Get Direction
          </a>
          <div className="text-sm leading-relaxed">
            {INSTITUTION_ADDRESS}
            <br />
            {INSTITUTION_NAME}
            <br />
            {EVENT_CITY}, {EVENT_STATE}
            <br />
            {EVENT_COUNTRY}
            <br />
            {EVENT_PINCODE}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <a
              href={EVENT_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram">
              <Instagram size={20} className="text-footer-text" />
            </a>
            <a href={`mailto:${EVENT_MAIL}`} aria-label="Email">
              <Mail size={20} className="text-footer-text" />
            </a>
          </div>
        </div>

        <div className="text-sm">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <div className="flex flex-col gap-2">
            {EVENT_CONTACTS.map((contact, index) => (
              <div key={index}>
                {contact.name} ({contact.role}) :{" "}
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-accent mt-10">
        <a href="/terms" className="hover:underline">
          Terms and Conditions
        </a>
      </div>
    </footer>
  );
};

export default Footer;
