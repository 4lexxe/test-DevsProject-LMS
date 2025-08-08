import {
  Home,
  BookOpen,
  Library,
  User,
  Menu,
  Settings,
  MessageCircle,
  Map,
  LogIn,
  UserPlus,
  CreditCard,
  X,
  LogOut,
  Crown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/user/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isGridMenuOpen, setIsGridMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const navItems: NavItem[] = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: BookOpen, label: "Cursos", path: "/cursos" },
    {
      icon: undefined,
      label: user ? "Perfil" : "Ingresar",
      path: user ? "/profile" : "#",
      isProfile: true,
    },
    { icon: Crown, label: "Planes", path: "/plans" },
  ];

  interface NavItem {
    icon?: React.ComponentType<{ className?: string }>;
    label: string;
    path: string;
    isProfile?: boolean;
  }

  const menuItems = [
    { icon: Home, label: "Inicio", path: "/" },
    { icon: BookOpen, label: "Cursos", path: "/cursos" },
    { icon: Settings, label: "Ajustes", path: "/ajustes" },
    { icon: MessageCircle, label: "Foro", path: "/foro" },
    { icon: CreditCard, label: "Planes", path: "/plans" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsGridMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path: string): boolean => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        authDropdownRef.current &&
        !authDropdownRef.current.contains(event.target as Node) &&
        !profileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsAuthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsGridMenuOpen(false);
    setIsAuthDropdownOpen(false);
  }, [location]);

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t h-20 z-50">
        <div className="relative grid grid-cols-5 h-full items-center justify-center px-4">
          {navItems.map(({ icon: Icon, label, path, isProfile }) => {
            if (isProfile) {
              return (
                <div
                  key={path}
                  className="col-span-1 flex items-center justify-center relative"
                >
                  <button
                    ref={profileButtonRef}
                    onClick={(e) => {
                      e.preventDefault();
                      if (user) {
                        navigate(path);
                      } else {
                        setIsAuthDropdownOpen(!isAuthDropdownOpen);
                      }
                    }}
                    className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-blue-600 hover:text-blue-600"
                  >
                    {user ? (
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=random`
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isAuthDropdownOpen && !user && (
                      <motion.div
                        ref={authDropdownRef}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-4 transform -translate-x-1/2 flex gap-4 items-center z-50"
                      >
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => {
                              navigate("/login");
                              setIsAuthDropdownOpen(false);
                            }}
                            className="w-12 h-12 rounded-full bg-white border-2 border-gray-400 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-gray-600"
                          >
                            <LogIn className="h-6 w-6 text-gray-600" />
                          </button>
                          <span className="text-xs font-medium text-gray-600 mt-1 bg-white px-2 rounded">
                            Ingresar
                          </span>
                        </div>
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => {
                              navigate("/register");
                              setIsAuthDropdownOpen(false);
                            }}
                            className="w-12 h-12 rounded-full bg-white border-2 border-gray-400 shadow-md flex items-center justify-center transition-all duration-300 ease-in-out hover:border-gray-600"
                          >
                            <UserPlus className="h-6 w-6 text-gray-600" />
                          </button>
                          <span className="text-xs font-medium text-gray-600 mt-1 bg-white px-2 rounded">
                            Registrar
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out p-2 rounded-md hover:bg-gray-100 ${
                  isActive(path) ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {Icon && <Icon className="h-6 w-6" />}
                <span className="text-xs font-medium mt-1">{label}</span>
              </button>
            );
          })}
          
          {/* Menu Button */}
          <div className="col-span-1 flex items-center justify-center relative">
            <button
              onClick={() => setIsGridMenuOpen(true)}
              className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out p-2 rounded-md hover:bg-gray-100 text-gray-500`}
            >
              <Menu className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">Menú</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Screen Grid Menu Overlay */}
      <AnimatePresence>
        {isGridMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsGridMenuOpen(false)}
            />
            
            {/* Grid Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
                {/* Header simplificado */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                  <button
                    onClick={() => setIsGridMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {/* User Info simplificado */}
                {user && (
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">En línea</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grid Menu Items simplificado */}
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {menuItems.map(({ icon: Icon, label, path }, index) => (
                      <motion.button
                        key={path}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          navigate(path);
                          setIsGridMenuOpen(false);
                        }}
                        className="flex flex-col items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                      >
                        <Icon className="w-6 h-6 text-gray-600 mb-2" />
                        <span className="text-sm font-medium text-gray-700 text-center">
                          {label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Footer simplificado */}
                <div className="p-4 border-t border-gray-200">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar sesión
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsGridMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={() => {
                          navigate("/register");
                          setIsGridMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Registrarse
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}