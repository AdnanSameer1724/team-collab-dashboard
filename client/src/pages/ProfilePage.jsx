import { useSelector } from "react-redux";

export default function ProfilePage() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="profile-page">
            <h2>Your Profile</h2>
            <div className="profile-details">
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
            </div>
        </div>
    );
}