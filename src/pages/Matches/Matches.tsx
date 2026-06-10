import { useEffect, useState } from "react";
import { api } from "src/api/api";
import styles from "src/pages/Matches/Matches.module.scss";
import type { User } from "src/types/UserMatches";

export const Matches = () => {
  const [matches, setMatches] = useState<User[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/users/matches");

        setMatches(res.data);
      } catch (err) {
        console.error("Failed to load matches:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const currentUser = matches[index];

  const handleNext = () => {
    setIndex((prev) => prev + 1);
  };

  const handleSend = async () => {
    if (!currentUser) return;

    await api.post("/sessionRequests", {
      receiverId: currentUser.id,
      notes,
    });

    setShowModal(false);
    setNotes("");
  };

  if (!currentUser) {
    return <p>No more matches</p>;
  }

  return (
    <div>
      <h1 className={styles.matches__header}>Matches</h1>

      <div className={styles.matches__card}>
        {currentUser.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "#ccc",
            }}
          />
        )}
        <h2>{currentUser.name}</h2>

        <p>Teaches: {currentUser.teachSkills?.map((s) => s.name).join(", ")}</p>

        <p>
          Wants to learn:{" "}
          {currentUser.learnSkills?.map((s) => s.name).join(", ")}
        </p>

        <p>{currentUser.description || "No description..."}</p>

        <button onClick={() => setShowModal(true)}>Send request</button>
      </div>

      <button onClick={handleNext}>
        <img className={styles.matches__arrow} src="/arrow.png" alt="next" />
      </button>

      {showModal && (
        <div className={styles.matches__modal}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Zoom, time, etc..."
          />

          <button onClick={handleSend}>Send</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
