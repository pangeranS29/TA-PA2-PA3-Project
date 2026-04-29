import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home, Baby, Users, Smile } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map paths to readable titles and icons
  const breadcrumbMap = {
    'dashboard': { title: 'Panel Utama', icon: <Home size={14} /> },
    'daftar-anak': { title: 'Daftar Anak', icon: <Users size={14} /> },
    'data-anak': { title: 'Daftar Anak', icon: <Users size={14} /> },
    'pelayanan-Gigi': { title: 'Kesehatan Gigi', icon: <Smile size={14} /> },
    'pelayanan-gizi': { title: 'Gizi & Nutrisi', icon: <Smile size={14} /> },
    'pelayanan-Imunisasi': { title: 'Imunisasi', icon: <Smile size={14} /> },
    'pelayanan-vitamin': { title: 'Vitamin', icon: <Smile size={14} /> },
    'neonatus': { title: 'Kesehatan Bayi', icon: <Smile size={14} /> },
    'lila': { title: 'Pencatatan LILA', icon: <Smile size={14} /> },
    'dashboard-anak': { title: 'Detail Anak', icon: <Baby size={14} /> },
    'ibu': { title: 'Daftar Ibu', icon: <Users size={14} /> },
    'manajemen-kk': { title: 'Manajemen KK', icon: <Users size={14} /> },
  };

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest gap-2"
          >
            <Home size={14} />
            Beranda
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const isDashboardSegment = value === 'dashboard';
          const isServicePage = pathnames.length > 1 && pathnames[0] === 'data-anak' && value.startsWith('pelayanan');

          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          if (value === id) return null;

          let info = breadcrumbMap[value] || { title: value.replace(/-/g, ' '), icon: null };

          // Contextual adjustment for "dashboard" segment in sub-routes
          if (isDashboardSegment && index > 0) {
            info = { title: 'Detail Anak', icon: <Baby size={14} /> };
          }
          const isLast = index === pathnames.length - 1 || (index === pathnames.length - 2 && pathnames[index + 1] === id);

          return (
            <React.Fragment key={to}>
              {/* Inject Detail Anak before the service page if not already there */}
              {isServicePage && id && !pathnames.includes('dashboard') && (
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="text-slate-300 mx-1" size={14} />
                    <Link
                      to={`/data-anak/dashboard/${id}`}
                      className="ml-1 text-xs font-bold uppercase tracking-widest gap-2 flex items-center text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Baby size={14} />
                      Detail Anak
                    </Link>
                  </div>
                </li>
              )}

              <li>
                <div className="flex items-center">
                  <ChevronRight className="text-slate-300 mx-1" size={14} />
                  <Link
                    to={to}
                    className={`ml-1 text-xs font-bold uppercase tracking-widest gap-2 flex items-center transition-colors ${isLast ? 'text-blue-600 cursor-default pointer-events-none' : 'text-slate-400 hover:text-blue-600'
                      }`}
                  >
                    {info.icon}
                    {info.title}
                  </Link>
                </div>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
