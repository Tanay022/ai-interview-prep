import React from "react";
import "./logout.modal.scss";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router";

const LogoutModal = ({ onClose }) => {
      const {handleLogout}=useAuth()
      const navigate=useNavigate()

        async function logout(){
        const success=await handleLogout();
        if(success){
            navigate("/login")
        }
    }
  
  return (
    <div className="logout-overlay">
      <div className="logout-modal">
        <div className="logout-icon">
          <span>↪</span>
        </div>

        <h2>Logout?</h2>

        <p>Are you sure you want to logout from your account?</p>

        <div className="logout-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="confirm-logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
