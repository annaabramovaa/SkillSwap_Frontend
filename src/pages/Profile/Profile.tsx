import { useEffect, useState, useRef } from "react";
import { api } from "src/api/api";
import type { UserProfile } from "src/types/UserProfile";
import type { AxiosError } from "axios";
import styles from "src/pages/Profile/Profile.module.scss";
import { useNavigate } from "react-router-dom";
import { mapError } from "src/api/error";

export const Profile = () => {
  const [userData, setUserData] = useState<UserProfile>({
    name: "",
    teachSkills: [],
    learnSkills: [],
    description: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [allSkills, setAllSkills] = useState<{ id: number; name: string }[]>(
    [],
  );

  const [teachInput, setTeachInput] = useState("");
  const [learnInput, setLearnInput] = useState("");

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState("");

  const [avatar, setAvatar] = useState<string>("");
  const [preview, setPreview] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userResponse, allSkillsResponse, mySkillsResponse] =
          await Promise.all([
            api.get("/users/me"),
            api.get("/skills"),
            api.get("/skills/me"),
          ]);

        const user = userResponse.data;

        setUserData({
          name: user.name,
          description: user.description || "",
          teachSkills: mySkillsResponse.data.teachSkills,
          learnSkills: mySkillsResponse.data.learnSkills,
        });

        setDescription(user.description || "");
        setLocation(user.location || "");
        setGender(user.gender || "");
        setHobbies(user.hobbies ? user.hobbies.join(", ") : "");

        setAvatar(user.avatar || "");

        setAllSkills(allSkillsResponse.data);
      } catch (err: unknown) {
        const error = mapError(err);
        setError(error.message);
      }
    };

    fetchProfileData();
  }, []);

  const validateSkill = (value: string) => {
    const regex = /^[a-zA-Zа-яА-ЯіїєґІЇЄҐ0-9+#.\-\s]+$/u;
    return regex.test(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "teach" | "learn",
  ) => {
    const value = e.target.value.toLowerCase();

    if (type === "teach") {
      setTeachInput(value);
    } else {
      setLearnInput(value);
    }
  };

  const handleAddSkill = async (value: string, type: "teach" | "learn") => {
    const skillValue = value.trim().toLowerCase();

    if (!validateSkill(skillValue)) {
      setError(
        "Skill can contain letters (English/Ukrainian), numbers, spaces and symbols like +, #, -",
      );
      return;
    }

    try {
      let skill = allSkills.find((item) => item.name === skillValue);

      if (!skill) {
        const { data: newSkill } = await api.post("/skills", {
          name: skillValue,
        });

        skill = newSkill;
        setAllSkills((prev) => [...prev, newSkill]);
      }

      if (!skill) return;

      if (type === "teach") {
        await api.post("/skills/teach", { skillId: skill.id });
        setTeachInput("");
      } else {
        await api.post("/skills/learn", { skillId: skill.id });
        setLearnInput("");
      }

      const { data } = await api.get("/skills/me");

      setUserData((prev) => ({
        ...prev,
        teachSkills: data.teachSkills,
        learnSkills: data.learnSkills,
      }));
    } catch (err: unknown) {
      const error = mapError(err);
      setError(error.message);
    }
  };

  const handleRemoveSkill = async (
    skillId: number,
    type: "teach" | "learn",
  ) => {
    try {
      if (type === "teach") {
        await api.delete("/skills/teach", { data: { skillId } });
      } else {
        await api.delete("/skills/learn", { data: { skillId } });
      }

      const { data } = await api.get("/skills/me");

      setUserData((prev) => ({
        ...prev,
        teachSkills: data.teachSkills,
        learnSkills: data.learnSkills,
      }));
    } catch (err: unknown) {
      const error = mapError(err);
      setError(error.message);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSaveProfile = async () => {
    try {
      await api.patch("/users/me", {
        description,
        location,
        gender,
        hobbies: hobbies
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
      });

      setIsEditing(false);

      const { data } = await api.get("/users/me");

      setUserData((prev) => ({
        ...prev,
        description: data.description || "",
      }));
    } catch {
      setError("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setDescription(userData.description || "");
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.post("/users/avatar", formData);

      setAvatar(res.data.avatar);
      setPreview("");
    } catch (err) {
      console.error("Avatar upload failed", err);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await api.delete("/users/avatar");
      setAvatar("");
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

  return (
    <>
      <h1>Hello, {userData.name}</h1>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleAvatarChange}
        />

        <button type="button" onClick={() => fileInputRef.current?.click()}>
          {avatar ? "Change photo" : "Add photo"}
        </button>

        {avatar && (
          <button type="button" onClick={handleDeleteAvatar}>
            Delete photo
          </button>
        )}

        {preview ? (
          <img
            src={preview}
            alt="preview"
            style={{ width: 120, height: 120, borderRadius: "50%" }}
          />
        ) : avatar ? (
          <img
            src={avatar}
            alt="avatar"
            style={{ width: 120, height: 120, borderRadius: "50%" }}
          />
        ) : (
          <div>No avatar</div>
        )}
      </div>

      <div className={styles.wrapper}>
        <div className={styles.skills}>
          <label htmlFor="teach" className={styles.form__label}>
            What can you teach:
          </label>

          <input
            type="text"
            id="teach"
            value={teachInput}
            onChange={(e) => handleChange(e, "teach")}
          />

          <button onClick={() => handleAddSkill(teachInput, "teach")}>
            Add
          </button>

          {userData.teachSkills.map((skill) => (
            <div key={skill.id}>
              {skill.name}
              <button onClick={() => handleRemoveSkill(skill.id, "teach")}>
                Delete
              </button>
            </div>
          ))}

          <label htmlFor="learn" className={styles.skills__label}>
            What do you want to learn:
          </label>

          <input
            type="text"
            id="learn"
            value={learnInput}
            onChange={(e) => handleChange(e, "learn")}
          />

          <button onClick={() => handleAddSkill(learnInput, "learn")}>
            Add
          </button>

          {userData.learnSkills.map((skill) => (
            <div key={skill.id}>
              {skill.name}
              <button onClick={() => handleRemoveSkill(skill.id, "learn")}>
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className={styles.skills__description}>
          <label>Tell about yourself</label>

          {isEditing ? (
            <>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                placeholder="Hobbies"
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
              />

              <button onClick={handleSaveProfile}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <p>{userData.description || "No description yet..."}</p>

              <p>
                <strong>Location:</strong> {location || "Not specified"}
              </p>

              <p>
                <strong>Gender:</strong> {gender || "Not specified"}
              </p>

              <p>
                <strong>Hobbies:</strong> {hobbies || "Not specified"}
              </p>

              <button onClick={handleEdit}>Edit</button>
            </>
          )}
        </div>

        <div>
          {payload?.role === "admin" && (
            <button onClick={() => navigate("/admin")}>Admin panel</button>
          )}
        </div>

        {error && <p>{error}</p>}
      </div>
    </>
  );
};
