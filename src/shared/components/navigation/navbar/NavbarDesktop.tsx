import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Settings, LogIn, UserPlus, CreditCard, Bell, BookOpen, Route, FolderOpen, ShoppingCart } from 'lucide-react';
import SearchInput from '../../search/SearchInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/user/contexts/AuthContext';
import NavLink from '../navbar/NavLink';
import AuthButton from '../../buttons/AuthButton';
import { cartService } from '@/payment/services/cartService';

export default function DesktopNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Obtener la cantidad de items en el carrito
  useEffect(() => {
    const fetchCartData = async () => {
      if (user) {
        try {
          const cartData = await cartService.getActiveCart();
          setCartItemsCount(cartData?.summary?.courseCount || 0);
        } catch (error) {
          console.error('Error obteniendo datos del carrito:', error);
          setCartItemsCount(0);
        }
      } else {
        setCartItemsCount(0);
      }
    };

    fetchCartData();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                src="https://i.ibb.co/dQ09SsH/logoDev2.png"
                alt="Dev's Project"
                className="h-12 w-12 object-contain"
              />
            </a>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchInput placeholder="Buscar cursos, recursos..." />
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/cursos" icon={<BookOpen className="w-4 h-4" />}>
              Cursos
            </NavLink>
            <NavLink href="/plans" icon={<CreditCard className="w-4 h-4" />}>
              Planes
            </NavLink>
            <div className="relative">
              <NavLink href="/cart" icon={<ShoppingCart className="w-4 h-4" />}>
                Carrito
              </NavLink>
              {user && cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium" style={{backgroundColor: "rgb(66, 215, 199)", color: "#0c154c"}}>
                  {cartItemsCount}
                </span>
              )}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </button>

                {/* User menu */}
                <UserMenu 
                  user={user} 
                  isProfileOpen={isProfileOpen}
                  setIsProfileOpen={setIsProfileOpen}
                  profileMenuRef={profileMenuRef}
                  handleLogout={handleLogout}
                />
              </>
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

interface UserMenuProps {
  user: { name: string; avatar?: string };
  isProfileOpen: boolean;
  setIsProfileOpen: (isOpen: boolean) => void;
  profileMenuRef: React.RefObject<HTMLDivElement>;
  handleLogout: () => Promise<void>;
}

function UserMenu({ 
  user, 
  isProfileOpen, 
  setIsProfileOpen, 
  profileMenuRef, 
  handleLogout 
}: UserMenuProps) {
  return (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center space-x-2 p-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6b7280&color=fff`}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {isProfileOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
          </div>
          <MenuLink href="/profile" icon={User}>
            Perfil
          </MenuLink>
          <MenuLink href="/subscription" icon={CreditCard}>
            Suscripción
          </MenuLink>
          <MenuLink href="/user/orders" icon={ShoppingCart}>
            Mis ordenes
          </MenuLink>
          <MenuLink href="/my-courses" icon={BookOpen}>
            Mis cursos
          </MenuLink>
          <MenuLink href="/settings" icon={Settings}>
            Configuración
          </MenuLink>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

interface MenuLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function MenuLink({ href, icon: Icon, children }: MenuLinkProps) {
  return (
    <a
      href={href}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      <Icon className="mr-3 h-4 w-4" />
      {children}
    </a>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center space-x-3">
      <AuthButton 
        variant="secondary" 
        href="/login"
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Iniciar Sesión
      </AuthButton>
      <AuthButton 
        variant="primary" 
        href="/register"
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Registrarse
      </AuthButton>
    </div>
  );
}