import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button } from "react-bootstrap";
import Clock from "../../components/Clock/Clock";
import Praktikanti from "../../components/Praktikanti/Praktikanti";
import mapImage from "../../assets/images/worldmap.svg";
import classes from "./Home.module.css";
import { logout } from "../../redux-store/userSlice";

const praktikanti = [
  "Bojan Bosnić - Frontend Dev",
  "Darko Marčeta - Frontend Dev",
  "Miloš Klepić - Backend Dev",
  "Vesna Trišić - Backend Dev",
  "Danijel Vujić - Manual QA",
  "Tatjana Peulić - Manual QA",
];

const Home = ({ user }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, isGuest } = useSelector((state) => state.user);

  const logoutHandler = () => {    
    dispatch(logout());
  };
  return (
    <Container fluid className="h-100">
      <Row className="h-100">
        <Col xs={12} md={3} className={classes.leftColumn}>
          <div className={classes.leftContent}>
            <h4>PlanetSoft Praksa </h4>
            <h5>Grupa 2 </h5>
            <hr className={classes.hr} />
            <Clock className={classes.clock} />
            <hr className={classes.hr} />
            <h4>Praktikanti</h4>
            <ul className={classes.list}>
              {praktikanti.map((person, i) => {
                return <Praktikanti name={person} key={i} />;
              })}
            </ul>
            <hr className={classes.hr} />
          </div>
        </Col>
        <Col xs={12} md={9} className={classes.rightRow}>
          <div className={classes.titleContainer}>
            <h2>Welcome to Home Page</h2>
          </div>
          <img src={mapImage} alt="worldmap" className={classes.worldMap} />
          <div className={classes.homeButtonContainer}>
            {!isLoggedIn ? (
              <>
                {isGuest && <h4>Do you want to Login or continue as Guest?</h4>           }
                {isGuest && (
                  <Link to="/map">
                    <Button
                      variant="outline-secondary"
                      size="lg"
                      className={classes.button}                      
                    >
                      Guest
                    </Button>
                  </Link>
                )}
                <Link to="/login">
                  <Button
                    variant="secondary"
                    size="lg"
                    className={classes.button}
                  >
                    Login
                  </Button>
                </Link>
              </>
            ) : (<>
            <h4>Welcome {user} and enjoy your GIS map!</h4>
            <Button
                    variant="secondary"
                    size="lg"
                    className={classes.button}
                    onClick={logoutHandler}
                  >
                    Logout
                  </Button>
            </>
              
              
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
