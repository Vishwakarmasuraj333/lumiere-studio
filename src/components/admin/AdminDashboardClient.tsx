"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  Shield,
  Search,
  Filter,
  Eye,
  Edit,
  Save,
  X,
  Upload,
  RefreshCw,
  Lock,
  Key,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  mustChangePassword?: boolean;
}

interface BookingRecord {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  location: string;
  guestCount?: string | null;
  message?: string | null;
  status: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PhotoRecord {
  id: string;
  title: string;
  category: string;
  description?: string | null;
  imageUrl: string;
  cameraModel?: string | null;
  lensInfo?: string | null;
  aperture?: string | null;
  location?: string | null;
  year?: string | null;
  orientation: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface InquiryRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface StudioSettingRecord {
  id: string;
  studioName: string;
  tagline: string;
  heroHeading: string;
  phone: string;
  email: string;
  address: string;
  parisAddress: string;
  instagramUrl: string;
  awardsCount: number;
  yearsExperience: number;
  eventsCount: number;
  clientsRating: number;
  updatedAt: string;
}

interface StatsData {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalPhotos: number;
  photosByCategory: Record<string, number>;
  totalInquiries: number;
  unreadInquiries: number;
  recentBookings: BookingRecord[];
  recentInquiries: InquiryRecord[];
}

export default function AdminDashboardClient({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "photos" | "inquiries" | "settings"
  >("overview");

  const [stats, setStats] = useState<StatsData | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [settings, setSettings] = useState<StudioSettingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter & Search states
  const [bookingFilter, setBookingFilter] = useState("ALL");
  const [photoFilter, setPhotoFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Photo modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoRecord | null>(null);
  const [photoFormData, setPhotoFormData] = useState({
    title: "",
    category: "Wedding",
    description: "",
    imageUrl: "",
    cameraModel: "Hasselblad H6D-100c",
    lensInfo: "HC 2,2/100mm",
    aperture: "f/2.2",
    location: "Paris, France",
    year: "2025",
    orientation: "portrait",
    featured: false,
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Booking detail modal
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<Partial<StudioSettingRecord>>({});
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Security & Password state
  const [mustChangePassword, setMustChangePassword] = useState(
    Boolean(user.mustChangePassword)
  );
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(
    Boolean(user.mustChangePassword)
  );
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passphrase and confirmation do not match.");
      return;
    }

    try {
      setPasswordSubmitting(true);
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update passphrase.");
      }

      setPasswordSuccess(true);
      setMustChangePassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setPasswordSuccess(false);
        setIsPasswordModalOpen(false);
      }, 2500);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Error updating passphrase.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const fetchAllData = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      const [statsRes, bookingsRes, photosRes, inquiriesRes, settingsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/bookings"),
        fetch("/api/photos"),
        fetch("/api/contact"),
        fetch("/api/studio"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
      if (photosRes.ok) setPhotos(await photosRes.json());
      if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
      if (settingsRes.ok) {
        const s = await settingsRes.json();
        setSettings(s);
        setSettingsForm(s);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllData(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAllData]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  // Status Change for Bookings
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(updated);
        }
        fetchAllData(false);
      }
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Permanently archive this appointment record?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(null);
        }
        fetchAllData(false);
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  // Mark Inquiry Read/Unread
  const handleToggleReadInquiry = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentRead }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries((prev) => prev.map((inq) => (inq.id === id ? updated : inq)));
        fetchAllData(false);
      }
    } catch (err) {
      console.error("Error toggling inquiry read status:", err);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Remove this client message?")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        fetchAllData(false);
      }
    } catch (err) {
      console.error("Error deleting inquiry:", err);
    }
  };

  // Open Modal for New Photo
  const handleOpenNewPhotoModal = () => {
    setEditingPhoto(null);
    setPhotoFormData({
      title: "",
      category: "Wedding",
      description: "",
      imageUrl: "",
      cameraModel: "Hasselblad H6D-100c",
      lensInfo: "HC 2,2/100mm",
      aperture: "f/2.2",
      location: "Paris, France",
      year: "2025",
      orientation: "portrait",
      featured: false,
    });
    setUploadFile(null);
    setIsPhotoModalOpen(true);
  };

  const handleEditPhoto = (photo: PhotoRecord) => {
    setEditingPhoto(photo);
    setPhotoFormData({
      title: photo.title,
      category: photo.category,
      description: photo.description || "",
      imageUrl: photo.imageUrl,
      cameraModel: photo.cameraModel || "Hasselblad H6D-100c",
      lensInfo: photo.lensInfo || "HC 2,2/100mm",
      aperture: photo.aperture || "f/2.2",
      location: photo.location || "",
      year: photo.year || "2025",
      orientation: photo.orientation || "portrait",
      featured: Boolean(photo.featured),
    });
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      let finalImageUrl = photoFormData.imageUrl;

      // Handle file upload if present
      if (uploadFile) {
        const uploadData = new FormData();
        uploadData.append("file", uploadFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadJson.error || "Image upload failed");
        }
        finalImageUrl = uploadJson.url;
      }

      if (!finalImageUrl) {
        alert("Please provide an image URL or upload a photograph file.");
        return;
      }

      const payload = {
        ...photoFormData,
        imageUrl: finalImageUrl,
      };

      if (editingPhoto) {
        const res = await fetch(`/api/photos/${editingPhoto.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setIsPhotoModalOpen(false);
          fetchAllData(false);
        }
      } else {
        const res = await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setPhotos((prev) => [created, ...prev]);
          setIsPhotoModalOpen(false);
          fetchAllData(false);
        }
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving photograph");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!window.confirm("Permanently remove this master photograph?")) return;
    try {
      const res = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        fetchAllData(false);
      }
    } catch (err) {
      console.error("Error deleting photo:", err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/studio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error("Error saving studio settings:", err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter !== "ALL" && b.status !== bookingFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.fullName?.toLowerCase().includes(q) ||
        b.email?.toLowerCase().includes(q) ||
        b.reference?.toLowerCase().includes(q) ||
        b.service?.toLowerCase().includes(q) ||
        b.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredPhotos = photos.filter((p) => {
    if (photoFilter !== "ALL" && p.category.toLowerCase() !== photoFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-[#121212] border-b border-[#D6B77A]/25 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[#D6B77A]/70 flex items-center justify-center bg-[#D6B77A]/10">
              <Camera className="w-4 h-4 text-[#D6B77A]" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-[0.2em] font-medium text-white block">
                {settings?.studioName || "LUMIÈRE STUDIO"}
              </span>
              <span className="text-[8px] tracking-[0.3em] text-[#D6B77A] uppercase -mt-0.5 block font-mono">
                Admin Control Room
              </span>
            </div>
          </Link>

          {/* Quick live preview link */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-[#A7A29A] hover:text-[#D6B77A] border border-white/10 px-3 py-1.5 rounded transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => fetchAllData(true)}
            title="Refresh Data"
            className={`p-2 rounded-full border border-white/10 hover:border-[#D6B77A] text-[#A7A29A] hover:text-white transition-colors ${
              refreshing ? "animate-spin text-[#D6B77A]" : ""
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-medium text-white">{user.name}</span>
            <span className="text-[10px] text-[#D6B77A] font-mono">{user.email}</span>
          </div>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            title="Change Passphrase"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded bg-[#D6B77A]/10 hover:bg-[#D6B77A]/20 border border-[#D6B77A]/30 text-xs text-[#D6B77A] transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Passphrase</span>
          </button>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="flex items-center space-x-1.5 px-3 py-2 rounded bg-white/5 hover:bg-red-950/60 hover:text-red-300 border border-white/10 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout with Sidebar & Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0e0e0e] border-r border-white/10 p-4 space-y-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-colors ${
              activeTab === "overview"
                ? "bg-[#D6B77A] text-[#090909] font-bold shadow"
                : "text-[#A7A29A] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-colors ${
              activeTab === "bookings"
                ? "bg-[#D6B77A] text-[#090909] font-bold shadow"
                : "text-[#A7A29A] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </div>
            {stats?.pendingBookings ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {stats.pendingBookings}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab("photos")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-colors ${
              activeTab === "photos"
                ? "bg-[#D6B77A] text-[#090909] font-bold shadow"
                : "text-[#A7A29A] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <ImageIcon className="w-4 h-4" />
              <span>Photographs</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">{photos.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-colors ${
              activeTab === "inquiries"
                ? "bg-[#D6B77A] text-[#090909] font-bold shadow"
                : "text-[#A7A29A] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            {stats?.unreadInquiries ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {stats.unreadInquiries}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs tracking-wider uppercase font-medium transition-colors ${
              activeTab === "settings"
                ? "bg-[#D6B77A] text-[#090909] font-bold shadow"
                : "text-[#A7A29A] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-4 h-4" />
              <span>Studio Config</span>
            </div>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {/* Security Alert Banner for Default Credentials */}
          {mustChangePassword && (
            <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-xs uppercase tracking-wider block">
                    Default Passphrase Active
                  </span>
                  <p className="text-xs text-amber-200/80">
                    You are logged in with default demo credentials. Update your administrative passphrase to secure bookings and client records in production.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-4 py-2 rounded bg-gradient-to-r from-[#ECC880] to-[#D6B77A] text-[#090909] text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 self-start sm:self-auto hover:shadow-lg transition-all"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Update Now</span>
              </button>
            </div>
          )}

          {/* Loading state indicator */}
          {loading && !stats && (
            <div className="flex items-center justify-center py-20 text-[#D6B77A]">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-10">
              <div>
                <h2 className="font-serif text-3xl text-white">Dashboard Intelligence</h2>
                <p className="text-xs text-[#A7A29A] mt-1 font-light">
                  Live metrics, appointments, and studio operational status.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#141414] border border-[#D6B77A]/25 p-6 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-[#A7A29A]">Total Bookings</span>
                    <Calendar className="w-4 h-4 text-[#D6B77A]" />
                  </div>
                  <div className="font-serif text-3xl text-white font-medium">
                    {stats?.totalBookings ?? "..."}
                  </div>
                  <p className="text-[10px] text-[#A7A29A]">Across all luxury categories</p>
                </div>

                <div className="bg-[#141414] border border-amber-500/30 p-6 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-amber-300">Pending Review</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-3xl text-amber-300 font-medium">
                    {stats?.pendingBookings ?? "..."}
                  </div>
                  <p className="text-[10px] text-[#A7A29A]">Awaiting director approval</p>
                </div>

                <div className="bg-[#141414] border border-[#D6B77A]/25 p-6 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-[#A7A29A]">Confirmed Itineraries</span>
                    <CheckCircle className="w-4 h-4 text-[#D6B77A]" />
                  </div>
                  <div className="font-serif text-3xl text-white font-medium">
                    {stats?.confirmedBookings ?? "..."}
                  </div>
                  <p className="text-[10px] text-[#A7A29A]">Upcoming photo sessions</p>
                </div>

                <div className="bg-[#141414] border border-[#D6B77A]/25 p-6 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-[#A7A29A]">Curated Works</span>
                    <ImageIcon className="w-4 h-4 text-[#D6B77A]" />
                  </div>
                  <div className="font-serif text-3xl text-white font-medium">
                    {stats?.totalPhotos ?? "..."}
                  </div>
                  <p className="text-[10px] text-[#A7A29A]">In public gallery archive</p>
                </div>
              </div>

              {/* Recent Bookings and Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Bookings List */}
                <div className="lg:col-span-7 bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-white">Recent Client Inquiries</h3>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs text-[#D6B77A] hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {bookings.slice(0, 4).map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setSelectedBooking(b);
                          setActiveTab("bookings");
                        }}
                        className="p-3.5 rounded-lg bg-[#0d0d0d] border border-white/5 hover:border-[#D6B77A]/40 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs text-[#D6B77A] font-semibold">
                              {b.reference}
                            </span>
                            <span className="text-white text-xs font-medium">{b.fullName}</span>
                          </div>
                          <p className="text-[11px] text-[#A7A29A] mt-0.5">
                            {b.service} · {b.location} · {b.preferredDate}
                          </p>
                        </div>

                        <span
                          className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded font-semibold ${
                            b.status === "CONFIRMED"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : b.status === "PENDING"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : b.status === "COMPLETED"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Studio Controls & Category breakdown */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-4">
                    <h3 className="font-serif text-lg text-white">Executive Actions</h3>
                    <div className="space-y-2.5">
                      <button
                        onClick={handleOpenNewPhotoModal}
                        className="w-full py-3 px-4 rounded-lg bg-[#D6B77A] text-[#090909] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#ECC880] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Photograph</span>
                      </button>

                      <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="w-full py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#D6B77A]" />
                        <span>Security & Passphrase</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("settings")}
                        className="w-full py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#D6B77A]" />
                        <span>Edit Studio Configurations</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#141414] border border-white/10 rounded-xl p-6 space-y-3">
                    <h3 className="font-serif text-base text-white">Portfolio by Category</h3>
                    <div className="space-y-2 text-xs">
                      {["Wedding", "Fashion", "Portrait", "Nature", "Commercial", "Events"].map(
                        (cat) => {
                          const count = photos.filter((p) => p.category === cat).length;
                          return (
                            <div
                              key={cat}
                              className="p-2.5 rounded bg-[#0d0d0d] flex items-center justify-between"
                            >
                              <span className="text-[#A7A29A]">{cat}</span>
                              <span className="font-mono text-[#D6B77A] font-semibold">{count}</span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl text-white">Appointment Bookings</h2>
                  <p className="text-xs text-[#A7A29A] mt-1 font-light">
                    Manage client itineraries, confirmation status, and notes.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search bookings..."
                      className="pl-8 pr-3 py-1.5 rounded bg-[#141414] border border-white/10 text-xs text-white placeholder-[#757067] focus:outline-none focus:border-[#D6B77A]"
                    />
                    <Search className="w-3.5 h-3.5 text-[#A7A29A] absolute left-2.5 top-2.5" />
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 sm:pb-0">
                    <Filter className="w-3.5 h-3.5 text-[#A7A29A] hidden sm:inline" />
                    {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setBookingFilter(st)}
                        className={`px-2.5 py-1.5 rounded text-[11px] font-mono tracking-wider transition-colors ${
                          bookingFilter === st
                            ? "bg-[#D6B77A] text-[#090909] font-bold"
                            : "bg-white/5 text-[#A7A29A] hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0e0e0e] border-b border-white/10 text-[#A7A29A] font-mono uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Ref</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Date & Venue</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#A7A29A]">
                            No bookings found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4 font-mono font-semibold text-[#D6B77A]">
                              {b.reference}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium text-white">{b.fullName}</div>
                              <div className="text-[#A7A29A] text-[11px]">{b.email}</div>
                              <div className="text-[#A7A29A] text-[11px]">{b.phone}</div>
                            </td>
                            <td className="py-4 px-4 text-[#F5F1E9]">{b.service}</td>
                            <td className="py-4 px-4">
                              <div className="text-white">{b.preferredDate}</div>
                              <div className="text-[#A7A29A] text-[11px]">{b.location}</div>
                            </td>
                            <td className="py-4 px-4">
                              <select
                                value={b.status}
                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                className={`text-[10px] font-mono uppercase px-2 py-1 rounded font-semibold cursor-pointer appearance-none bg-[#0a0a0a] border ${
                                  b.status === "CONFIRMED"
                                    ? "text-green-300 border-green-500/40"
                                    : b.status === "PENDING"
                                    ? "text-amber-300 border-amber-500/40"
                                    : b.status === "COMPLETED"
                                    ? "text-blue-300 border-blue-500/40"
                                    : "text-red-300 border-red-500/40"
                                }`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button
                                onClick={() => setSelectedBooking(b)}
                                className="p-1.5 rounded hover:bg-white/10 text-[#A7A29A] hover:text-white"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="p-1.5 rounded hover:bg-red-950/60 text-red-400 hover:text-red-300"
                                title="Delete Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHOTOGRAPHS */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl text-white">Photographic Archive</h2>
                  <p className="text-xs text-[#A7A29A] mt-1 font-light">
                    Manage museum-grade gallery files, EXIF specifications, and feature status.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search photos..."
                      className="pl-8 pr-3 py-1.5 rounded bg-[#141414] border border-white/10 text-xs text-white placeholder-[#757067] focus:outline-none focus:border-[#D6B77A]"
                    />
                    <Search className="w-3.5 h-3.5 text-[#A7A29A] absolute left-2.5 top-2.5" />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={photoFilter}
                    onChange={(e) => setPhotoFilter(e.target.value)}
                    className="px-3 py-1.5 rounded bg-[#141414] border border-white/10 text-xs text-white"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Nature">Nature</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Events">Events</option>
                  </select>

                  <button
                    onClick={handleOpenNewPhotoModal}
                    className="px-4 py-2 rounded bg-[#D6B77A] text-[#090909] text-xs font-bold tracking-wider uppercase flex items-center space-x-2 hover:bg-[#ECC880] transition-colors shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo</span>
                  </button>
                </div>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#D6B77A]/50 transition-colors"
                  >
                    <div className="relative w-full h-48 bg-black">
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {photo.featured && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase bg-[#D6B77A] text-black font-bold">
                          Featured
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/70 text-white backdrop-blur">
                        {photo.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-base text-white font-medium line-clamp-1">
                          {photo.title}
                        </h4>
                        <p className="text-[11px] text-[#A7A29A] line-clamp-1">
                          {photo.location} · {photo.year}
                        </p>
                        <p className="text-[10px] text-[#757067] font-mono mt-1">
                          {photo.cameraModel} · {photo.lensInfo}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <button
                          onClick={() => handleEditPhoto(photo)}
                          className="text-[#D6B77A] hover:underline flex items-center space-x-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="text-red-400 hover:text-red-300 flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-3xl text-white">Client Inquiries</h2>
                <p className="text-xs text-[#A7A29A] mt-1 font-light">
                  Direct correspondence received from the public website contact form.
                </p>
              </div>

              <div className="space-y-4">
                {inquiries.length === 0 ? (
                  <div className="p-8 text-center text-[#A7A29A] bg-[#141414] rounded-xl border border-white/10">
                    No inquiries received yet.
                  </div>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className={`p-6 rounded-xl border transition-colors ${
                        inq.isRead
                          ? "bg-[#111111] border-white/5"
                          : "bg-[#141414] border-blue-500/30 shadow-lg"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center space-x-3">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              inq.isRead ? "bg-white/20" : "bg-blue-400"
                            }`}
                          />
                          <h4 className="font-serif text-lg font-medium text-white">
                            {inq.subject}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-[#A7A29A]">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-xs text-[#D6B77A] mb-3">
                        From: <span className="font-medium text-white">{inq.fullName}</span> (
                        {inq.email} {inq.phone ? `· ${inq.phone}` : ""})
                      </div>

                      <p className="text-sm text-[#A7A29A] leading-relaxed font-light whitespace-pre-wrap bg-[#0a0a0a] p-4 rounded-lg border border-white/5">
                        {inq.message}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end space-x-4 text-xs">
                        <button
                          onClick={() => handleToggleReadInquiry(inq.id, inq.isRead)}
                          className="text-[#A7A29A] hover:text-white"
                        >
                          {inq.isRead ? "Mark as Unread" : "Mark as Read"}
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: STUDIO SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h2 className="font-serif text-3xl text-white">Studio Configurations</h2>
                <p className="text-xs text-[#A7A29A] mt-1 font-light">
                  Update public studio contact details, flagship addresses, and hero slogans.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-4 rounded bg-green-950/40 border border-green-500/40 text-green-300 text-xs flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Studio settings updated and persisted successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-[#141414] border border-white/10 p-8 rounded-xl space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                    Studio Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.studioName || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, studioName: e.target.value })}
                    className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                    Hero Main Heading
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeading || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeading: e.target.value })}
                    className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                    Studio Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                      Concierge Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                      Direct Telephone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                    New York Madison Ave Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                    Paris Faubourg St-Honoré Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.parisAddress || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, parisAddress: e.target.value })}
                    className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                      Awards Count
                    </label>
                    <input
                      type="number"
                      value={settingsForm.awardsCount ?? 28}
                      onChange={(e) => setSettingsForm({ ...settingsForm, awardsCount: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                      Years Experience
                    </label>
                    <input
                      type="number"
                      value={settingsForm.yearsExperience ?? 14}
                      onChange={(e) => setSettingsForm({ ...settingsForm, yearsExperience: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#A7A29A] font-mono mb-2">
                      Events Covered
                    </label>
                    <input
                      type="number"
                      value={settingsForm.eventsCount ?? 420}
                      onChange={(e) => setSettingsForm({ ...settingsForm, eventsCount: Number(e.target.value) })}
                      className="w-full px-4 py-3 rounded bg-[#0d0d0d] border border-white/10 text-sm text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 text-xs tracking-widest uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] rounded hover:shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Studio Configuration</span>
                </button>
              </form>

              {/* Security & Password Card inside Settings */}
              <div className="bg-[#141414] border border-white/10 p-8 rounded-xl space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#D6B77A]/10 border border-[#D6B77A]/30 flex items-center justify-center text-[#D6B77A]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-white">Director Passphrase & Security</h3>
                    <p className="text-xs text-[#A7A29A]">
                      Enforce complex security credentials for administrative atelier access.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-6 py-3 rounded-lg bg-white/5 border border-[#D6B77A]/40 text-xs font-mono uppercase tracking-wider text-[#D6B77A] hover:bg-[#D6B77A]/10 transition-colors flex items-center space-x-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Change Administrative Passphrase</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#141414] border border-[#D6B77A]/40 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono text-[#D6B77A] tracking-wider uppercase">
                Booking Reference
              </span>
              <h3 className="font-serif text-2xl text-white font-medium">
                {selectedBooking.reference}
              </h3>
            </div>

            <div className="space-y-3 text-xs border-y border-white/10 py-4">
              <div>
                <span className="text-[#A7A29A] block uppercase font-mono text-[10px]">Client:</span>
                <span className="text-white text-sm font-medium">{selectedBooking.fullName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#A7A29A] block uppercase font-mono text-[10px]">Email:</span>
                  <span className="text-white">{selectedBooking.email}</span>
                </div>
                <div>
                  <span className="text-[#A7A29A] block uppercase font-mono text-[10px]">Phone:</span>
                  <span className="text-white">{selectedBooking.phone}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#A7A29A] block uppercase font-mono text-[10px]">Service:</span>
                  <span className="text-[#D6B77A] font-medium">{selectedBooking.service}</span>
                </div>
                <div>
                  <span className="text-[#A7A29A] block uppercase font-mono text-[10px]">Preferred Date:</span>
                  <span className="text-white">{selectedBooking.preferredDate}</span>
                </div>
              </div>
              <div>
                <span className="text-[#A7A29A] block uppercase font-mono text-[10px]">Location:</span>
                <span className="text-white">{selectedBooking.location}</span>
              </div>
              {selectedBooking.guestCount && (
                <div>
                  <span className="text-[#A7A29A] block uppercase font-mono text-[10px]">Scope:</span>
                  <span className="text-white">{selectedBooking.guestCount}</span>
                </div>
              )}
              {selectedBooking.message && (
                <div>
                  <span className="text-[#A7A29A] block uppercase font-mono text-[10px]">Client Vision / Message:</span>
                  <p className="text-[#F5F1E9] italic bg-[#0a0a0a] p-3 rounded mt-1">
                    &ldquo;{selectedBooking.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Change Status Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#A7A29A] mr-2">Set Status:</span>
              <button
                onClick={() => handleUpdateBookingStatus(selectedBooking.id, "CONFIRMED")}
                className="px-3 py-1.5 rounded text-[11px] font-mono uppercase bg-green-500/20 text-green-300 border border-green-500/40 hover:bg-green-500/30"
              >
                Confirm
              </button>
              <button
                onClick={() => handleUpdateBookingStatus(selectedBooking.id, "COMPLETED")}
                className="px-3 py-1.5 rounded text-[11px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30"
              >
                Complete
              </button>
              <button
                onClick={() => handleUpdateBookingStatus(selectedBooking.id, "CANCELLED")}
                className="px-3 py-1.5 rounded text-[11px] font-mono uppercase bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Edit Photograph Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[#141414] border border-[#D6B77A]/40 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono text-[#D6B77A] tracking-wider uppercase">
                {editingPhoto ? "Modify Photograph Record" : "Curate New Masterpiece"}
              </span>
              <h3 className="font-serif text-2xl text-white font-medium">
                {editingPhoto ? editingPhoto.title : "Upload Photograph"}
              </h3>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                  Photograph Title *
                </label>
                <input
                  type="text"
                  value={photoFormData.title}
                  onChange={(e) => setPhotoFormData({ ...photoFormData, title: e.target.value })}
                  placeholder="e.g. Palazzo Reverie"
                  required
                  className="w-full px-4 py-2.5 rounded bg-[#0d0d0d] border border-white/10 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                    Category *
                  </label>
                  <select
                    value={photoFormData.category}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded bg-[#0d0d0d] border border-white/10 text-white text-sm"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Nature">Nature</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                    Orientation
                  </label>
                  <select
                    value={photoFormData.orientation}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, orientation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded bg-[#0d0d0d] border border-white/10 text-white text-sm"
                  >
                    <option value="portrait">Portrait (Tall)</option>
                    <option value="landscape">Landscape (Wide)</option>
                    <option value="square">Square</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                  High-Resolution Image URL (or upload file below)
                </label>
                <input
                  type="url"
                  value={photoFormData.imageUrl}
                  onChange={(e) => setPhotoFormData({ ...photoFormData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded bg-[#0d0d0d] border border-white/10 text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#A7A29A] mb-1 flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#D6B77A]" />
                  <span>Or Upload Local File Directly</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-[#A7A29A] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#D6B77A] file:text-black hover:file:bg-[#ECC880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                    Camera System
                  </label>
                  <input
                    type="text"
                    value={photoFormData.cameraModel}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, cameraModel: e.target.value })}
                    placeholder="Hasselblad H6D-100c"
                    className="w-full px-3 py-2 rounded bg-[#0d0d0d] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                    Lens & Aperture
                  </label>
                  <input
                    type="text"
                    value={photoFormData.lensInfo}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, lensInfo: e.target.value })}
                    placeholder="HC 2,2/100mm f/2.2"
                    className="w-full px-3 py-2 rounded bg-[#0d0d0d] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    value={photoFormData.location}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, location: e.target.value })}
                    placeholder="Lake Como, Italy"
                    className="w-full px-3 py-2 rounded bg-[#0d0d0d] border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={photoFormData.year}
                    onChange={(e) => setPhotoFormData({ ...photoFormData, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3 py-2 rounded bg-[#0d0d0d] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#A7A29A] mb-1">
                  Description / Monograph Notes
                </label>
                <textarea
                  value={photoFormData.description}
                  onChange={(e) => setPhotoFormData({ ...photoFormData, description: e.target.value })}
                  rows={3}
                  placeholder="Atmospheric notes on lighting and composition..."
                  className="w-full px-4 py-2 rounded bg-[#0d0d0d] border border-white/10 text-white resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={photoFormData.featured}
                  onChange={(e) => setPhotoFormData({ ...photoFormData, featured: e.target.checked })}
                  className="rounded border-white/20 text-[#D6B77A] focus:ring-[#D6B77A]"
                />
                <label htmlFor="featuredCheck" className="text-white cursor-pointer select-none">
                  Highlight as Featured Photograph in Gallery
                </label>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-5 py-2.5 rounded text-xs text-[#A7A29A] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded text-xs tracking-wider uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] hover:shadow-lg disabled:opacity-50"
                >
                  {uploading ? "Saving..." : "Save Photograph"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Change / Security Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141414] border border-[#D6B77A]/40 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {!mustChangePassword && (
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div>
              <div className="w-10 h-10 rounded-full bg-[#D6B77A]/10 border border-[#D6B77A]/30 flex items-center justify-center text-[#D6B77A] mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-[#D6B77A] tracking-wider uppercase">
                Access Security
              </span>
              <h3 className="font-serif text-2xl text-white font-medium">
                {mustChangePassword ? "Enforce Password Change" : "Update Administrative Passphrase"}
              </h3>
              <p className="text-xs text-[#A7A29A] mt-1 font-light">
                {mustChangePassword
                  ? "Default credentials must be updated before accessing full production features."
                  : "Choose a strong passphrase to protect your studio dashboard."}
              </p>
            </div>

            {passwordError && (
              <div className="p-3.5 rounded bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3.5 rounded bg-green-950/40 border border-green-500/40 text-green-300 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>Passphrase successfully updated! Re-authenticating session...</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-[#A7A29A] mb-1 font-mono">
                  Current Passphrase
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded bg-[#0d0d0d] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#A7A29A] mb-1 font-mono">
                  New Passphrase
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="At least 8 chars, 1 uppercase, 1 number"
                  required
                  className="w-full px-4 py-2.5 rounded bg-[#0d0d0d] border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[#A7A29A] mb-1 font-mono">
                  Confirm New Passphrase
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new passphrase"
                  required
                  className="w-full px-4 py-2.5 rounded bg-[#0d0d0d] border border-white/10 text-white text-sm"
                />
              </div>

              <div className="p-3 rounded bg-[#0d0d0d] border border-white/5 space-y-1 text-[11px] text-[#A7A29A]">
                <p className="font-medium text-white/80">Security requirements:</p>
                <p>• Minimum 8 characters in length</p>
                <p>• At least one uppercase letter (A-Z)</p>
                <p>• At least one lowercase letter (a-z)</p>
                <p>• At least one numeric digit (0-9)</p>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                {!mustChangePassword && (
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-5 py-2.5 rounded text-xs text-[#A7A29A] hover:text-white"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="px-6 py-2.5 rounded text-xs tracking-wider uppercase font-bold text-[#090909] bg-gradient-to-r from-[#ECC880] to-[#D6B77A] hover:shadow-lg disabled:opacity-50 flex items-center space-x-2"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{passwordSubmitting ? "Securing..." : "Update Passphrase"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
