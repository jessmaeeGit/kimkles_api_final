import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaTrash, FaEdit, FaUser, FaEnvelope, FaCalendar } from 'react-icons/fa';

const UsersContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  width: 300px;

  input {
    border: none;
    background: transparent;
    padding: 0.5rem;
    width: 100%;
    outline: none;
  }

  svg {
    color: #666;
    margin-right: 0.5rem;
  }
`;

const UsersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #555;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background: #f9f9f9;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  margin: 0 0.25rem;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #333;
    background: #f0f0f0;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #8B4513;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .details {
    h4 {
      margin: 0;
      color: #333;
      font-size: 1rem;
    }
    p {
      margin: 0.25rem 0 0 0;
      color: #666;
      font-size: 0.875rem;
    }
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => 
    props.role === 'admin' ? '#d4edda' : '#e3f2fd'};
  color: ${props => 
    props.role === 'admin' ? '#155724' : '#1565c0'};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
  
  svg {
    font-size: 4rem;
    color: #ccc;
    margin-bottom: 1rem;
  }
  
  h3 {
    margin: 0.5rem 0;
    color: #333;
  }
  
  p {
    color: #666;
  }
`;

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  // Load users from localStorage
  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(storedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    
    loadUsers();
    // Refresh users every 2 seconds to catch new registrations
    const interval = setInterval(loadUsers, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = storedUsers.filter(user => user.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <UsersContainer>
      <Header>
        <Title>Users ({users.length})</Title>
        <SearchBar>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
      </Header>

      {filteredUsers.length > 0 ? (
        <UsersTable>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <UserInfo>
                    <div className="avatar">
                      {getInitials(user.name)}
                    </div>
                    <div className="details">
                      <h4>{user.name}</h4>
                      <p>ID: {user.id}</p>
                    </div>
                  </UserInfo>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaEnvelope style={{ color: '#666', fontSize: '0.875rem' }} />
                    {user.email}
                  </div>
                </td>
                <td>
                  <RoleBadge role={user.role || 'customer'}>
                    {user.role || 'Customer'}
                  </RoleBadge>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCalendar style={{ color: '#666', fontSize: '0.875rem' }} />
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td>
                  <ActionButton title="Edit User">
                    <FaEdit />
                  </ActionButton>
                  <ActionButton 
                    title="Delete User"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <FaTrash />
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </UsersTable>
      ) : (
        <EmptyState>
          <FaUser />
          <h3>No users found</h3>
          <p>
            {searchTerm 
              ? 'No users match your search criteria.' 
              : 'No registered users yet. Users will appear here after they register.'}
          </p>
        </EmptyState>
      )}
    </UsersContainer>
  );
};

export default Users;

