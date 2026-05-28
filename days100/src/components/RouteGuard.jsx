import { Navigate } from 'react-router-dom'

export default function RouteGuard({ token, children }) {

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
