import React, { useState, useEffect } from "react";
import "../styles/global.css";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("movie");
  const { user } = useAuth(); 

  const [movieForm, setMovieForm] = useState({
    title: "", description: "", release_year: 2024, rating: "PG-13", genre: "Uncategorized",
    video_filename: "", thumbnail_filename: ""
  });

  const [usersList, setUsersList] = useState([]);

  const [moviesList, setMoviesList] = useState([]);
  const [tvShowsList, setTvShowsList] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`);
      const data = await res.json();
      setUsersList(data);
    } catch (err) {
      console.error("Gagal mengambil data user");
    }
  };

  const fetchContent = async () => {
    try {
      const resMovies = await fetch(`${import.meta.env.VITE_API_URL}/api/movies`);
      const resTV = await fetch(`${import.meta.env.VITE_API_URL}/api/tvshows`);
      setMoviesList(await resMovies.json());
      setTvShowsList(await resTV.json());
    } catch (err) {
      console.error("Gagal mengambil data konten");
    }
  };

  useEffect(() => {
    if (activeTab === "coadmin") {
      fetchUsers();
    } else if (activeTab === "delete") {
      fetchContent();
    }
  }, [activeTab]);

  const submitMovie = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movieForm)
      });
      const data = await res.json();
      alert(data.message); 
    } catch (err) {
      alert("Gagal menyimpan Film! Periksa koneksi backend.");
    }
  };

  const handleSetRole = async (targetUserId, newRole) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/set-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester_id: user.id,
          target_user_id: targetUserId,
          new_role: newRole
        })
      });
      const data = await res.json();
      if(res.ok) {
        alert(data.message);
        fetchUsers();
      } else {
        alert("Gagal: " + data.detail);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengubah role.");
    }
  };

  const handleDeleteMovie = async (id) => {
    if(!window.confirm("Yakin ingin menghapus film ini secara permanen?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message || data.error);
      fetchContent();
    } catch (err) {
      alert("Gagal menghapus film.");
    }
  };

  const handleDeleteTVShow = async (id) => {
    if(!window.confirm("Yakin ingin menghapus serial TV ini beserta semua episodenya?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tvshows/${id}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message || data.error);
      fetchContent();
    } catch (err) {
      alert("Gagal menghapus serial TV.");
    }
  };

  const inputStyle = {
    padding: "14px", borderRadius: "6px", background: "#333", color: "white",
    border: "1px solid #444", outline: "none", width: "100%", boxSizing: "border-box", fontSize: "1rem"
  };

  const tabBtnStyle = (tabName) => ({
    padding: "12px 24px", 
    background: activeTab === tabName ? "#3b82f6" : "#222", 
    color: "white", border: "none", borderRadius: "5px", cursor: "pointer", 
    fontWeight: "bold", fontSize: "1rem", transition: "0.3s"
  });

  return (
    <div style={{ padding: "100px 20px", color: "white", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "5px" }}>🛠️ Admin Dashboard</h1>
      <p style={{ color: "#aaa", marginBottom: "30px", textAlign: "center" }}>Tambah atau Hapus konten dari database Sanflix.</p>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => setActiveTab("movie")} style={tabBtnStyle("movie")}>🎬 Tambah Film</button>
        <button onClick={() => setActiveTab("tvshow")} style={tabBtnStyle("tvshow")}>📺 Tambah Serial TV</button>
        <button onClick={() => setActiveTab("delete")} style={tabBtnStyle("delete")}>🗑️ Kelola Konten</button>
        
        {user && user.role === "admin" && (
          <button onClick={() => setActiveTab("coadmin")} style={tabBtnStyle("coadmin")}>🛡️ Kelola Co-Admin</button>
        )}
      </div>

      {activeTab === "movie" && (
        <form onSubmit={submitMovie} style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "550px", gap: "15px", background: "#181818", padding: "35px", borderRadius: "12px", boxShadow: "0px 10px 40px rgba(0,0,0,0.6)" }}>
          <input placeholder="Judul Film" required onChange={(e) => setMovieForm({...movieForm, title: e.target.value})} style={inputStyle} />
          <textarea placeholder="Deskripsi (Opsional)" onChange={(e) => setMovieForm({...movieForm, description: e.target.value})} style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} />
          <div style={{ display: "flex", gap: "15px" }}>
            <input type="number" placeholder="Tahun Rilis" required value={movieForm.release_year} onChange={(e) => setMovieForm({...movieForm, release_year: parseInt(e.target.value)})} style={inputStyle} />
            <input placeholder="Genre (Cth: Action, Drama)" required onChange={(e) => setMovieForm({...movieForm, genre: e.target.value})} style={inputStyle} />
          </div>
          <div style={{ background: "rgba(59, 130, 246, 0.15)", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #3b82f6" }}>
            <p style={{ margin: "0 0 15px 0", fontSize: "0.9rem", color: "#ccc", lineHeight: "1.5" }}>⚠️ <b>Langkah Penting:</b><br/>Pastikan file video/gambarmu sudah diletakkan manual ke folder <i>data/movies</i> dan <i>data/thumbnails</i>.</p>
            <input placeholder="Nama File Video (Cth: spiderman.mp4)" required onChange={(e) => setMovieForm({...movieForm, video_filename: e.target.value})} style={{ ...inputStyle, marginBottom: "12px" }} />
            <input placeholder="Nama File Thumbnail (Cth: spider_thumb.jpg)" required onChange={(e) => setMovieForm({...movieForm, thumbnail_filename: e.target.value})} style={inputStyle} />
          </div>
          <button type="submit" style={{ padding: "16px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", marginTop: "15px", transition: "0.3s" }}>
            Simpan Film ke Database
          </button>
        </form>
      )}

      {activeTab === "tvshow" && (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "550px", gap: "15px", background: "#181818", padding: "40px", borderRadius: "12px", boxShadow: "0px 10px 40px rgba(0,0,0,0.6)", textAlign: "center" }}>
          <h3 style={{ margin: 0 }}>Formulir TV Show</h3>
          <p style={{ color: "#aaa", margin: 0 }}>Selesaikan form Film dahulu, nanti kita tambahkan yang ini! 😉</p>
        </div>
      )}

      {activeTab === "delete" && (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "600px", gap: "15px", background: "#181818", padding: "30px", borderRadius: "12px", boxShadow: "0px 10px 40px rgba(0,0,0,0.6)" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#ef4444" }}>🗑️ Daftar Film</h3>
          {moviesList.map((m) => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#222", padding: "10px 15px", borderRadius: "8px" }}>
              <span>{m.title}</span>
              <button onClick={() => handleDeleteMovie(m.id)} style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Hapus</button>
            </div>
          ))}
          {moviesList.length === 0 && <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Tidak ada film tersimpan.</p>}

          <h3 style={{ margin: "20px 0 10px 0", color: "#ef4444" }}>🗑️ Daftar Serial TV</h3>
          {tvShowsList.map((tv) => (
            <div key={tv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#222", padding: "10px 15px", borderRadius: "8px" }}>
              <span>{tv.title}</span>
              <button onClick={() => handleDeleteTVShow(tv.id)} style={{ padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Hapus</button>
            </div>
          ))}
          {tvShowsList.length === 0 && <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Tidak ada serial TV tersimpan.</p>}
        </div>
      )}

      {activeTab === "coadmin" && user && user.role === "admin" && (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "600px", gap: "15px", background: "#181818", padding: "30px", borderRadius: "12px", boxShadow: "0px 10px 40px rgba(0,0,0,0.6)" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Daftar Pengguna</h3>
          {usersList.map((u) => (
            <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#222", padding: "15px", borderRadius: "8px" }}>
              <div>
                <strong>{u.email}</strong>
                <span style={{ marginLeft: "10px", fontSize: "0.8rem", padding: "3px 8px", background: u.role === "admin" ? "gold" : u.role === "co-admin" ? "#3b82f6" : "#555", color: u.role === "admin" ? "black" : "white", borderRadius: "12px" }}>
                  {u.role.toUpperCase()}
                </span>
              </div>
              <div>
                {u.role === "user" && (
                  <button onClick={() => handleSetRole(u.id, "co-admin")} style={{ padding: "8px 15px", background: "#10b981", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Jadikan Co-Admin</button>
                )}
                {u.role === "co-admin" && (
                  <button onClick={() => handleSetRole(u.id, "user")} style={{ padding: "8px 15px", background: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cabut Co-Admin</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
