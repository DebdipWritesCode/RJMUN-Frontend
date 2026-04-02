import {
  privacyPolicyIntro,
  informationWeCollect,
  howWeUseInfo,
  dataProtection,
  dataSharing,
  yourRights,
  policyUpdates,
} from "@/utils/privacy-policy";
import { EVENT_MAIL } from "@/utils/constants";

const PrivacyPolicyPage = () => {
  const renderList = (items: string[]) => (
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="w-2 h-2 bg-[#f8c94c] rounded-full mt-2 mr-4 flex-shrink-0 opacity-60"></span>
          <span className="text-base leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-bold sm:text-[60px] text-primary text-[40px] sm:mb-20 mb-15 text-center">
        PRIVACY POLICY
      </h1>

      <div className="w-full space-y-16">
        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Introduction
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              {privacyPolicyIntro}
            </p>
          </div>
        </section>

        <section className="w-full text-[#eef5ff]">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Information We Collect
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            {renderList(informationWeCollect)}
          </div>
        </section>

        <section className="w-full text-[#eef5ff]">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            How We Use Your Information
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            {renderList(howWeUseInfo)}
          </div>
        </section>

        <section className="w-full text-[#eef5ff]">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Data Protection
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            {renderList(dataProtection)}
          </div>
        </section>

        <section className="w-full text-[#eef5ff]">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Data Sharing
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            {renderList(dataSharing)}
          </div>
        </section>

        <section className="w-full text-[#eef5ff]">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Your Rights
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            {renderList(yourRights)}
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Policy Updates
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              {policyUpdates}
            </p>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Contact Us
          </h3>
          <div className="border-l-2 border-[#f8c94c]/30 pl-6">
            <p className="text-base leading-relaxed text-[#eef5ff]">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href={`mailto:${EVENT_MAIL}`}
                className="underline text-accent"
              >
                {EVENT_MAIL}
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
