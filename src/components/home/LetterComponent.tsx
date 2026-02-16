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
      className={`text-justify bg-warm-tan sm:mt-8 mt-[-20px] font-bold font-serif text-lg text-primary-background ${className}`}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-4 leading-relaxed">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
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
