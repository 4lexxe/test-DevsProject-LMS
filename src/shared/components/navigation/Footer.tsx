import React from "react"
import { Github, Youtube } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDiscord, faWhatsapp } from "@fortawesome/free-brands-svg-icons"

// Define a custom type for the icon
type SocialLink = {
  icon: any, // Using any temporarily for FontAwesome icons compatibility
  href: string,
  label: string,
  isFontAwesome: boolean,
}

const menuItems = {
  column1: [
    { label: "Inicio", href: "/" }, 
    { label: "Cursos", href: "/cursos" },
  ],
  column2: [
    { label: "Sobre Nosotros", href: "/sobre-nosotros" },
    { label: "Contacto", href: "/contacto" },
  ],
}

const socialLinks: (SocialLink & { color: string })[] = [
  { icon: faDiscord, href: "https://discord.gg/sfkZkv5cZs", label: "Discord", isFontAwesome: true, color: "#171515" },
  { icon: faWhatsapp, href: "https://chat.whatsapp.com/ImICgrdizYG2elipsk7SwN", label: "WhatsApp", isFontAwesome: true, color: "#171515" },
  { icon: Github, href: "https://github.com/4lexxe/DevsProject", label: "GitHub", isFontAwesome: false, color: "#171515" },
  { icon: Youtube, href: "#", label: "YouTube", isFontAwesome: false, color: "#171515" },
]

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <img src="https://i.ibb.co/p1SH5jQ/logo-Devs-Vertical.png" alt="Devs Project Logo" className="h-12 w-auto" />
          </div>

          {/* Menu Column 1 */}
          <div className="hidden md:block">
            <ul className="space-y-3">
              {menuItems.column1.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Column 2 */}
          <div className="hidden md:block">
            <ul className="space-y-3">
              {menuItems.column2.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6 justify-center md:justify-end">
            {socialLinks.map(({ icon, href, label, isFontAwesome, color }) => (
              <a
                key={label}
                href={href}
                className=""
                aria-label={label}
                style={{ color }}
              >
                {isFontAwesome ? (
                  <FontAwesomeIcon icon={icon} className="w-8 h-8" />
                ) : (
                  React.createElement(icon, { className: "w-8 h-8" })
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:hidden">
          <div>
            <ul className="space-y-3">
              {menuItems.column1.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-3">
              {menuItems.column2.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Devs Project. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
