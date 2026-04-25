import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PageTransition } from '@/components/ui/PageTransition';
import {
  Bell, User, LayoutDashboard,
  Play, Activity,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/activate-mission', label: 'Activate Mission', icon: Play },
  { href: '/volunteer-summary', label: 'Volunteer Summary', icon: Activity },
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  const getMiddleText = () => {
    const navItem = NAV_ITEMS.find((n) => n.href === pathname);
    return navItem?.label ?? 'Site Manager Dashboard';
  };

  const middleText = getMiddleText();

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--color-gray-50)'
    }}>
      {/* Header - Full Width with Logo and Navigation */}
      <header style={{ 
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-gray-200)',
        padding: '12px 40px',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{
          maxWidth: '1800px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Left - Logo that navigates to home */}
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '8px',
              borderRadius: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                position: 'relative',
                flexShrink: 0
              }}>
                <Image
                  src="/images/bayanihub_logo.png"
                  alt="Bayanihub Logo"
                  fill
                  style={{
                    objectFit: 'contain'
                  }}
                  priority
                />
              </div>
              <span style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#5C6ED5',
                letterSpacing: '-0.02em'
              }}>
                BayaniHub
              </span>
            </div>
          </Link>

          {/* Center - Dynamic Page Title */}
          {middleText && (
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '18px',
              fontWeight: 500,
              color: '#374151',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap'
            }}>
              {middleText}
            </div>
          )}

          {/* Right - Notification and Profile Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Notification Icon */}
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gray-100)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              <Bell size={20} />
              {/* Notification Badge */}
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                border: '2px solid white',
                animation: 'pulse 2s infinite',
              }}></span>
            </button>

            {/* Profile Icon */}
            <button style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gray-100)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-gray-200)',
        padding: '0 40px',
        width: '100%',
        position: 'sticky',
        top: '61px',
        zIndex: 40,
      }}>
        <div style={{
          maxWidth: '1800px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflowX: 'auto',
        }}>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '12px 14px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-gray-500)',
                  borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  borderRadius: '6px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                    e.currentTarget.style.color = 'var(--color-primary-dark)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-gray-500)';
                  }
                }}>
                  <Icon size={14} />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* Main Content */}
      <main style={{ 
        padding: '32px 40px',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1800px',
          margin: '0 auto',
          width: '100%'
        }}>
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
};