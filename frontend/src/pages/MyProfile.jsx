import { useAuth } from "../context/AuthContext";

export default function MyProfile() {
    const { user } = useAuth();
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="bg-white p-6 rounded shadow max-w-md">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
                <p><strong>Organization ID:</strong> {user?.organizationId}</p>
            </div>
        </div>
    );
}
