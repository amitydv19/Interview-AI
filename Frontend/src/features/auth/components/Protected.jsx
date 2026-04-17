import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import React from "react";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f27 100%)',
        color: '#e2e8f0',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255, 20, 147, 0.2)',
          borderTop: '3px solid #ff1493',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#a0aec0' }}>
          Loading...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />; // ✅ FIXED
  }

  return children;
};

export default Protected;