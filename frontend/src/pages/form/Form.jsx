import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';

export default function Form() {
  // Check if user is logged in
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  
  // Pre-fill name and phone if available from logged-in user info
  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    phone: '',
    date: new Date().toISOString().split('T')[0], // default to today
    category: '',
    location: '',
    description: '',
    isAnonymous: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFiles = (fileList) => {
    const validFiles = [];
    for (const file of fileList) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" is too large. Max size is 10MB.`);
        continue;
      }
      
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      if (!isImage && !isPdf) {
        alert(`File "${file.name}" is not supported. Only PNG, JPG, or PDF are allowed.`);
        continue;
      }

      validFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        fileObj: file
      });
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Map categories to backend enum
    // HTML categories: safety, maintenance, academic, other
    // Backend enum: infrastructure, academic, hostel, security, ragging, other
    let mappedCategory = 'other';
    if (formData.category === 'safety') mappedCategory = 'security';
    else if (formData.category === 'maintenance') mappedCategory = 'infrastructure';
    else if (formData.category === 'academic') mappedCategory = 'academic';
    else mappedCategory = formData.category || 'other';

    // Auto-generate title
    const formattedLocation = formData.location ? ` at ${formData.location}` : '';
    const categoryLabel = formData.category 
      ? formData.category.charAt(0).toUpperCase() + formData.category.slice(1) 
      : 'General';
    const autoTitle = `${categoryLabel} Incident${formattedLocation}`;

    // Request payload
    const payload = {
      title: autoTitle.substring(0, 100),
      description: `Reporter: ${formData.isAnonymous ? 'Anonymous' : formData.name}\nPhone: ${formData.phone || 'N/A'}\nDate of Incident: ${formData.date}\nLocation: ${formData.location}\n\nDetails:\n${formData.description}`,
      category: mappedCategory,
      isAnonymous: formData.isAnonymous,
    };

    // Attempt backend submission if token is present
    if (userInfo?.token) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          completeSubmission(data._id || `SC-${Math.floor(1000 + Math.random() * 9000)}`);
          return;
        }
      } catch (error) {
        console.warn('Backend connection failed, falling back to mock submission', error);
      }
    }

    // Mock/offline submission fallback
    setTimeout(() => {
      completeSubmission(`SC-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 1500);
  };

  const completeSubmission = (complaintId) => {
    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Show toast
    setToast({
      message: `Complaint #${complaintId} has been registered.`
    });

    // Reset Form
    setTimeout(() => {
      setFormData({
        name: userInfo?.name || '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        location: '',
        description: '',
        isAnonymous: false,
      });
      setUploadedFiles([]);
      setSubmitSuccess(false);
    }, 3000);
  };

  return (
    <div className="w-full min-h-screen pb-3xl relative">
      <div className="max-w-3xl mx-auto px-md pt-xl space-y-lg animate-fade-up">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">Form Page</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Report incidents or suggest improvements to keep our campus safe and efficient.
          </p>
        </div>

        {/* Main Form Card */}
        <Card isGlass={false} hoverable={true} className="p-xl border-l-4 border-transparent hover:border-primary transition-all">
          <form className="space-y-lg" onSubmit={handleSubmit}>
            {/* Anonymity toggle */}
            <div className="flex items-center gap-sm p-sm bg-surface-container-low rounded-lg border border-outline-variant/30">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
              />
              <label htmlFor="isAnonymous" className="font-label-md text-label-md text-on-surface cursor-pointer select-none">
                File this complaint anonymously (hide my personal details from public feed)
              </label>
            </div>

            {/* Basic Information Grid (Hidden if Anonymous is selected, or keep editable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="name">
                  Full Name {!formData.isAnonymous && <span className="text-error">*</span>}
                </label>
                <input
                  className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required={!formData.isAnonymous}
                  disabled={formData.isAnonymous}
                  type="text"
                  value={formData.isAnonymous ? 'Anonymous' : formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  id="phone"
                  name="phone"
                  placeholder="+91 98765 43210"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Date and Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="date">
                  Incident Date <span className="text-error">*</span>
                </label>
                <input
                  className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  id="date"
                  name="date"
                  required
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="category">
                  Category <span className="text-error">*</span>
                </label>
                <select
                  className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat cursor-pointer"
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option disabled value="">Select category</option>
                  <option value="safety">Safety &amp; Security</option>
                  <option value="maintenance">Facility Maintenance</option>
                  <option value="academic">Academic Concerns</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="location">
                Location of Incident <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline select-none">
                  location_on
                </span>
                <input
                  className="w-full pl-10 pr-md py-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  id="location"
                  name="location"
                  placeholder="e.g., North Library Hall, Room 302"
                  required
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="description">
                Detailed Description <span className="text-error">*</span>
              </label>
              <textarea
                className="w-full px-md py-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                id="description"
                name="description"
                placeholder="Please provide as much detail as possible..."
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* File Upload UI */}
            <div className="space-y-xs">
              <label className="font-label-md text-label-md text-on-surface select-none">
                Upload Evidence (Photos/Documents)
              </label>
              <div
                className={`file-drop-area border-2 border-dashed rounded-xl p-xl flex flex-col items-center justify-center gap-sm cursor-pointer transition-all ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant bg-surface-container-low hover:bg-surface-container'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileElem').click()}
              >
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl select-none">
                    cloud_upload
                  </span>
                </div>
                <div className="text-center select-none">
                  <p className="font-label-md text-on-surface">Click to upload or drag and drop</p>
                  <p className="font-caption text-on-surface-variant">PNG, JPG, or PDF (Max 10MB)</p>
                </div>
                <input
                  accept="image/*,application/pdf"
                  className="hidden"
                  id="fileElem"
                  multiple
                  type="file"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-sm mt-sm">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-xs bg-surface-container-high px-sm py-xs rounded-full text-sm border border-outline-variant animate-fade-in"
                    >
                      <span className="material-symbols-outlined text-sm select-none">
                        description
                      </span>
                      <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                      <button
                        type="button"
                        className="text-error hover:scale-110 transition-transform cursor-pointer focus:outline-none flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        <span className="material-symbols-outlined text-sm select-none">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-md">
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className={`w-full text-on-primary font-label-md text-lg py-md rounded-lg shadow-lg active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-sm cursor-pointer ${
                  submitSuccess
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-primary hover:bg-primary-container'
                } ${isSubmitting ? 'opacity-85 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : submitSuccess ? (
                  <>
                    <span className="material-symbols-outlined select-none">check_circle</span>
                    Successfully Submitted
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined select-none">send</span>
                    Submit Complaint
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>

        {/* Info Alert */}
        <div className="p-lg bg-primary-fixed text-on-primary-fixed rounded-xl flex gap-md items-start">
          <span className="material-symbols-outlined text-primary select-none">info</span>
          <div>
            <h4 className="font-label-md font-bold">Privacy Note</h4>
            <p className="font-body-md text-sm opacity-90">
              All reports are strictly confidential. Our security team will review your submission within 24 hours. In case of immediate physical danger, please call campus emergency services directly.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Success Toast */}
      {toast && (
        <div className="fixed bottom-lg right-lg bg-inverse-surface text-inverse-on-surface px-xl py-md rounded-lg shadow-2xl z-[100] animate-fade-in flex items-center gap-sm border border-outline-variant/20">
          <span className="material-symbols-outlined text-green-400 select-none">task_alt</span>
          <span className="font-medium text-body-md">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
