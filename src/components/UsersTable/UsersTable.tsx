import type { UserAdmin } from "src/types/UserAdmin";

type Props = {
  users: UserAdmin[];
  selected: number[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;

  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onEdit: (user: UserAdmin) => void;
  onDelete: (id: number) => void;
};

export const UsersTable = ({
  users,
  selected,
  loading,
  error,
  isEmpty,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}: Props) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (isEmpty) return <p>No users found</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={selected.length === users.length && users.length > 0}
              onChange={onToggleSelectAll}
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
                onChange={() => onToggleSelect(user.id)}
              />
            </td>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.location ?? "—"}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => onEdit(user)}>Edit</button>
              <button onClick={() => onDelete(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
