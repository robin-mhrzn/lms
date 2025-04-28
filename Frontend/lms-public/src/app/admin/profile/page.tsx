import ChangePasswordComponent from "@/components/profile/changePasswordComponent";
import ProfileComponent from "@/components/profile/profileComponent";

const Profile = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 ">
      <div className="flex-1 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <ProfileComponent />
      </div>

      <div className="flex-1 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <ChangePasswordComponent />
      </div>
    </div>
  );
};

export default Profile;
