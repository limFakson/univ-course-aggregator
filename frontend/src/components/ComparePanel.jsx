import React, { useEffect, useRef } from "react";

const ComparePanel = ({ selected, onClose }) => {
  const panelRef = useRef(null);

  // Scroll to top automatically when panel opens
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selected.length]);

  if (selected.length === 0) return null;

  return (
    <div
      ref={panelRef}
      className="
        fixed bottom-0 left-0 w-full 
        bg-white border-t border-black 
        px-4 pb-4 
        overflow-y-auto overflow-x-auto 
        max-h-screen
        z-50
      "
    >
      <div className="flex justify-between items-center mb-2 sticky top-0 bg-white pb-2 pt-4 border-b border-gray-400">
        <h2 className="font-bold text-base">Compare Courses</h2>
        <button className="underline text-sm" onClick={onClose}>
          Clear
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 text-sm pt-4">
        {selected.map((c) => (
          <div key={c.id} className="min-w-[250px] border-r border-gray-300 pr-3 pb-2 border-b">
            <p className="pb-2 font-semibold">{c.title}</p>
            <p className="pb-1">
              {c.department?.university?.name || c.university?.name || "—"}
            </p>
            <p className="pb-1">{c.duration || "—"}</p>
            <p className="pb-1">{c.fees || "—"}</p>
            <details className="mt-1">
                <summary className="cursor-pointer font-light">Requirements</summary>

                {Array.isArray(c.requirements) ? (
                    <ul className="list-disc list-inside mt-1">
                    {c.requirements.map((req, index) => (
                        <li className="text-xs mt-1" key={index}>
                        {req}
                        </li>
                    ))}
                    </ul>
                ) : (
                    <ul className="list-disc list-inside mt-1">
                    <li className="text-xs mt-1">
                        {c.requirements || "Not provided"}
                    </li>
                    </ul>
                )}
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePanel;
