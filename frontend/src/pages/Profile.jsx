import React, { useState, useEffect, useRef } from 'react';

export default function Profile({ onNavigate }) {
  // Read user data from localStorage
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  // Route guard: redirect to sign-in if not logged in or unverified
  useEffect(() => {
    const infoStr = localStorage.getItem('userInfo');
    const info = infoStr ? JSON.parse(infoStr) : null;
    if (!info || !info.isVerified) {
      onNavigate('signin');
    }
  }, [onNavigate]);

  // Profile information state
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [location, setLocation] = useState('');
  const studentId = userInfo?.email ? userInfo.email.split('@')[0] : '';

  // Profile picture state
  const [profileImage, setProfileImage] = useState('/user.png');
  const fileInputRef = useRef(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempLocation, setTempLocation] = useState(location);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [lastPasswordChangeDays, setLastPasswordChangeDays] = useState(45);

  // Emergency Contacts State
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [contacts, setContacts] = useState([
    { name: 'Sarah Johnson', relationship: 'Mother', phone: '+1 (555) 019-8765' },
    { name: 'Marcus Johnson', relationship: 'Father', phone: '+1 (555) 019-8766' }
  ]);
  const [tempContacts, setTempContacts] = useState([]);

  // Logout Confirm State
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Auto-clear Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle entering edit mode
  const handleEditClick = () => {
    setTempName(name);
    setTempEmail(email);
    setTempPhone(phone);
    setTempLocation(location);
    setIsEditing(true);
  };

  // Save profile edits
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!tempName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    if (!tempEmail.trim() || !tempEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setName(tempName);
    setEmail(tempEmail);
    setPhone(tempPhone);
    setLocation(tempLocation);
    setIsEditing(false);
    showToast('Profile information updated successfully!', 'success');
  };

  // Cancel profile edits
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // Trigger Toast Notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Handle password updates
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password confirmation does not match.');
      return;
    }

    // Success Simulation
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setLastPasswordChangeDays(0); // reset days ago
    showToast('Your security credentials have been updated.', 'success');
  };

  // Open emergency contacts manager
  const handleOpenContacts = () => {
    setTempContacts(contacts.map(c => ({ ...c })));
    setIsContactsModalOpen(true);
  };

  // Update contact field
  const handleContactChange = (index, field, value) => {
    const updated = [...tempContacts];
    updated[index][field] = value;
    setTempContacts(updated);
  };

  // Save emergency contacts
  const handleSaveContacts = (e) => {
    e.preventDefault();
    // Simple validation
    for (let c of tempContacts) {
      if (!c.name.trim() || !c.phone.trim()) {
        showToast('All contact fields must be completed.', 'error');
        return;
      }
    }
    setContacts(tempContacts);
    setIsContactsModalOpen(false);
    showToast('Emergency contacts updated.', 'success');
  };

  // Handle Profile Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      showToast('Profile image updated successfully!', 'success');
    }
  };

  // Confirm logout
  const handleLogout = () => {
    setIsLogoutConfirmOpen(false);
    showToast('Logging out... Redirecting to home.', 'info');
    localStorage.removeItem('userInfo');
    setTimeout(() => {
      onNavigate('home');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen pb-2xl px-md md:px-gutter max-w-container-max mx-auto relative">

      {/* Back Button Section */}
      <div className="mb-lg animate-fade-up">
        <button
          className="flex items-center gap-xs text-primary font-label-md hover:gap-sm transition-all duration-300 cursor-pointer bg-transparent border-none p-0 focus:outline-none"
          onClick={() => onNavigate('home')}
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Back</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">

        {/* Left Column: User Overview */}
        <div className="lg:col-span-4 flex flex-col gap-lg animate-fade-up stagger-1">
          <div className="profile-card bg-surface-container-lowest rounded-xl p-xl flex flex-col items-center text-center border border-outline-variant/30">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-primary/10 overflow-hidden mb-lg relative">
                <img
                  className="w-full h-full object-cover select-none"
                  alt="Student Portrait"
                  src={profileImage}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  title="Change Avatar"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-none w-full h-full text-white focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[32px]">photo_camera</span>
                </button>
              </div>
            </div>

            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs select-text">
              {name}
            </h1>
            <p className="font-body-md text-on-surface-variant mb-xl select-text">
              Student ID: {studentId}
            </p>

            <div className="w-full flex flex-col gap-md">
              {!isEditing ? (
                <button
                  onClick={handleEditClick}
                  className="w-full bg-primary text-on-primary py-md rounded-lg font-label-md flex items-center justify-center gap-sm hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  Edit Profile
                </button>
              ) : (
                <div className="flex flex-col gap-sm w-full">
                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-green-750 text-white py-md rounded-lg font-label-md flex items-center justify-center gap-sm hover:bg-green-800 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">check</span>
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="w-full border border-outline text-on-surface py-md rounded-lg font-label-md flex items-center justify-center gap-sm hover:bg-surface-container transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                    Cancel
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="w-full border border-error text-error py-md rounded-lg font-label-md flex items-center justify-center gap-sm hover:bg-error/5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Logout
              </button>
            </div>
          </div>

          {/* Status Summary Card */}
          <div className="profile-card bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/30">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md select-none">
              Account Security
            </h3>
            <div className="flex items-center justify-between p-md bg-green-50 rounded-lg">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-green-600 select-none">verified_user</span>
                <span className="font-body-md text-green-800 font-medium select-none">Verified Identity</span>
              </div>
              <span className="material-symbols-outlined text-green-600 select-none">check_circle</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Information */}
        <div className="lg:col-span-8 flex flex-col gap-lg animate-fade-up stagger-2">

          {/* Information Bento Section */}
          <div className="profile-card bg-surface-container-lowest rounded-xl p-xl border border-outline-variant/30">
            <div className="flex items-center justify-between mb-xl">
              <h2 className="font-headline-md text-headline-md text-on-surface select-none">
                User Information
              </h2>
              <span className="material-symbols-outlined text-primary/40 select-none">person_outline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
              {/* Full Name */}
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant flex items-center gap-xs select-none">
                  <span className="material-symbols-outlined text-[18px]">person</span> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-md py-xs font-body-lg text-on-surface focus:outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold border-b border-outline-variant/20 pb-xs select-text">
                    {name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant flex items-center gap-xs select-none">
                  <span className="material-symbols-outlined text-[18px]">mail</span> Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-md py-xs font-body-lg text-on-surface focus:outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold border-b border-outline-variant/20 pb-xs select-text">
                    {email}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant flex items-center gap-xs select-none">
                  <span className="material-symbols-outlined text-[18px]">phone</span> Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-md py-xs font-body-lg text-on-surface focus:outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold border-b border-outline-variant/20 pb-xs select-text">
                    {phone}
                  </p>
                )}
              </div>

              {/* Campus Location */}
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant flex items-center gap-xs select-none">
                  <span className="material-symbols-outlined text-[18px]">location_on</span> Campus Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempLocation}
                    onChange={(e) => setTempLocation(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/50 rounded-lg px-md py-xs font-body-lg text-on-surface focus:outline-none focus:border-primary transition-all"
                  />
                ) : (
                  <p className="font-body-lg text-body-lg text-on-surface font-semibold border-b border-outline-variant/20 pb-xs select-text">
                    {location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="profile-card bg-surface-container-lowest rounded-xl p-xl border border-outline-variant/30">
            <div className="flex items-center justify-between mb-xl">
              <h2 className="font-headline-md text-headline-md text-on-surface select-none">
                Security &amp; Credentials
              </h2>
              <span className="material-symbols-outlined text-primary/40 select-none">lock</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-end">
              <div className="space-y-xs">
                <label className="font-label-md text-on-surface-variant flex items-center gap-xs select-none">
                  <span className="material-symbols-outlined text-[18px]">password</span> Password
                </label>
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-xs">
                  <p className="font-body-lg text-body-lg text-on-surface tracking-widest select-none">
                    ••••••••••••
                  </p>
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="text-primary font-label-md hover:underline cursor-pointer bg-transparent border-none p-0 focus:outline-none"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="p-md bg-surface-container rounded-lg flex items-center gap-md">
                <span className="material-symbols-outlined text-primary select-none">security</span>
                <p className="font-caption text-on-surface-variant leading-tight select-none">
                  {lastPasswordChangeDays === 0
                    ? "Password updated just now. We recommend keeping it secure and updated."
                    : `Last changed ${lastPasswordChangeDays} days ago. We recommend updating your password every 90 days for campus security.`}
                </p>
              </div>
            </div>
          </div>

          {/* Extra Interaction Card (Glassmorphism highlight) */}
          <div className="animate-fade-up stagger-3 bg-gradient-to-r from-primary to-secondary rounded-xl p-xl text-on-primary shadow-xl overflow-hidden relative">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-lg">
              <div>
                <h3 className="font-headline-md text-headline-md mb-xs select-none">Emergency Contacts</h3>
                <p className="font-body-md opacity-90 max-w-md select-none">
                  Ensure your emergency contact information is up to date for immediate campus assistance.
                </p>
              </div>
              <button
                onClick={handleOpenContacts}
                className="whitespace-nowrap bg-white text-primary px-xl py-md rounded-lg font-label-md hover:bg-secondary-fixed hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer border-none"
              >
                Manage Contacts
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10 select-none pointer-events-none">
              <span className="material-symbols-outlined text-[180px]">support_agent</span>
            </div>
          </div>

        </div>
      </div>

      {/* PASSWORD CHANGE MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl w-full max-w-[480px] shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface">Change Password</h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface bg-transparent border-none p-1 rounded-full cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-on-surface-variant">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface border border-outline-variant/50 rounded-lg px-md py-sm focus:outline-none focus:border-primary font-body-md"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-on-surface-variant">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface border border-outline-variant/50 rounded-lg px-md py-sm focus:outline-none focus:border-primary font-body-md"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-on-surface-variant">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface border border-outline-variant/50 rounded-lg px-md py-sm focus:outline-none focus:border-primary font-body-md"
                />
              </div>

              {passwordError && (
                <div className="p-sm bg-error-container/30 border border-error/10 text-error rounded-lg flex items-center gap-xs font-caption text-caption">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="flex gap-sm justify-end mt-md">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-lg py-md border border-outline text-on-surface rounded-lg font-label-md hover:bg-surface-container transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-lg py-md bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY CONTACTS MODAL */}
      {isContactsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl w-full max-w-[500px] shadow-2xl animate-fade-up">
            <div className="flex justify-between items-center mb-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface">Manage Emergency Contacts</h3>
              <button
                onClick={() => setIsContactsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface bg-transparent border-none p-1 rounded-full cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveContacts} className="flex flex-col gap-lg">
              {tempContacts.map((contact, index) => (
                <div key={index} className="p-md bg-surface-container rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                  <h4 className="font-label-md text-primary uppercase tracking-wider">
                    Contact #{index + 1}
                  </h4>

                  <div className="grid grid-cols-2 gap-sm">
                    <div className="flex flex-col gap-xs">
                      <label className="font-caption text-on-surface-variant">Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                        required
                        className="bg-surface border border-outline-variant/50 rounded-lg px-sm py-xs font-body-md"
                      />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-caption text-on-surface-variant">Relationship</label>
                      <input
                        type="text"
                        value={contact.relationship}
                        onChange={(e) => handleContactChange(index, 'relationship', e.target.value)}
                        required
                        className="bg-surface border border-outline-variant/50 rounded-lg px-sm py-xs font-body-md"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-caption text-on-surface-variant">Phone Number</label>
                    <input
                      type="text"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                      required
                      className="bg-surface border border-outline-variant/50 rounded-lg px-sm py-xs font-body-md"
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-sm justify-end mt-md">
                <button
                  type="button"
                  onClick={() => setIsContactsModalOpen(false)}
                  className="px-lg py-md border border-outline text-on-surface rounded-lg font-label-md hover:bg-surface-container transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-lg py-md bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-all active:scale-[0.98] cursor-pointer"
                >
                  Save Contacts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl w-full max-w-[400px] shadow-2xl text-center animate-fade-up">
            <span className="material-symbols-outlined text-[48px] text-error mb-md select-none">
              warning
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Confirm Logout</h3>
            <p className="font-body-md text-on-surface-variant mb-lg">
              Are you sure you want to log out of Secure My Campus? You will need to sign in again to access secure features.
            </p>

            <div className="flex gap-sm justify-center">
              <button
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-lg py-md border border-outline text-on-surface rounded-lg font-label-md hover:bg-surface-container transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-lg py-md bg-error text-white rounded-lg font-label-md hover:bg-red-700 transition-all active:scale-[0.98] cursor-pointer border-none"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-lg right-lg z-[200] flex items-center gap-sm bg-inverse-surface text-inverse-on-surface px-lg py-md rounded-xl shadow-2xl border border-outline-variant/20 animate-fade-in">
          <span className={`material-symbols-outlined ${
            toast.type === 'error' ? 'text-error' : toast.type === 'info' ? 'text-secondary' : 'text-tertiary'
          } select-none`}>
            {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
          </span>
          <span className="font-label-md">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
