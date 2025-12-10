import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Bug,
  Bell,
  Gift,
  FileText,
  Settings,
  X,
  ChevronRight,
  IndianRupee,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSidebar } from "./SidebarContext";

const navigationItems = [
  {
    titleKey: "nav.dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "nav.farmers",
    href: "/farmers",
    icon: Users,
  },
  {
    titleKey: "nav.yield",
    href: "/yield-analysis",
    icon: BarChart3,
  },
  {
    titleKey: "nav.pest",
    href: "/pest-tracking",
    icon: Bug,
  },
  {
    titleKey: "nav.market",
    href: "/market-prices",
    icon: IndianRupee,
  },
  {
    titleKey: "nav.alerts",
    href: "/alerts",
    icon: Bell,
  },
  {
    titleKey: "nav.schemes",
    href: "/schemes",
    icon: Gift,
  },
  {
    titleKey: "nav.reports",
    href: "/reports",
    icon: FileText,
  },
  {
    titleKey: "nav.settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { isCollapsed, toggleCollapsed: toggleCollapsedContext } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  // Make sidebar state available to parent components
  useEffect(() => {
    // Add a class to the document body to indicate sidebar state
    document.body.dataset.sidebarState = isCollapsed ? "collapsed" : "expanded";
    document.body.dataset.sidebarOpen = isOpen ? "true" : "false";
    document.body.dataset.sidebarMobile = isMobile ? "true" : "false";

    return () => {
      delete document.body.dataset.sidebarState;
      delete document.body.dataset.sidebarOpen;
      delete document.body.dataset.sidebarMobile;
    };
  }, [isCollapsed, isOpen, isMobile]);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Handle toggle sidebar
  const toggleSidebar = () => {
    toggleCollapsedContext();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-in fade-in-0 duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        data-state={isOpen ? "open" : "closed"}
        data-collapsed={isCollapsed ? "true" : "false"}
        data-mobile={isMobile ? "true" : "false"}
        className={cn(
          "h-screen z-50 bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isMobile
            ? "fixed inset-y-0 left-0"
            : "sticky top-0 left-0 self-start",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2 flex-shrink-0 max-w-[100%]">
                <img
                  src="/logo3.png"
                  alt="Logo"
                  className="w-12 h-12 flex-shrink-0"
                />
                <div className="overflow-hidden">
                  <h1 className="text-3xl font-heading font-bold text-[#2E7D32] drop-shadow-lg truncate">
                    Agri<span className="text-[#DAA520]">Mitra</span>
                  </h1>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center w-full">
                <img src="/logo3.png" alt="Logo" className="w-8 h-8" />
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={isMobile ? onClose : toggleSidebar}
              className="hover:bg-[#66BB6A]/20 hover:text-[#2E7D32] ml-2 flex-shrink-0"
            >
              {isMobile ? (
                <X className="h-4 w-4" />
              ) : isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav
            className={cn(
              "flex-1 overflow-y-auto",
              isCollapsed ? "py-4" : "p-4 space-y-2"
            )}
          >
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 group animate-in fade-in-0",
                    isCollapsed ? "justify-center my-4" : "space-x-3 mb-2",
                    isActive
                      ? "bg-[#2E7D32] text-white shadow-sm"
                      : "text-sidebar-foreground hover:bg-[#66BB6A]/20 hover:text-[#2E7D32]"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (isMobile) {
                      onClose();
                    }
                  }}
                  title={isCollapsed ? t(item.titleKey) : ""}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0",
                      isCollapsed ? "w-5 h-5" : "w-4 h-4"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="flex-1">{t(item.titleKey)}</span>
                  )}
                  {isActive && !isCollapsed && (
                    <ChevronRight className="w-4 h-4 text-white" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-sidebar-border">
              <div className="text-xs text-[#4E4E4E] text-center">
                <p>
                  {/* i18n footer lines could be added if needed */}© 2025 Govt
                  of India
                </p>
                <p>Electronics & IT Dept</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile toggle button */}
      {isMobile && !isOpen && (
        <button
          onClick={() => onClose()}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-sidebar shadow-md"
        >
          <Menu className="h-5 w-5 text-[#2E7D32]" />
        </button>
      )}
    </>
  );
}
