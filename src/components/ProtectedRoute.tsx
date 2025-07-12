import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    if (!adminToken || !adminUser || adminToken !== 'admin-authenticated') {
      // Redirecionar para login se não estiver autenticado
      navigate('/admin/login');
    }
  }, [navigate]);

  // Verificar se está autenticado antes de renderizar
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  if (!adminToken || !adminUser || adminToken !== 'admin-authenticated') {
    return null; // Não renderiza nada enquanto redireciona
  }

  return <>{children}</>;
};

export default ProtectedRoute; 