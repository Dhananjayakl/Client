import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";

import { Briefcase, Home, MapPin, MessageSquare } from "react-feather";
import { getviewData } from "../../../modules/leave/LeaveService";
import { getObjectData } from "../../../modules/employee/EmployeeService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMapMarkerAlt,
  faEnvelope,
  faBirthdayCake,
  faGlobe,
  faUser,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

import UpdateProfile from "../../../components/forms/utils/UpdateProfile";
// import Accordion from "../../../components/forms/utils/Accordion";
import Popup from "../../../components/forms/utils/Popup";
// import CoverProfile from "../../../components/forms/utils/CoverProfile";
import SettingNavigation from "../../../modules/employee/pages/settings";

import "src/assets/scss/profile.scss";
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import avatar1 from "../../../assets/img/avatars/avatar.jpg";
import avatar2 from "../../../assets/img/avatars/avatar-2.jpg";
import avatar4 from "../../../assets/img/avatars/avatar-4.jpg";
import avatar5 from "../../../assets/img/avatars/avatar-5.jpg";

import unsplash1 from "../../../assets/img/photos/unsplash-1.jpg";
import unsplash2 from "../../../assets/img/photos/unsplash-2.jpg";

//import UpdateProfile from "components/forms/utils/UpdateProfile";

//let itemsarr = ['java developer', 'Angular Developer', 'UI Developer', 'PL/SQL Developer', 'Java Script'];

function ProfileDetails() {
  const skillTitles = [];
  const perDetails = [];
  const filterExpr = ":USER_ID=USER_ID";
  const viewParams = {
    viewName: "pa_em_skill_details_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: filterExpr,
  };

  const viewParameterss = {
    viewName: "pa_em_personal_details_bv",
    pageNumber: 0,
    pageSize: 0,
    sortField: "",
    sortOrder: "",
    orderExpression: "",
    filterExpression: ":USER_ID=USER_ID",
  };

  const [mobilenum, setmobilenum] = useState();
  const [address, setaddress] = useState();
  const [email, setemail] = useState();
  const [birthdate, setbirthdate] = useState();
  const [birthplace, setbirthplace] = useState();
  const [linkedIn, setlinkedIn] = useState();
  const [roles, setroles] = useState(
    JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
      .privilege_name
  );

  const [skills, setSkills] = useState([]);
  const [country, setCountry] = useState([]);

  useEffect(() => {
    // var log_user_id = JSON.parse(localStorage.current_logged_User)[0].user_details.data[0].user_id;
    getviewData(viewParameterss)
      .then((perdata) => {
        // for (var i = 0; i < perdata.data.data.length; i++) {
        //   perDetails.push(perdata.data.data[i]);
        // }

        const date = new Date(perdata.data.data[0].date_of_birth);
        const formattedDate = date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        setbirthdate(formattedDate);
        setCountry(perdata.data.data[0].domicile_value);
        setbirthplace(perdata.data.data[0].birth_place);
        // console.log("user skills", skills);
        // setRender(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // var log_user_id = JSON.parse(localStorage.current_logged_User)[0].user_details.data[0].user_id;
    getviewData(viewParams)
      .then((skilldata) => {
        for (var i = 0; i < skilldata.data.data.length; i++) {
          skillTitles.push(skilldata.data.data[i].title);
        }
        setSkills(skillTitles);
        console.log("user skills", skills);
        // setRender(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const skilldtls = skills.map((item, index) => {
    return <li key={index}>{item}</li>;
  });
  // useEffect(() => {
  //   getObjectData('personaldetails')
  //     .then((personalDtls) => {
  //       console.log("get Personal Details", personalDtls);
  //       for (let i = 0; i < personalDtls.data.length; i++) {
  //         if (personalDtls.data[i].userId === JSON.parse(localStorage.current_logged_User)[0].user_details.data[0].user_id) {

  //           setbirthdate(personalDtls.data[i].dateOfBirth);
  //           setbirthplace(personalDtls.data[i].birthPlace);

  //         }

  //       }

  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  // },);

  useEffect(() => {
    getObjectData("contactDetails")
      .then((contactDtls) => {
        console.log("get contact Details", contactDtls);
        for (let i = 0; i < contactDtls.data.length; i++) {
          if (
            contactDtls.data[i].userId ===
            JSON.parse(localStorage.current_logged_User)[0].user_details.data[0]
              .user_id
          ) {
            setmobilenum(contactDtls.data[i].workNo);
            setaddress(contactDtls.data[i].permanentAddress);
            setemail(contactDtls.data[i].personalEmailId);
            setlinkedIn(contactDtls.data[i].linkdinId);
            console.log("get mobile num", mobilenum);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  let firstname = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].first_name;
  let lastname = JSON.parse(localStorage.current_logged_User)[0].user_details
    .data[0].last_name;
  let userfullname = firstname + " " + lastname;

  const [newList, setNewList] = useState([
    "Item 1 for the new list",
    "Item 2 for the new list",
    "Item 1 for the new list",
    // "Item 2 for the new list",
    // "Item 1 for the new list",
    // "Item 2 for the new list",
    // "Item 1 for the new list",
    // "Item 2 for the new list",
    // "Item 1 for the new list",
    // "Item 2 for the new list",
    // "Item 1 for the new list",
    // "Item 2 for the new list",
    // "Item 1 for the new list",
    // "Item 2 for the new list",
    // "Item 1 for the new list",
    "Item 2 for the new list",
    "Item 3 for the new list",
  ]);

  // Step 2: Map the new list data to JSX
  const newListItems = newList.map((item, index) => {
    return <li key={index}>{item}</li>;
  });

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const [expand, setExpand] = useState(false);
  const profilesec = () => {
    setExpand(!expand);
  };

  return (
    <Card>
      {/* <Card.Header>
        <Card.Title className="mb-0">Profile Details</Card.Title>
        <Link to="/employee/settings">Edit</Link>
      </Card.Header> */}

      {/* <UpdateProfile /> */}
      <Card.Header style={{ borderBottomWidth: "45px" }}>
        {/* <CoverProfile /> */}
        {/* <div style={{
          fontSize: "10px", height: "200px", width: "100%", backgroundColor: "#d5e0e1"
        }}>
          <UpdateProfile />
        </div> */}
        <div
          style={{
            fontSize: "10px",
            height: "150px",
            width: "18%",
            backgroundColor: "#d5e0e1",
          }}
        >
          <UpdateProfile />
        </div>
      </Card.Header>

      <Card.Body style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flex: 2 }} className="usernameflex">
          <p
            style={{
              fontSize: "25px",
              fontFamily: "ui-monospace",
              marginLeft: "55px",
            }}
          >
            {userfullname}
          </p>

          <p
            style={{
              fontSize: "19px",
              fontFamily: "ui-monospace",
              marginLeft: "55px",
            }}
          >
            {roles}
          </p>

          {/* <p style={{
            marginLeft: "55px"
          }}>{birthplace}{', '}{country}</p> */}

          <div style={{ marginLeft: "55px" }}>
            <Card.Title
              style={{ fontSize: "22px", fontFamily: "ui-monospace" }}
            >
              <u>Skills</u>
            </Card.Title>
            <div>
              {/* <ul>{newListItems}</ul> */}
              <ul>{skilldtls}</ul>
            </div>
          </div>

          <div
            style={{
              marginLeft: "60px",
            }}
          >
            <Button className="round-button" onClick={profilesec}>
              Update Profile
            </Button>
          </div>

          {/* <div style={{ width: "20%" }}>
            {isOpen && <Popup
              content={<>
                <div>
                  <header className="popname">
                    {userfullname}
                    <span className="close-icon" onClick={togglePopup}>x</span>
                  </header>
                </div>
                <hr ></hr>


                <div>
                  <h2 >Contact Info</h2>
                </div>

                <div>
                  <div className="contact-head">
                    <FontAwesomeIcon icon={faPhone} size="2x" className="icon-color" />
                    <h3 className="contact-title" >Phone</h3>
                  </div>
                  <div className="contact-body">
                    <h3>{mobilenum}</h3>

                  </div>
                </div>

                <div>
                  <div className="contact-head">
                    <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" className="icon-color" />
                    <h3 className="contact-title" >Address</h3>
                  </div>
                  <div className="contact-body">
                    <p >{address}</p>
                  </div>
                </div>

                <div>
                  <div className="contact-head">
                    <FontAwesomeIcon icon={faEnvelope} size="2x" className="icon-color" />
                    <h3 className="contact-title" >Email</h3>
                  </div>
                  <div className="contact-body">
                    <p >{email}</p>
                  </div>
                </div>

                <div>
                  <div className="contact-head">
                    <FontAwesomeIcon icon={faBirthdayCake} size="2x" className="icon-color" />
                    <h3 className="contact-title" >Birthday</h3>
                  </div>
                  <div className="contact-body">
                    <p >{birthdate}</p>
                  </div>
                </div>
              </>}

              handleClose={togglePopup}
            />}
          </div> */}
          <div>
            {expand && (
              <Popup
                content={
                  <>
                    <div>
                      <header className="popname">
                        {userfullname}
                        <span className="close-icon" onClick={profilesec}>
                          x
                        </span>
                      </header>
                    </div>
                    <hr></hr>
                    {/* <div>
                  <Accordion title="Personal Details">
                    <hr></hr>
                    <h4>personal</h4>
                  </Accordion>
                </div>
                <hr ></hr>
                <div>
                  <Accordion title="Professional Details">
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.
                  </Accordion>
                </div>
                <hr ></hr>
                <div>
                  <Accordion title="Skills and Bank Details">
                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.
                  </Accordion>
                </div> */}

                    <div>
                      <SettingNavigation></SettingNavigation>
                    </div>
                  </>
                }
                handleClose={togglePopup}
              />
            )}
          </div>
        </div>
        <div style={{ flex: 1, paddingLeft: "20px", flexBasis: "10%" }}>
          <Card.Title style={{ fontSize: "26px", fontFamily: "ui-monospace" }}>
            <u>About</u>
          </Card.Title>
          <div style={{ flex: 2 }}>
            {/* <ul>{newListItems}</ul> */}

            <div>
              <div className="contact-head">
                <FontAwesomeIcon
                  icon={faBirthdayCake}
                  size="1x"
                  className="icon-color"
                />
                <h5 className="contact-title">Birthday</h5>
              </div>
              <div className="contact-body">
                <h4>{birthdate}</h4>
              </div>
            </div>
            <div>
              <div className="contact-head">
                <FontAwesomeIcon
                  icon={faPhone}
                  size="1x"
                  className="icon-color"
                />
                <h5 className="contact-title">Phone</h5>
              </div>
              <div className="contact-body">
                <h4>{mobilenum}</h4>
              </div>
            </div>

            <div>
              <div className="contact-head">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size="1x"
                  className="icon-color"
                />
                <h5 className="contact-title">Email</h5>
              </div>
              <div className="contact-body">
                <a href="https://accounts.google.com/" target="_blank">
                  {email}
                </a>
                {/* <h4>{email}</h4> */}
              </div>
            </div>

            <div>
              <div className="contact-head">
                <FontAwesomeIcon
                  icon={faGlobe}
                  size="1x"
                  className="icon-color"
                />
                <h5 className="contact-title">LinkedIn Url</h5>
              </div>
              <div className="contact-body">
                <a href="https://www.linkedin.com/" target="_blank">
                  {linkedIn}
                </a>
                {/* <h4>{linkedIn}</h4> */}
              </div>
            </div>

            <div>
              <div className="contact-head">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  size="1x"
                  className="icon-color"
                />
                <h5 className="contact-title">Address</h5>
              </div>
              <div className="contact-body">
                <h4>{address}</h4>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>

    // < Card >
    //   <Card.Header>
    //     <Card.Title className="mb-0">Profile Details</Card.Title>
    //     <Link to="/employee/settings">Edit</Link>
    //   </Card.Header>
    //   <div>
    //     {/* ...other content */}

    //     {/* ...other content */}
    //   </div>
    //   <Card.Body className="text-center">

    //     <img
    //       src={avatar4}
    //       alt="Stacie Hall"
    //       //onClick={callFunctionInComponentB}
    //       className="img-fluid rounded-circle mb-2"
    //       width="128"
    //       height="128"
    //     />

    //     {/* <input type="file" accept="/image/*"
    //     onChange={(event) => {
    //       //    const [image, setimage] = useState(null);
    //       const file = event.target.files[0];
    //       //if (file && file.type.substring() === "image")

    //       if (file.type.includes("image")) {
    //         setimage.push(file);
    //       }
    //       else {
    //         setimage.push(null);
    //       }
    //     }
    //     } /> */}

    //     <Card.Title className="mb-0">Stacie Hall</Card.Title>
    //     <div className="text-muted mb-2">Lead Developer</div>

    //     <div>
    //       <Button size="sm" variant="primary" className="me-1">
    //         Follow
    //       </Button>
    //       <Button size="sm" variant="primary">
    //         <MessageSquare width={16} height={16} /> Message
    //       </Button>
    //     </div>
    //   </Card.Body>

    //   <hr className="my-0" />

    //   <Card.Body>
    //     <Card.Title>Skills</Card.Title>
    //     <Badge bg="primary" className="me-2 my-1">
    //       HTML
    //     </Badge>
    //     <Badge bg="primary" className="me-2 my-1">
    //       JavaScript
    //     </Badge>
    //     <Badge bg="primary" className="me-2 my-1">
    //       Sass
    //     </Badge>
    //     <Badge bg="primary" className="me-2 my-1">
    //       Angular
    //     </Badge>
    //     <Badge bg="primary" className="me-2 my-1">
    //       Vue
    //     </Badge>
    //     <Badge bg="primary" className="me-2 my-1">
    //       React
    //     </Badge>
    //     <Badge bg="primary" className="me-2 my-1">
    //       Redux
    //     </Badge>
    //     <Badge bg="primary" className="me-2 my-1">
    //       UI
    //     </Badge>
    //     <Badge bg="primary" className="me-2 my-1">
    //       UX
    //     </Badge>
    //   </Card.Body>

    //   <hr className="my-0" />
    //   <Card.Body>
    //     <Card.Title>About</Card.Title>
    //     <ul className="list-unstyled mb-0">
    //       <li className="mb-1">
    //         <Home width={14} height={14} className="me-1" /> Lives in{" "}
    //         <Link to="/dashboard/default">San Francisco, SA</Link>
    //       </li>

    //       <li className="mb-1">
    //         <Briefcase width={14} height={14} className="me-1" /> Works at{" "}
    //         <Link to="/dashboard/default">GitHub</Link>
    //       </li>
    //       <li className="mb-1">
    //         <MapPin width={14} height={14} className="me-1" /> From{" "}
    //         <Link to="/dashboard/default">Boston</Link>
    //       </li>
    //     </ul>
    //   </Card.Body>
    //   <hr className="my-0" />
    //   <Card.Body>
    //     <Card.Title>Elsewhere</Card.Title>

    //     <ul className="list-unstyled mb-0">
    //       <li className="mb-1">
    //         <FontAwesomeIcon icon={faGlobe} fixedWidth className="me-1" />
    //         <Link to="/dashboard/default">staciehall.co</Link>
    //       </li>
    //       <li className="mb-1">
    //         <FontAwesomeIcon icon={faTwitter} fixedWidth className="me-1" />
    //         <Link to="/dashboard/default">Twitter</Link>
    //       </li>
    //       <li className="mb-1">
    //         <FontAwesomeIcon icon={faFacebook} fixedWidth className="me-1" />
    //         <Link to="/dashboard/default">Facebook</Link>
    //       </li>
    //       <li className="mb-1">
    //         <FontAwesomeIcon icon={faInstagram} fixedWidth className="me-1" />
    //         <Link to="/dashboard/default">Instagram</Link>
    //       </li>
    //       <li className="mb-1">
    //         <FontAwesomeIcon icon={faLinkedin} fixedWidth className="me-1" />
    //         <Link to="/dashboard/default">LinkedIn</Link>
    //       </li>
    //     </ul>
    //   </Card.Body>
    // </Card >
  );
}

// const Activities = () => (
//   <Card>
//     <Card.Header>
//       <Card.Title className="mb-0">Activities</Card.Title>
//     </Card.Header>
//     <Card.Body>
//       <div className="d-flex">
//         <img
//           src={avatar5}
//           width="36"
//           height="36"
//           className="rounded-circle me-2"
//           alt="Ashley Briggs"
//         />
//         <div className="flex-grow-1">
//           <small className="float-end text-navy">5m ago</small>
//           <strong>Ashley Briggs</strong> started following{" "}
//           <strong>Stacie Hall</strong>
//           <br />
//           <small className="text-muted">Today 7:51 pm</small>
//           <br />
//         </div>
//       </div>

//       <hr />
//       <div className="d-flex">
//         <img
//           src={avatar1}
//           width="36"
//           height="36"
//           className="rounded-circle me-2"
//           alt="Chris Wood"
//         />
//         <div className="flex-grow-1">
//           <small className="float-end text-navy">30m ago</small>
//           <strong>Chris Wood</strong> posted something on{" "}
//           <strong>Stacie Hall</strong>'s timeline
//           <br />
//           <small className="text-muted">Today 7:21 pm</small>
//           <div className="border text-sm text-muted p-2 mt-1">
//             Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem
//             quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam
//             quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.
//             Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut
//             libero venenatis faucibus. Nullam quis ante.
//           </div>
//           <Button size="sm" variant="danger" className="mt-1">
//             <FontAwesomeIcon icon={faHeart} fixedWidth /> Like
//           </Button>
//         </div>
//       </div>

//       <hr />
//       <div className="d-flex">
//         <img
//           src={avatar4}
//           width="36"
//           height="36"
//           className="rounded-circle me-2"
//           alt="Stacie Hall"
//         />
//         <div className="flex-grow-1">
//           <small className="float-end text-navy">1h ago</small>
//           <strong>Stacie Hall</strong> posted a new blog
//           <br />
//           <small className="text-muted">Today 6:35 pm</small>
//         </div>
//       </div>

//       <hr />
//       <div className="d-flex">
//         <img
//           src={avatar2}
//           width="36"
//           height="36"
//           className="rounded-circle me-2"
//           alt="Carl Jenkins"
//         />
//         <div className="flex-grow-1">
//           <small className="float-end text-navy">3h ago</small>
//           <strong>Carl Jenkins</strong> posted two photos on{" "}
//           <strong>Stacie Hall</strong>'s timeline
//           <br />
//           <small className="text-muted">Today 5:12 pm</small>
//           <div className="row no-gutters mt-1">
//             <div className="col-6 col-md-4 col-lg-4 col-xl-3">
//               <img src={unsplash1} className="img-fluid pe-2" alt="Unsplash" />
//             </div>
//             <div className="col-6 col-md-4 col-lg-4 col-xl-3">
//               <img src={unsplash2} className="img-fluid pe-2" alt="Unsplash" />
//             </div>
//           </div>
//           <Button size="sm" variant="danger" className="mt-1">
//             <FontAwesomeIcon icon={faHeart} fixedWidth /> Like
//           </Button>
//         </div>
//       </div>

//       <hr />
//       <div className="d-flex">
//         <img
//           src={avatar2}
//           width="36"
//           height="36"
//           className="rounded-circle me-2"
//           alt="Carl Jenkins"
//         />
//         <div className="flex-grow-1">
//           <small className="float-end text-navy">1d ago</small>
//           <strong>Carl Jenkins</strong> started following{" "}
//           <strong>Stacie Hall</strong>
//           <br />
//           <small className="text-muted">Yesterday 3:12 pm</small>
//           <div className="d-flex mt-1">
//             <img
//               src={avatar4}
//               width="36"
//               height="36"
//               className="rounded-circle me-2"
//               alt="Stacie Hall"
//             />
//             <div className="flex-grow-1 ps-3">
//               <div className="border text-sm text-muted p-2 mt-1">
//                 Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id,
//                 lorem. Maecenas nec odio et ante tincidunt tempus.
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <hr />
//       <div className="d-flex">
//         <img
//           src={avatar4}
//           width="36"
//           height="36"
//           className="rounded-circle me-2"
//           alt="Stacie Hall"
//         />
//         <div className="flex-grow-1">
//           <small className="float-end text-navy">1d ago</small>
//           <strong>Stacie Hall</strong> posted a new blog
//           <br />
//           <small className="text-muted">Yesterday 2:43 pm</small>
//         </div>
//       </div>

//       <hr />
//       <div className="d-flex">
//         <img
//           src={avatar1}
//           width="36"
//           height="36"
//           className="rounded-circle me-2"
//           alt="Chris Wood"
//         />
//         <div className="flex-grow-1">
//           <small className="float-end text-navy">1d ago</small>
//           <strong>Chris Wood</strong> started following{" "}
//           <strong>Stacie Hall</strong>
//           <br />
//           <small className="text-muted">Yesterdag 1:51 pm</small>
//         </div>
//       </div>

//       <hr />
//       <div className="d-grid">
//         <Button variant="primary">Load more</Button>
//       </div>
//     </Card.Body>
//   </Card>
// );

const Profile = () => (
  <React.Fragment>
    <Helmet title="Profile" />
    <Container fluid className="p-0">
      <h1 className="h3 mb-3">Profile</h1>

      <Row>
        <Col xl="16">
          <ProfileDetails />
        </Col>
        {/* <Col md="8" xl="9">
          <Activities />
        </Col> */}
      </Row>
    </Container>
  </React.Fragment>
);

export default Profile;
