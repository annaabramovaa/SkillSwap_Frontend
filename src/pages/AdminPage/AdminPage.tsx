import { useEffect, useState } from "react";
import type { UserAdmin } from "../../types/UserAdmin";
import type { AxiosError } from "axios";
import { api } from "../../api/api";

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
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Something went wrong");
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
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Something went wrong");
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
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleSave = async () => {
    if (!editUser) return;

    try {
      const { data } = await api.put(`/admin/users/${editUser.id}`, {
        role: editUser.role,
      });

      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      setEditUser(null);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Something went wrong");
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

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : isEmpty ? (
        <p>No users found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.length === users.length && users.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.location ?? "—"}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => setEditUser(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editUser && (
        <div>
          <div>
            <h2>Edit user</h2>
            <label>Role</label>
            <select
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditUser(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
