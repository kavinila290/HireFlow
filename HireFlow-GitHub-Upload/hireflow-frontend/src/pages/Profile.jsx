import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    bio: "",
    skills: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("hireflowUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      fetchProfile(parsedUser.userId);
    } catch (err) {
      console.error("Invalid user data:", err);

      localStorage.removeItem("hireflowUser");
      navigate("/login");
    }
  }, [navigate]);

  const fetchProfile = async (userId) => {
    try {
      const response = await api.get(`/api/profile/${userId}`);

      const profileData = response.data;

      setProfile({
        fullName: profileData.user?.name || "",
        email: profileData.user?.email || "",
        phone: profileData.phone || "",
        location: profileData.location || "",
        headline: profileData.headline || "",
        bio: profileData.bio || "",
        skills: profileData.skills || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await api.put(`/api/profile/${user.userId}`, {
  phone: profile.phone,
  location: profile.location,
  headline: profile.headline,
  bio: profile.bio,
  skills: profile.skills,
});

      setMessage("Profile updated successfully! 🎉");
    } catch (err) {
      console.error("Error updating profile:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to save your profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <main className="profile-container">
          <div className="profile-card">
            <h2>Loading profile...</h2>
            <p>Please wait while we load your information.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
     <Navbar />

      <main className="profile-container">
        <section className="profile-header">
          <div>
            <p className="eyebrow">YOUR CAREER PROFILE</p>

            <h1>Profile</h1>

            <p>
              Keep your professional information updated for your job search.
            </p>
          </div>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <section className="profile-grid">
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="profile-avatar">
                {profile.fullName
                  ? profile.fullName.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div>
                <h2>{profile.fullName || "Your Name"}</h2>

                <p>
                  {profile.headline ||
                    "Add a professional headline to your profile."}
                </p>
              </div>
            </div>

            <div className="profile-info">
              <div>
                <span>Email</span>
                <strong>{profile.email || "Not added"}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{profile.location || "Not added"}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{profile.phone || "Not added"}</strong>
              </div>
            </div>
          </div>

          <div className="profile-card">
            <div className="card-header">
              <div>
                <h2>Professional Information</h2>

                <p>
                  Update the information employers may see.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="profile-form"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Full name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={profile.fullName}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    disabled
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, Country"
                    value={profile.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="headline">
                  Professional headline
                </label>

                <input
                  id="headline"
                  name="headline"
                  type="text"
                  placeholder="e.g. Java Full Stack Developer"
                  value={profile.headline}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">
                  Skills
                </label>

                <input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="Java, Spring Boot, React, SQL..."
                  value={profile.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">
                  About you
                </label>

                <textarea
                  id="bio"
                  name="bio"
                  rows="5"
                  placeholder="Write a short professional summary..."
                  value={profile.bio}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;