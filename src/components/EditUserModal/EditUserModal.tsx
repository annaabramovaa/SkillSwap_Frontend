import { useState } from "react";
import type { UserAdmin } from "src/types/UserAdmin";

type Props = {
  user: UserAdmin;
  onSave: (updated: UserAdmin) => void;
  onCancel: () => void;
};

export const EditUserModal = ({ user, onSave, onCancel }: Props) => {
  const [role, setRole] = useState(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, role });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Edit user</h2>
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};