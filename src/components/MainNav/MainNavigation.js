import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import { logout } from "../../redux-store/userSlice";
import { useDispatch } from "react-redux";
import { turnOffDrawingEditModes } from "../../redux-store/panelSlice";

const MainNavigation = ({ user }) => {
  const { isLoggedIn } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const logoutHandler = (e) => {
    e.preventDefault();
    dispatch(turnOffDrawingEditModes())
    dispatch(logout());
    
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>
          <LinkContainer to="/">
            <Nav.Link>GeoMap</Nav.Link>
          </LinkContainer>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/map">
              <Nav.Link>Map</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            {user && <NavDropdown
              title={`Welcome, ${isLoggedIn ? user : "Guest"}`}
              id="basic-nav-dropdown"
            >
              {isLoggedIn && (
                <LinkContainer to="/change-password">
                  <NavDropdown.Item>Change Password</NavDropdown.Item>
                </LinkContainer>
              )}
              {isLoggedIn && (
                <LinkContainer to="/">
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </LinkContainer>
              )}
              {!isLoggedIn && (
                <LinkContainer to="/login">
                  <NavDropdown.Item>Login</NavDropdown.Item>
                </LinkContainer>
              )}
            </NavDropdown>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavigation;
