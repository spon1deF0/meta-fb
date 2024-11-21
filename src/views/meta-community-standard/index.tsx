import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { Button, Flex } from 'antd';
import moment from 'moment';
import '../meta-community-standard/style.css';

const MetaCommunityPage = () => {
  const navigate = useNavigate();
  const currentTime = moment().format('MMMM DD, YYYY');

  return (
    <div className="container_meta">
      {/* <div className="left_div">
        <div className="header">
          <img className="logo" src="/images/meta.png" alt="" />
        </div>
      </div> */}
      <div className="right_div">

        <img className="image_content" src="/images/auth.png" alt=""></img>
        <div className="text_content">
          <p style={{ fontSize: '22px', marginTop: '50px', fontWeight: 'bold' }}>The security of your account is at risk.</p>
          <p style={{ fontSize: '15px', fontWeight: '400', lineHeight: 1.5, marginTop: '36px', marginBottom: '10px', fontFamily: 'inherit' }}>We have temporarily blocked your account because your Facebook Protect settings have been modified.</p>
          <div className="avt" >
            <div className="left">
              <img className="" src="/images/dangerous.png" alt=""></img>
            </div>
            <div className="middle">
              <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "6px" }}>
                Your page was restricted on <span style={{ fontSize: '17px', fontWeight: 'bold' }}> {currentTime}.</span>
              </p>
              <p
                style={{
                  fontSize: "15px",
                  // fontWeight: "450",
                  opacity: "1",
                }}
              >
                We did this to protect your account from being suspended.
              </p>
            </div>

          </div>
          {/* <p style={{ fontSize: '15px', fontWeight: '400', lineHeight: 1.5, marginTop: '36px', fontFamily: 'inherit' }}>We discovered that your page has violated the payment policy. In accordance with Facebook's Privacy Policy, You page will be disabled payments & ads manager from
            <span style={{ fontSize: '17px', fontWeight: 'bold' }}> {currentTime}</span> </p> */}
          <p style={{ fontSize: '15px', fontWeight: '400', lineHeight: 1.5, marginTop: '36px', fontFamily: 'inherit' }}>We will guide you through some steps to lift the page restriction and unlock your account.</p>

          {/* <p style={{ fontSize: '17px', marginTop: '26px', fontWeight: 'bold', color: "#1a73e3" }}>More information</p>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#d5dae1', fontSize: '24px' }} /> <span style={{ fontSize: '14px', marginLeft: '8px', textAlign: 'center' }}>No one will able to see your posts until you've verified your payment method.</span>
          </div>
          <div style={{ borderLeftColor: "black", borderLeftWidth: "3px", height: '10px' }}>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <FontAwesomeIcon icon={faAddressCard} style={{ color: 'blue', fontSize: '24px' }} /> <span style={{ fontSize: '14px', marginLeft: '8px', textAlign: 'center' }}>Below, you'll need to complete some steps to expedite the review of your account.</span>
          </div> */}
          <Flex gap="small" wrap="wrap">
            <Button onClick={() => navigate('/business-help-center')} style={{ width: '100%', marginTop: "30px", height: "44px", marginBottom: '14px', fontSize: '15px', fontWeight: "500" }} type="primary">
              Continue
            </Button>

          </Flex>
        </div>
      </div>
    </div >


  );
};
export default MetaCommunityPage;

