export const ExamplesModal = ({ isOpen, examples, onSelect, onClose }) => {
  const handleExampleClick = (example) => {
    onSelect(example); // Call the passed onSelect prop with the example
    onClose(); // Close the modal after selection
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn-x" onClick={onClose}>
          X
        </button>
        <ul>
          {examples.map((example, index) => (
            <li
              key={index}
              onClick={() => handleExampleClick(example)}
              style={{ cursor: "pointer" }}
            >
              {example}
            </li>
          ))}
        </ul>
        <button className="modal-close-btn mt-4" onClick={onClose}>
          Close
        </button>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(
            0,
            0,
            0,
            0.5
          ); /* Semi-transparent background */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000; /* Ensure it's above other content */
        }
        .modal-content {
          background-color: #5c6bc0; /* Indigo shade */
          padding: 30px;
          border-radius: 8px;
          position: relative;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Subtle shadow */
          width: 90%;
          max-width: 500px; /* Maximum width of the modal */
        }
        .modal-close-btn {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background-color: transparent;
          border: none;
          font-size: 1.5rem;
          color: white;
          cursor: pointer;
        }
        .modal-close-btn-x {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: transparent;
          border: none;
          font-size: 1.5rem;
          color: white;
          cursor: pointer;
        }

        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          background-color: #7986cb; /* Lighter indigo shade */
          color: white;
          padding: 10px 20px;
          margin: 10px 0;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        li:hover {
          background-color: #9fa8da; /* Even lighter indigo shade on hover */
        }
        button.modal-close-btn:hover {
          color: #ffebee; /* Light pink for contrast */
        }
      `}</style>
    </div>
  );
};
