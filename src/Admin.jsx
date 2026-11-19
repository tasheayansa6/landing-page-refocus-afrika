import { useEffect, useState } from "react";

/** Hidden admin page — open /admin directly. Not linked from the public landing. */
export default function Admin() {
  const [key, setKey] = useState("");
  const [api, setApi] = useState("http://localhost:5000");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [dashError, setDashError] = useState("");
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("eyai_admin_key") || "";
    const savedApi =
      localStorage.getItem("eyai_api_base") || "http://localhost:5000";
    setApi(savedApi);
    if (savedKey) {
      setKey(savedKey);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) loadRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  async function loadRegistrations() {
    setLoading(true);
    setDashError("");
    try {
      const res = await fetch(`${api}/api/admin/registrations`, {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Failed to load");
      setRows(data.data || []);
      setCount(data.count || 0);
    } catch (err) {
      const msg = err?.message || "Error loading data";
      setDashError(msg);
      setRows([]);
      if (/denied|invalid/i.test(msg)) {
        localStorage.removeItem("eyai_admin_key");
        setLoggedIn(false);
        setLoginError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function onLogin() {
    setLoginError("");
    if (!key.trim()) {
      setLoginError("Admin key is required.");
      return;
    }
    const base = api.replace(/\/$/, "");
    try {
      const res = await fetch(`${base}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey: key.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("eyai_admin_key", key.trim());
      localStorage.setItem("eyai_api_base", base);
      setApi(base);
      setLoggedIn(true);
    } catch (err) {
      setLoginError(err?.message || "Login failed");
    }
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f9f9fe] text-[#1a1c1f]">
        <div className="w-full max-w-md bg-white border border-[#e2e2e7] rounded-2xl p-8 shadow-sm">
          <p className="text-xs font-bold tracking-widest uppercase text-[#b22c09] mb-2">
            Admin only
          </p>
          <h1 className="text-2xl font-extrabold text-[#020026] mb-2">
            EYAI Dashboard
          </h1>
          <p className="text-sm text-[#47464e] mb-6">
            Enter the admin key to view registrations. Not linked on the public
            site.
          </p>
          <label className="block text-sm font-semibold mb-2" htmlFor="adminKey">
            Admin key
          </label>
          <input
            id="adminKey"
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full border border-[#c8c5cf] rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#b22c09]"
          />
          <label className="block text-sm font-semibold mb-2" htmlFor="apiBase">
            API base URL
          </label>
          <input
            id="apiBase"
            type="text"
            value={api}
            onChange={(e) => setApi(e.target.value)}
            className="w-full border border-[#c8c5cf] rounded-xl px-4 py-3 mb-4 outline-none focus:border-[#b22c09]"
          />
          {loginError ? (
            <p className="text-sm text-red-600 mb-3">{loginError}</p>
          ) : null}
          <button
            type="button"
            onClick={onLogin}
            className="w-full bg-[#b22c09] text-white font-bold rounded-xl py-3 hover:bg-[#8a1c00]"
          >
            Open dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fe] text-[#1a1c1f]">
      <header className="bg-white border-b border-[#e2e2e7] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-[#b22c09]">
            Admin
          </p>
          <h1 className="text-xl font-extrabold text-[#020026]">
            Registrations
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[#47464e]">
            {count} registrations
          </span>
          <button
            type="button"
            onClick={loadRegistrations}
            className="px-4 py-2 rounded-xl border border-[#c8c5cf] font-semibold text-sm"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("eyai_admin_key");
              setLoggedIn(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#020026] text-white font-semibold text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-6">
        {dashError ? (
          <p className="text-sm text-red-600 mb-4">{dashError}</p>
        ) : null}
        <div className="bg-white border border-[#e2e2e7] rounded-2xl overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f3f3f8] text-left">
              <tr>
                <th className="px-4 py-3 font-bold">ID</th>
                <th className="px-4 py-3 font-bold">Name</th>
                <th className="px-4 py-3 font-bold">Age</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Phone</th>
                <th className="px-4 py-3 font-bold">Region</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Course</th>
                <th className="px-4 py-3 font-bold">Mode</th>
                <th className="px-4 py-3 font-bold">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6" colSpan={10}>
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6" colSpan={10}>
                    No registrations yet.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t border-[#e2e2e7] align-top">
                    <td className="px-4 py-3">{r.id}</td>
                    <td className="px-4 py-3 font-semibold">{r.fullName || ""}</td>
                    <td className="px-4 py-3">{r.age ?? ""}</td>
                    <td className="px-4 py-3">{r.email || ""}</td>
                    <td className="px-4 py-3">{r.phone || ""}</td>
                    <td className="px-4 py-3">{r.region || ""}</td>
                    <td className="px-4 py-3">{r.category || ""}</td>
                    <td className="px-4 py-3">{r.course || ""}</td>
                    <td className="px-4 py-3">{r.mode || ""}</td>
                    <td className="px-4 py-3">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
