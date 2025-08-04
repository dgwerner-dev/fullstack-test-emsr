import Navbar from '@/components/Navbar';
import { AuthContext } from '@/contexts/AuthContext';
import { fireEvent, render, screen } from '@testing-library/react';

const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

const mockAuthContextWithUser = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
  },
  login: jest.fn(),
  logout: jest.fn(),
  loading: false,
};

describe('Navbar', () => {
  it('renders login and register links when user is not authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('renders user menu and logout when user is authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContextWithUser}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', () => {
    render(
      <AuthContext.Provider value={mockAuthContextWithUser}>
        <Navbar />
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockAuthContextWithUser.logout).toHaveBeenCalled();
  });

  it('shows admin link when user is admin', () => {
    const adminUser = {
      ...mockAuthContextWithUser,
      user: {
        ...mockAuthContextWithUser.user,
        role: 'ADMIN',
      },
    };

    render(
      <AuthContext.Provider value={adminUser}>
        <Navbar />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
