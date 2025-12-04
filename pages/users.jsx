"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DataTable from "@/components/tables/data-table"
import EditModal from "@/components/modals/edit-modal"
import Toast from "@/components/notifications/toast"
import { Plus } from "lucide-react"

const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "Active", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", role: "User" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Inactive", role: "User" },
  { id: 4, name: "Alice Williams", email: "alice@example.com", status: "Active", role: "Manager" },
]

export default function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [searchValue, setSearchValue] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState({ type: "success", title: "", message: "", visible: false })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const handleEdit = (user) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleSave = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    showToast("success", "Success", "User updated successfully")
  }

  const handleDelete = (userId) => {
    setUsers(users.filter((u) => u.id !== userId))
    showToast("success", "Success", "User deleted successfully")
  }

  const handleAdd = () => {
    setEditingUser({ id: Date.now(), name: "", email: "", status: "Active", role: "User" })
    setShowModal(true)
  }

  const showToast = (type, title, message) => {
    setToast({ type, title, message, visible: true })
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus size={20} />
          Add User
        </motion.button>
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "email", label: "Email", sortable: true },
          { key: "role", label: "Role", sortable: true },
          { key: "status", label: "Status", sortable: true },
        ]}
        data={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <EditModal
        isOpen={showModal}
        title={editingUser?.id > 1000 ? "Add New User" : "Edit User"}
        data={editingUser}
        fields={[
          { name: "name", label: "Full Name", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "role", label: "Role", type: "text" },
          { name: "status", label: "Status", type: "text" },
        ]}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />

      <Toast type={toast.type} title={toast.title} message={toast.message} isVisible={toast.visible} />
    </div>
  )
}
