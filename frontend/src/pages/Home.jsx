import React from "react";

export default function Home({ user }) {
    return (
        <div>
            <h1>Welcome, {user?.name || "User"}!</h1>
            <p>This is the normal user homepage.</p>
        </div>
    );
}
