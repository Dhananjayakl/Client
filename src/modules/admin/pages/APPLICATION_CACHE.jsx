import * as util from "src/components/forms/reactformutils/elements/formutilfunctions";
import React, { useEffect, useState } from "react";

import Confirmation from "src/components/forms/reactformutils/elements/Confirmation";

import { deleteChache, getCacheData } from "../AdminService";

import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Nav,
  Card,
  Button,
  Breadcrumb,
  Table,
} from "react-bootstrap";

const APPLICATION_CACHE = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [cacheNameToDelete, setCacheNameToDelete] = React.useState("");
  const [caches, setcaches] = React.useState(null);
  // const [refresh,setRefresh]=useState(false);
  let privs = util.getCurrentUser().privileges?.split(",");



  // console.log("privsprivsprivsprivsprivsprivs",privs)
  
  const handleDeleteCache = (cacheName) => {
    setCacheNameToDelete(cacheName);
    setModalShow(true);
  };
  useEffect(() => {
    getCacheData("caches").then((respoonse) => {
      console.log(respoonse.data, "allcache");
      setcaches(respoonse.data);
    });
  }, [cacheNameToDelete]);

  const confirmDeleteCache = () => {
    console.log(`Deleting cache: ${cacheNameToDelete}`);
    if (cacheNameToDelete === "Form") {
      // console.log("coming here to delete the cache");
      deleteChache("caches", "form");
    } else if (cacheNameToDelete === "Chart") {
      // console.log("coming here to delete the cache");
      deleteChache("caches", "chart");
    } else if (cacheNameToDelete === "User") {
      // console.log("coming here to delete the cache");
      deleteChache("caches", "user");
    } else if (cacheNameToDelete === "Report") {
      // console.log("coming here to delete the cache");
      deleteChache("caches", "report");
    } else if (cacheNameToDelete === "Workflow") {
      console.log("coming here to delete the cache");
      deleteChache("caches", "workflow");
    } else if (cacheNameToDelete === "Application") {
      deleteChache("caches", "application");
    }
    setCacheNameToDelete("");

    setModalShow(false);
    // setRefresh(prev => prev==false?true:false);
    getCacheData("caches").then((respoonse) => {
      console.log(respoonse.data, "allcache");
      setcaches(respoonse.data);
    });
  };

  // const handleCloseModal = () => {
  //   setModalShow(false);
  // };

  return (
    <>
      {/* {privs.includes("CACHE_PREV") && ( */}
        <div>
          <Card
            className=" reportChart-cards"
            style={{ paddingBottom: "10px" }}
          >
            <Card.Header as="h4" className="text-primary">
              Manage Cache
            </Card.Header>
            <Card.Body>
              <Row>
                {caches &&
                  caches.map((cacheObj) => {
                    const [cacheName, size] = Object.entries(cacheObj)[0]; // Get the first key-value pair
                    return (
                      <Col
                        md={4}
                        className="d-flex shadow-lg m-2 p-2 justify-content-between align-items-center mt-2"
                        key={cacheName} // Use cacheName as the key
                      >
                        <div>
                          <Card.Title>
                            {cacheName === "User" || cacheName === "Application"
                              ? cacheName
                              : `${cacheName} Engine`}
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Size: {size}
                          </Card.Subtitle>
                        </div>
                        <Button
                          variant="primary"
                          onClick={() => handleDeleteCache(cacheName)} // Use cacheName to delete
                        >
                          Clear
                        </Button>
                      </Col>
                    );
                  })}
              </Row>
            </Card.Body>
          </Card>
        </div>
       {/* )} */}
      <Confirmation
        show={modalShow}
        onHide={() => setModalShow(false)}
        onConfirm={confirmDeleteCache}
        content={`Are you sure you want to clear the ${
          cacheNameToDelete === "User" || cacheNameToDelete === "Application"
            ? cacheNameToDelete
            : `${cacheNameToDelete} Engine`
        } cache?`}
      />


    </>
  );
};

export default APPLICATION_CACHE;