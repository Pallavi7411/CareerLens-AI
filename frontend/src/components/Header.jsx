
import { Bell, Search, Menu } from "lucide-react";

export default function Header({ onMenuClick }) {
  return (
    <header className="topbar">
      <button className="menu-toggle" onClick={onMenuClick}>
        <Menu size={22} />
      </button>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search your career workspace..."
        />
      </div>

      <div className="header-actions">
        <button className="icon-button">
          <Bell size={20} />
        </button>

        <div className="avatar">U</div>
      </div>
    </header>
  );
}
