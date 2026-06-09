import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Users() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    roleid: "2",
    status: "Active",
  });

  const userSchema = Yup.object({
    name: Yup.string().min(3, "Too short").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    roleid: Yup.string().required("Select a role"),
    status: Yup.string(),
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://ecom-common-backend.onrender.com/admin/users/");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";

    try {
      await fetch(`https://ecom-common-backend.onrender.com/admin/users/updateuser/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          roleid: user.roleid,
          status: newStatus,
        }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id
            ? { ...u, status: newStatus }
            : u
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleEditClick = (user) => {
    setEditUser({
      id: user.user_id,
      name: user.name,
      email: user.email,
      roleid: user.roleid || "2",
      status: user.status,
    });

    setShowEditModal(true);
  };

  return (
    <>
      <div className="px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-bold">Users Management</h2>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Add New User
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs uppercase border-b border-gray-100 bg-gray-50">
                <th className="py-4 px-6 text-left font-medium">User ID</th>
                <th className="py-4 px-6 text-left font-medium">Name</th>
                <th className="py-4 px-6 text-left font-medium">Email</th>
                <th className="py-4 px-6 text-left font-medium">Role</th>
                <th className="py-4 px-6 text-left font-medium">Status</th>
                <th className="py-4 px-6 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.user_id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-6 font-medium text-gray-700">
                      #{String(user.user_id).padStart(3, "0")}
                    </td>

                    <td className="py-4 px-6 text-gray-700">
                      {user.name}
                    </td>

                    <td className="py-4 px-6 text-gray-500">
                      {user.email}
                    </td>

                    <td className="py-4 px-6 text-gray-700">
                      {user.rolename}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleStatusToggle(user)}
                        className={`relative w-10 h-5 rounded-full transition ${
                          user.status === "Active"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                            user.status === "Active"
                              ? "translate-x-5"
                              : ""
                          }`}
                        />
                      </button>

                      <p className="text-xs mt-1 text-gray-500">
                        {user.status}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-500 hover:text-blue-600 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <Modal title="Add User" onClose={() => setShowAddModal(false)}>
          <Formik
            initialValues={{ name: "", email: "", roleid: "" }}
            validationSchema={userSchema}
            onSubmit={async (values) => {
              await fetch("https://ecom-common-backend.onrender.com/admin/users/adduser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });

              fetchUsers();
              setShowAddModal(false);
            }}
          >
            <Form className="space-y-4">
              <div>
                <Field name="name" placeholder="Name" as={Input} />
                <ErrorMessage name="name" component={ErrorText} />
              </div>

              <div>
                <Field name="email" placeholder="Email" as={Input} />
                <ErrorMessage name="email" component={ErrorText} />
              </div>

              <div>
                <Field name="roleid" as={Select}>
                  <option value="">Select Role</option>
                  <option value="1">Admin</option>
                  <option value="2">Retailer</option>
                  <option value="3">Customer</option>
                </Field>
                <ErrorMessage name="roleid" component={ErrorText} />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Add User
              </button>
            </Form>
          </Formik>
        </Modal>
      )}

      {showEditModal && (
        <Modal title="Edit User" onClose={() => setShowEditModal(false)}>
          <Formik
            enableReinitialize
            initialValues={editUser}
            validationSchema={userSchema}
            onSubmit={async (values) => {
              await fetch(
                `https://ecom-common-backend.onrender.com/admin/users/updateuser/${values.id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                }
              );

              fetchUsers();
              setShowEditModal(false);
            }}
          >
            <Form className="space-y-4">
              <div>
                <Field name="name" as={Input} />
                <ErrorMessage name="name" component={ErrorText} />
              </div>

              <div>
                <Field name="email" as={Input} />
                <ErrorMessage name="email" component={ErrorText} />
              </div>

              <Field name="roleid" as={Select}>
                <option value="1">Admin</option>
                <option value="2">Retailer</option>
                <option value="3">Customer</option>
              </Field>

              <Field name="status" as={Select}>
                <option>Active</option>
                <option>Inactive</option>
              </Field>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
              >
                Update User
              </button>
            </Form>
          </Formik>
        </Modal>
      )}
    </>
  );
}

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-105 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-400">x</button>
      </div>
      {children}
    </div>
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Select = (props) => (
  <select
    {...props}
    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const ErrorText = ({ children }) => (
  <p className="text-red-500 text-sm mt-1">{children}</p>
);

export default Users;
