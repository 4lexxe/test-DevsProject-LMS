import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceService } from '../../services/resource.service';
import { toast } from 'react-hot-toast';
import { Resource, UserInfo } from '../../types/resource';
import ResourceHeader from '../../navigation/ResourceDetailHeader';
import ResourceContent from '../../components/ResourceContent';
import ResourceInfo from '../../components/ResourceInfo';
import ResourceActions from '../../components/ResourceActions';
import Comment from '../../components/Comment';

const ResourceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError('ID de recurso no válido');
          return;
        }

        const resourceData = await ResourceService.getResourceById(Number(id));
        setResource(resourceData);

      } catch (err) {
        console.error('Error fetching resource details:', err);
        setError('Error al cargar el recurso. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResourceDetails();
    }
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar el enlace:', err);
      toast.error('Error al copiar el enlace');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-800"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <p className="text-red-700">{error || 'Recurso no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Crear el objeto resourceUser a partir de la información que ya viene en el recurso
  const resourceUser: UserInfo | null = resource.user ? {
    id: resource.user.id,
    name: resource.user.name,
    avatar: resource.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
      resource.user.name || `Usuario ${resource.user.id}`
    )}&background=random`
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado del recurso */}
        <ResourceHeader resource={resource} />
        
        {/* Contenido principal del recurso */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ResourceContent resource={resource} />
          <ResourceInfo resource={resource} user={resourceUser} />
          {resource.id !== undefined && resource.userId !== undefined && (
            <ResourceActions resourceId={resource.id} ownerId={resource.userId} onShare={handleShare} />
          )}
          {/* Componente de Comentarios */}
          {resource.id !== undefined && (
            <div className="p-6">
              <Comment resourceId={resource.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsPage;