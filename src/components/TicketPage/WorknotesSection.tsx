"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorknotes, addWorknote } from "@/lib/api/worknotes";
import { Worknote } from "./Worknote";

type WorknotesSectionProps = {
  ticketId: string;
};

export const WorknotesSection: React.FC<WorknotesSectionProps> = ({
  ticketId,
}) => {
  const currentUserId = "138ce128-e78d-4998-890b-d064663564ec";
  const queryClient = useQueryClient();
  const [newNote, setNewNote] = useState("");

  const {
    data: worknotes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["worknotes", ticketId],
    queryFn: () => getWorknotes(ticketId),
  });

  const mutation = useMutation({
    mutationFn: () =>
      addWorknote({
        ticket_id: ticketId,
        note: newNote.trim(),
        author_id: currentUserId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worknotes", ticketId] });
      setNewNote("");
    },
  });

  const handleAddWorknote = () => {
    if (!newNote.trim()) return;
    mutation.mutate();
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Worknotes</h3>

      <div className="mb-4">
        <textarea
          className="w-full border rounded-lg p-2 text-sm resize-none"
          rows={3}
          placeholder="Add a new worknote..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button
          onClick={handleAddWorknote}
          disabled={mutation.isPending || !newNote.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? "Adding..." : "Add note"}
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {isError && (
        <p className="text-sm text-red-500">Error loading worknotes</p>
      )}

      {!isLoading && worknotes.length === 0 && (
        <p className="text-sm text-gray-500">No worknotes yet.</p>
      )}

      {!isLoading &&
        worknotes.map((note) => (
          <Worknote
            key={note.id}
            authorEmail={note.author?.email}
            note={note.note}
            createdAt={note.created_at}
          />
        ))}
    </div>
  );
};
