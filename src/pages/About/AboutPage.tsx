import { about } from "@/utils/about";
import {
  INSTITUTION_NAME,
  INSTITUTION_ADDRESS,
  EVENT_CITY,
  EVENT_STATE,
  EVENT_COUNTRY,
  EVENT_PINCODE,
  EVENT_MAIL,
  EVENT_NAME,
} from "@/utils/constants";

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-bold sm:text-[60px] text-primary text-[40px] sm:mb-20 mb-15 text-center">
        ABOUT US
      </h1>

      <div className="w-full space-y-16">
        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Who We Are
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff] whitespace-pre-line">
              {about}
            </p>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Our Institution
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              {EVENT_NAME} is organized by{" "}
              <span className="font-semibold text-primary">{INSTITUTION_NAME}</span>, a
              leading educational institution committed to holistic development
              and academic excellence.
            </p>
            <div className="mt-4 text-base leading-relaxed text-[#eef5ff]">
              <p className="font-semibold text-primary">Registered Address:</p>
              <p>{INSTITUTION_NAME}</p>
              <p>{INSTITUTION_ADDRESS}</p>
              <p>
                {EVENT_CITY}, {EVENT_STATE}
              </p>
              <p>
                {EVENT_COUNTRY} — {EVENT_PINCODE}
              </p>
            </div>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Our Website
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              This website (www.rjmun.in) serves as the official registration
              and information portal for {EVENT_NAME}. It enables participants
              to register for the MUN conference, purchase fest day passes,
              view committee details, and access all event-related information.
            </p>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Contact
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              For any inquiries, please reach out to us at{" "}
              <a
                href={`mailto:${EVENT_MAIL}`}
                className="underline text-accent"
              >
                {EVENT_MAIL}
              </a>
              , or visit our{" "}
              <a href="/contact" className="underline text-accent">
                Contact Us
              </a>{" "}
              page.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
