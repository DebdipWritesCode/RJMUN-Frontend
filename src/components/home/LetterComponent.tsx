import React from "react";
import ReactMarkdown from "react-markdown";

interface LetterComponentProps {
  content: string;
  className?: string;
}

const LetterComponent: React.FC<LetterComponentProps> = ({
  content,
  className = "",
}) => {
  return (
    <div
      className={`text-justify bg-letter-surface backdrop-blur-sm border border-letter-border rounded-lg sm:mt-8 mt-[-20px] font-serif text-lg text-letter-text p-6 ${className}`}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-card-label-text">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default LetterComponent;