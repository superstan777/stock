import React from "react";

type WorknoteProps = {
  authorEmail?: string;
  note: string;
  createdAt: string;
};

export const Worknote: React.FC<WorknoteProps> = ({
  authorEmail,
  note,
  createdAt,
}) => {
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className="border rounded-xl p-3 mb-2 bg-white shadow-sm">
      <div className="flex justify-between text-sm text-gray-500 mb-1">
        <span>{authorEmail ?? "Unknown user"}</span>
        <span>{formattedDate}</span>
      </div>
      <p className="text-gray-800 whitespace-pre-wrap">{note}</p>
    </div>
  );
};
