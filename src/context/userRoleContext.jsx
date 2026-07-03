import React, { createContext, useState, useContext } from 'react';

const UserRoleContext = createContext({
  userRole: null,
  hasPermission: () => false,
});

export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  const updateUserRole = (newRole) => setUserRole(newRole);
  console.log(updateUserRole);

  const hasPermission = (permission) => {
    console.log(permission);
    // Implement your permission checking logic here (can be the same as before)
    const permissionsMap = {
      admin: ['create-user', 'edit-user', 'delete-user','super-admin'],
      // editor: ['create-post', 'edit-post'],
      // reader: ['view-posts'],
    };
    console.log(userRole , permissionsMap[userRole]);

    return userRole && permissionsMap[userRole]?.includes(permission);
  };

  const value = { userRole, updateUserRole, hasPermission };
console.log(value);
  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
