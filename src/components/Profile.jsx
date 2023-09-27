import React, { useState } from "react";

const Profile = ({ registerloading, registerProfile }) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  return (
    <div className="space-y-2">
      <h1 className="font-semibold text-2xl text-center">Create Profile</h1>
      <form className="w-[600px] space-y-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="font-medium">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
            placeholder="Username"
            className="p-2 border border-neutral-400 w-full rounded-md focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="bio" className="font-medium">
            Bio
          </label>
          <input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            id="bio"
            type="text"
            placeholder="Bio"
            className="p-2 border border-neutral-400 w-full rounded-md focus:outline-none"
          />
        </div>
        <div>
          <button
            disabled={username === "" || bio === "" || registerloading}
            onClick={(e) => {
              e.preventDefault();
              registerProfile(username, bio);
            }}
            className="px-4 py-2 rounded-full bg-primary text-white font-medium"
          >
            {registerloading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
