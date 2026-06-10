import { useEffect, useState } from "react";
import type { UserAdmin } from "src/types/UserAdmin";
import { api } from "src/api/api";
import { UsersTable } from "src/components/UsersTable/UsersTable";
import { EditUserModal } from "src/components/EditUserModal/EditUserModal";
import { mapError } from "src/api/error";

export const AdminPage = () => {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [editUser, setEditUser] = useState<UserAdmin | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchUsers = async (query = "") => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};

      if (query.trim()) {
        if (!isNaN(Number(query))) {
          params.id = query;
        } else {
          params.search = query;
        }
      }

      const { data } = await api.get("/admin/users", { params });

      setUsers(data);

      setIsEmpty(data.length === 0);
    } catch (err: unknown) {
      const error = mapError(err);
      setError(error.message);
      setUsers([]);
      setIsEmpty(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    fetchUsers(value);
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === users.length) {
      setSelected([]);
    } else {
      setSelected(users.map((u) => u.id));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSelected((prev) => prev.filter((i) => i !== id));
    } catch (err: unknown) {
      const error = mapError(err);
      setError(error.message);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selected.length) return;
    if (!confirm(`Delete ${selected.length} users?`)) return;

    try {
      await api.delete("/admin/users/bulk", { data: { ids: selected } });
      setUsers((prev) => prev.filter((u) => !selected.includes(u.id)));
      setSelected([]);
    } catch (err: unknown) {
      const error = mapError(err);
      setError(error.message);
    }
  };

  const handleSave = async (updated: UserAdmin) => {
    try {
      const { data } = await api.put(`/admin/users/${updated.id}`, {
        role: updated.role,
      });
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      setEditUser(null);
    } catch (err: unknown) {
      const error = mapError(err);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Admin panel</h1>
      <input
        type="text"
        placeholder="Search by name or id..."
        value={search}
        onChange={handleSearch}
      />

      {selected.length > 0 && (
        <button onClick={handleDeleteSelected}>
          Delete selected ({selected.length})
        </button>
      )}

      <UsersTable
        users={users}
        selected={selected}
        loading={loading}
        error={error}
        isEmpty={isEmpty}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEdit={setEditUser}
        onDelete={handleDelete}
      />

      {editUser && (
        <EditUserModal
          user={editUser}
          onSave={handleSave}
          onCancel={() => setEditUser(null)}
        />
      )}
    </div>
  );
};
