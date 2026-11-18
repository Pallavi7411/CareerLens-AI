
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  Target,
  UserRound,
  Sparkles,
  LogOut
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Resume Analyzer", icon: FileText },
  { name: "Job Recommendations", icon: BriefcaseBusiness },
  { name: "Skill Gap Analysis", icon: Target },
  { name: "My Profile", icon: UserRound }
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Sparkles size={23} />
        </div>
        <div>
          <h2>CareerLens AI</h2>
          <span>Your Career Companion</span>
        </div>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <Sparkles size={20} />
          <h4>Your career, elevated.</h4>
          <p>Discover opportunities that match your potential.</p>
        </div>

        <div className="sidebar-footer">
          <LogOut size={16} />
          <span>CareerLens AI © 2026</span>
        </div>
      </div>
    </aside>
  );
}
