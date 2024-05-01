import React from 'react';

interface CommentContentProps {
  text: string;
}

const CommentContent: React.FC<CommentContentProps> = ({ text }) => {
  return (
    <p className="mt-2 text-xs text-zinc-900 break-words">
      {text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {index > 0 && <br />} {/* Render <br> except for the first line */}
          {line.split(/\s+/).map((chunk, chunkIndex) => {
            const regex =
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z0-9()]{2,}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)*/g;
            const match = chunk.match(regex);
            return (
              <React.Fragment key={chunkIndex}>
                {match ? (
                  <a
                    href={match[0]}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {match[0]}
                  </a>
                ) : (
                  chunk
                )}{' '}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
    </p>
  );
};

export default React.memo(CommentContent);
