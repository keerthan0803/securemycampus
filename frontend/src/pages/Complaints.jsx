import React, { useState, useEffect } from 'react';

export default function Complaints({ onNavigate }) {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [flippedCards, setFlippedCards] = useState({});

  // Submit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('harassment');
  const [newLocation, setNewLocation] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newImage, setNewImage] = useState(null);

  // Fetch complaints from backend
  useEffect(() => {
    const userInfoStr = localStorage.getItem('userInfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    const token = userInfo ? (userInfo.token || userInfo.accessToken) : null;
    
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/api/complaints`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
         if (Array.isArray(data)) {
           const mappedComplaints = data
             .filter(c => c.status !== 'dismissed')
             .map(c => ({
             id: c._id,
             title: c.title,
             description: c.description,
             fullText: c.description,
             category: c.category,
             status: c.status,
             priority: c.priority || 'medium',
             location: c.location || 'Campus',
             city: 'Hyderabad',
             phone: c.phone || 'N/A',
             date: new Date(c.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
             }),
             timeLeft: 7200,
             image: (c.attachments && c.attachments.length > 0) 
               ? c.attachments[0] 
               : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
           }));
           setComplaints(mappedComplaints);
         }
         setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Timer simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setComplaints((prevComplaints) =>
        prevComplaints.map((c) => {
          if (c.status !== 'resolved' && c.timeLeft > 0) {
            return { ...c, timeLeft: c.timeLeft - 1 };
          }
          return c;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    if (seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCardClick = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSolve = async (id, e) => {
    e.stopPropagation();
    
    const userInfoStr = localStorage.getItem('userInfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    const token = userInfo ? (userInfo.token || userInfo.accessToken) : null;

    try {
      if (token) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'resolved' })
        });
        if (!res.ok) throw new Error('Failed to solve on server');
      }
      
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            return { ...c, status: 'resolved', timeLeft: 0 };
          }
          return c;
        })
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDismiss = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to dismiss this complaint?')) {
      const userInfoStr = localStorage.getItem('userInfo');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
      const token = userInfo ? (userInfo.token || userInfo.accessToken) : null;

      try {
        if (token) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints/${id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'dismissed' })
          });
          if (!res.ok) throw new Error('Failed to dismiss on server');
        }

        setComplaints((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newLocation) {
      alert('Please fill out all required fields.');
      return;
    }

    const userInfoStr = localStorage.getItem('userInfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
    const token = userInfo ? (userInfo.token || userInfo.accessToken) : null;
    
    if (!token) {
      alert('You must be logged in to report an issue. Please go back to the home page and sign in.');
      return;
    }

    let base64Image = null;
    if (newImage) {
      try {
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(newImage);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      } catch (err) {
        alert('Failed to process image file. Please try again.');
        return;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          priority: newPriority,
          location: newLocation,
          phone: newPhone,
          isAnonymous: false,
          attachments: base64Image ? [base64Image] : []
        })
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('userInfo');
          alert('Your session has expired. Please sign in again.');
          if (onNavigate) onNavigate('signin');
          return;
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit complaint. Please try again.');
      }

      const data = await res.json();

      const newComplaintObj = {
        id: data._id,
        title: data.title,
        description: data.description,
        fullText: data.description,
        category: data.category,
        status: data.status,
        priority: data.priority || newPriority,
        location: data.location || newLocation,
        city: 'Hyderabad',
        phone: data.phone || newPhone || '+91 99999 88888',
        date: new Date(data.createdAt).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        timeLeft: newPriority === 'high' ? 3600 : newPriority === 'medium' ? 7200 : 10800,
        image: (data.attachments && data.attachments.length > 0)
          ? data.attachments[0]
          : 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      };

      setComplaints([newComplaintObj, ...complaints]);
      setIsModalOpen(false);

      // Reset Form
      setNewTitle('');
      setNewDesc('');
      setNewCategory('harassment');
      setNewLocation('');
      setNewPhone('');
      setNewPriority('medium');
      setNewImage(null);

    } catch (err) {
      alert(err.message);
    }
  };

  // Filter complaints list
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="w-full min-h-screen pb-3xl relative">
      {/* Hero section */}
      <section className="relative pt-xl pb-md px-gutter max-w-container-max mx-auto">
        <div className="mb-lg">
          <h1 className="font-display-lg text-display-lg text-primary mb-sm">Complaints</h1>
          <p className="text-on-surface-variant max-w-2xl font-body-lg text-body-lg">
            Maintain campus safety by monitoring and resolving reported issues. Filter through real-time complaints and take immediate action.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-40 py-md mb-xl">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg p-md border border-outline-variant flex flex-col md:flex-row gap-md items-center w-full">
            <div className="relative w-full md:flex-1">
              <span className="absolute left-md top-1/2 -translate-y-1/2 text-outline material-symbols-outlined select-none">
                search
              </span>
              <input
                className="w-full pl-3xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none font-body-md"
                placeholder="Search by complaint title or ID..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-sm w-full md:w-auto">
              <select
                className="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-label-md text-label-md text-on-surface-variant focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="harassment">Harassment</option>
                <option value="lost_found">Lost &amp; Found</option>
                <option value="food">Food Issue</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <select
                className="bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm font-label-md text-label-md text-on-surface-variant focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        {isLoading ? (
          <div className="flex justify-center py-3xl w-full">
            <span className="material-symbols-outlined animate-spin text-primary text-[48px]">autorenew</span>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-3xl text-center w-full">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-lg">
              <span className="material-symbols-outlined text-primary text-[48px] select-none">inbox</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-xs">No complaints yet</h3>
            <p className="text-on-surface-variant">There are currently no complaints in the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-xl">
            {filteredComplaints.map((c) => {
              const isFlipped = !!flippedCards[c.id];
              return (
                <div
                  key={c.id}
                  className="card-container group select-none"
                  onClick={() => handleCardClick(c.id)}
                >
                  <div className={`card-inner shadow-sm hover:shadow-lg transition-all duration-500 ${isFlipped ? 'is-flipped' : ''}`}>
                    {/* Front Face */}
                    <div className={`card-front bg-surface-container-lowest border border-outline-variant flex flex-col ${c.status === 'resolved' ? 'opacity-75' : ''}`}>
                      <div className="h-48 overflow-hidden relative">
                        <img
                          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${c.status === 'resolved' ? 'grayscale' : ''}`}
                          src={c.image}
                          alt={c.title}
                        />
                        <div className={`absolute top-md right-md px-sm py-xs rounded-full font-label-md text-[10px] uppercase tracking-wider text-white ${c.status === 'resolved'
                            ? 'bg-primary'
                            : c.priority === 'high'
                              ? 'bg-error'
                              : c.priority === 'medium'
                                ? 'bg-secondary'
                                : 'bg-outline'
                          }`}>
                          {c.status === 'resolved' ? 'Resolved' : c.status === 'investigating' ? 'In Progress' : `${c.priority} Priority`}
                        </div>
                      </div>
                      <div className="p-lg flex flex-col flex-grow">
                        <h3 className="font-headline-md text-headline-md text-primary mb-xs">{c.title}</h3>
                        <p className="text-on-surface-variant line-clamp-2 mb-xl">{c.description}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <span className="text-primary font-label-md text-label-md flex items-center gap-xs">
                            Click to view details
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </span>
                          <span className="text-outline font-caption text-caption">#{c.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className="card-back bg-surface border-2 border-primary/20 flex flex-col p-lg">
                      <div className="flex justify-between items-start mb-md">
                        <div>
                          <span className="bg-primary/10 text-primary px-sm py-xs rounded-lg font-label-md text-[10px] uppercase mb-xs inline-block">
                            {c.category}
                          </span>
                          <h4 className="font-headline-md text-[20px] text-primary">{c.title.split(' - ')[0]}</h4>
                        </div>
                        <div className="bg-surface-container-high px-md py-sm rounded-lg text-center min-w-[70px]">
                          {c.status === 'resolved' ? (
                            <>
                              <span className="block font-label-md text-label-md text-primary select-none">00:00</span>
                              <span className="text-[10px] text-outline uppercase select-none font-semibold">Completed</span>
                            </>
                          ) : (
                            <>
                              <span className="block font-label-md text-label-md text-primary">{formatTimer(c.timeLeft)}</span>
                              <span className="text-[10px] text-outline uppercase font-semibold">Time Left</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-sm mb-lg">
                        <div className="flex items-center gap-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary text-[20px] select-none">calendar_today</span>
                          <span className="text-body-md">{c.date}</span>
                        </div>
                        <div className="flex items-center gap-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary text-[20px] select-none">call</span>
                          <span className="text-body-md">{c.phone}</span>
                        </div>
                        <div className="flex items-center gap-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary text-[20px] select-none">location_on</span>
                          <span className="text-body-md">{c.location}</span>
                        </div>
                      </div>

                      <p className="text-on-surface-variant text-body-md line-clamp-4 mb-lg italic border-l-4 border-primary/20 pl-md">
                        "{c.fullText}"
                      </p>

                      <div className="mt-auto grid grid-cols-2 gap-md">
                        {c.status === 'resolved' ? (
                          <button
                            className="bg-surface-container-high text-outline py-sm rounded-lg font-label-md flex items-center justify-center gap-xs cursor-not-allowed border border-outline-variant/30"
                            disabled
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="material-symbols-outlined text-[18px]">done_all</span>
                            Resolved
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleSolve(c.id, e)}
                            className="bg-primary text-on-primary py-sm rounded-lg font-label-md flex items-center justify-center gap-xs hover:bg-secondary transition-all active:scale-95 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            Solve
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDismiss(c.id, e)}
                          className="border border-error text-error py-sm rounded-lg font-label-md flex items-center justify-center gap-xs hover:bg-error/10 transition-all active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                          {c.status === 'resolved' ? 'Archive' : 'Dismiss'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAB Floating action button */}
      <button
        onClick={() => {
          const userInfoStr = localStorage.getItem('userInfo');
          const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
          const token = userInfo ? (userInfo.token || userInfo.accessToken) : null;
          
          if (!token) {
            if (onNavigate) onNavigate('signin');
            return;
          }
          setIsModalOpen(true);
        }}
        className="fixed bottom-xl right-xl z-50 bg-primary text-on-primary px-xl py-md rounded-full shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-sm font-label-md group cursor-pointer border-none focus:outline-none"
      >
        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform select-none">add_alert</span>
        Report an Issue
      </button>

      {/* Report an Issue Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-md pt-24 animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-slide-up max-h-[calc(100vh-7rem)]">
            <div className="flex justify-between items-center p-lg border-b border-outline-variant/30 bg-surface shrink-0">
              <h2 className="font-headline-md text-headline-md text-primary flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">add_alert</span>
                Report Campus Issue
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer p-xs hover:bg-surface-container-high rounded-full select-none"
              >
                close
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="p-lg space-y-md overflow-y-auto">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="title">
                  Subject / Title <span className="text-error">*</span>
                </label>
                <input
                  id="title"
                  className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md"
                  placeholder="e.g. Water Leak in Admin Block"
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="category">
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    id="category"
                    className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md cursor-pointer"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="harassment">Harassment</option>
                    <option value="lost_found">Lost &amp; Found</option>
                    <option value="food">Food Issue</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="priority">
                    Priority Level <span className="text-error">*</span>
                  </label>
                  <select
                    id="priority"
                    className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md cursor-pointer"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="location">
                  Location Details <span className="text-error">*</span>
                </label>
                <input
                  id="location"
                  className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md"
                  placeholder="e.g. CSE Block, 2nd Floor Corridor"
                  required
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="phone">
                  Contact Number (Optional)
                </label>
                <input
                  id="phone"
                  className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md"
                  placeholder="e.g. +91 99887 76655"
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="image">
                  Attach Image (Optional)
                </label>
                <input
                  id="image"
                  className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer mb-md"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImage(e.target.files[0])}
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-xs" htmlFor="desc">
                  Issue Description <span className="text-error">*</span>
                </label>
                <textarea
                  id="desc"
                  className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-md h-24 resize-none"
                  placeholder="Explain the safety alert or incident in details..."
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="pt-sm flex gap-md">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-sm border border-outline-variant text-on-surface-variant font-label-md rounded-lg active:scale-95 transition-all cursor-pointer hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-sm bg-primary text-on-primary font-label-md rounded-lg active:scale-95 transition-all cursor-pointer hover:bg-primary-container shadow-md"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
