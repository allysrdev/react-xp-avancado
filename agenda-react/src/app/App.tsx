import CalendarScreen from './components/CalendarScreen';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getToday } from './helpers/dateHelper';
import React from 'react';
import { getUserEndpoint, signOutEndpoint, type IUser } from './backend';
import LoginScreen from './components/LoginScreen';
import { AuthContext } from './contexts/authContext';

class App extends React.Component<
  object,
  { user: IUser | null; signOut: () => void; setUser: (user: IUser | null) => void }
> {
  handleSignOut: () => void;
  setUser: (user: IUser | null) => void;
  constructor(props: object) {
    super(props);
    this.state = {
      user: null,
      setUser: (user: IUser | null) => {
        this.setState({ user: user });
      },
      signOut: () => {
        signOutEndpoint();
        this.setState({ user: null });
      },
    };

    this.handleSignOut = () => {
      signOutEndpoint();
      this.setState({ user: null });
    };

    this.setUser = (user: IUser | null) => {
      this.setState({ user: user });
    };
  }

  render() {
    const month = getToday().substring(0, 7);

    const { user } = this.state;

    if (user) {
      return (
        <AuthContext.Provider value={{ user: user, signOut: this.handleSignOut }}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/calendar/:month" element={<CalendarScreen />} />
              <Route path="*" element={<Navigate to={`/calendar/${month}`} replace />} />
            </Routes>
          </Router>
        </AuthContext.Provider>
      );
    } else {
      return <LoginScreen onSignIn={this.setUser} />;
    }
  }

  componentDidMount(): void {
    getUserEndpoint().then(this.setUser, () => this.setUser(null));
  }
}

export default App;
