import { useState, useEffect } from "react";
import useGlobalState from "../store";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AUTH_SERVICE } from "../services/auth.service";
import { setUserLoginDetails } from "../store/actions";
import { setToken } from "../helpers/common.helpers";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from "@mui/material/InputAdornment";

const ValidationSchema = yup.object().shape({
  email: yup.string().email("Please enter valid email").required("Please enter email"),
  password: yup.string().min(8, "Password length too short").max(16, "Password too long").required("Please enter the password"),
  phone: yup.string().length(10, "Please enter valid phone number").required("Please enter phone number"),
  isVerificationStarted: yup.bool(),
  otp: yup.string()
    .when("isVerificationStarted", {
      is: true,
      then: yup.string().max(6, "Please enter correct OTP").required("Please enter OTP sent to your mobile")
    }),
  profileImage: yup.string().required("Please take your photo")
});

const Login = () => {

  const {
    dispatch,
    state: {
      user,
      timeStarted
    }
  } = useGlobalState();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(ValidationSchema)
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loginFormData, setLoginFormData] = useState(null);
  const [confirmationPhoneResult, setConfirmationPhoneResult] = useState(null);
  const [visible, setVisible] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [videoStream, setVideoStream] = useState(false);

  const handlePasswordVisible = () => setVisible(!visible);

  const handleStartCamera = (takeAgain) => {
    if(takeAgain) {
      let canvasElement = document.getElementById("canvas");
      canvasElement.style.display = "none";
      setValue("profileImage", undefined);
    }
    setCameraStarted(true);
  }

  const handleCancelPhotoTaking = async() => {
    let videoElement = document.getElementById("video");
    setCameraStarted(false);
    videoElement.pause();
    videoElement.src = "";
    videoStream.getTracks()[0].stop();
  }

  const handleTakePhoto = async () => {
    let canvasElement = document.getElementById("canvas");
    let videoElement = document.getElementById("video");
    canvasElement.getContext('2d').drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    let image_data_url = canvasElement.toDataURL('image/jpeg');
    console.log(image_data_url);

    videoElement.style.display = "none";
    canvasElement.style.display = "block";

    setValue("profileImage", image_data_url);
    handleCancelPhotoTaking();
    clearErrors("profileImage")
  }

  const handleFormSubmit = async (data) => {
    try {
      setValue("isVerificationStarted", true);
      setLoading(true);
      setLoginFormData(data);
      if (!otpSent) {
        const phoneNumber = "+91" + data.phone;
        const appVerifier = window.recaptchaVerifier;

        await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          .then((confirmationResult) => {
            setConfirmationPhoneResult(confirmationResult);
            setOtpSent(true);
            toast.success("OTP sent successfully");
          })
          .catch(error => {
            console.log("error while sending sms ", error);
            setOtpSent(false);
            setValue("isVerificationStarted", false);
            toast.error("Too many attempts. Please try after sometime");
          });
      } else {

        await confirmationPhoneResult.confirm(data.otp).then(async (result) => {
          const payload = { ...loginFormData };
          delete payload.otp;
          delete payload.isVerificationStarted;
          try {
            const response = await AUTH_SERVICE.login(data);
            if (response.success) {
              const userInfo = {
                "details": {
                  "role": response.role,
                  "name": response.name,
                  "userId": response.userId
                },
                "isLoggedIn": true
              };

              setToken(response.token);
              dispatch(setUserLoginDetails(
                {
                  user: userInfo
                }
              ));

              if (userInfo.details.role === "user") {
                navigate("/home");
              } else {
                navigate("/");
              }
              toast.success("Logged in successfully");
            } else {
              setOtpSent(false);
              setValue("isVerificationStarted", false);
              toast.error(response.message);
            }
          } catch (error) {
            console.log("error while logging in ", error);
            setOtpSent(false);
            setValue("isVerificationStarted", false);
          }
        })
      }
    } catch (error) {
      console.log("error in Login handleFormSubmit -> ", error);
    }
    setLoading(false);
  }

  useEffect(async () => {
    if (cameraStarted) {
      let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(result => result)
        .catch(error => error);

      if (stream.message?.includes("Permission denied")) {
        setCameraStarted(false);
        toast.error("Please give permissions to take photo");
      } else {
        let videoElement = document.getElementById("video");
        videoElement.srcObject = stream;
        setVideoStream(stream);
      }
    }
  }, [cameraStarted])

  return (
    <Layout>
      <div className="bootstrapContainer" >
        <div className="loginFormContainerDiv" >
          <p className="loginFormTitle" >Online Voting System</p>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <p className="loginFormTitle" >Login</p>
            <Grid container >
              <Grid item md={12} xs={12} sm={12} >
                <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" >
                  {
                    <canvas width="100" height="100" id="canvas" ></canvas>
                  }
                  {
                    cameraStarted &&
                    <video id="video" autoPlay width="320" height="240" ></video>
                  }

                  <Box width={1} display="flex" alignItems="center" justifyContent="center" style={{ gap: "1rem" }} >
                    <Button
                      className="clickPhotoBtn"
                      onClick={cameraStarted ? handleTakePhoto : handleStartCamera}
                    >
                      {cameraStarted ? "Click" : "Take"} Photo
                    </Button>

                    {
                      getValues("profileImage") !== undefined ?
                        <Button
                          className="clickPhotoBtn"
                          onClick={() => handleStartCamera(true)}
                        >
                          Take Again
                        </Button>
                        :
                        cameraStarted ?
                          <Button
                            className="clickPhotoBtn"
                            onClick={handleCancelPhotoTaking}
                          >
                            Cancel
                          </Button>
                          :
                          null
                    }
                  </Box>

                  {
                    errors?.profileImage &&
                    <p className="errorText" >
                      {errors?.profileImage.message}
                    </p>
                  }
                </Box>
              </Grid>

              <Grid item md={12} xs={12} sm={12} >
                <Typography className="formLabel" >
                  Email
                </Typography>

                <Controller
                  name="email"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <TextField
                      fullWidth
                      value={value || ""}
                      onChange={onChange}
                      error={error?.message}
                      helperText={error?.message}
                      placeholder="enter email"
                    />
                  )}
                />
              </Grid>

              <Grid item md={12} xs={12} sm={12} >
                <Typography className="formLabel">
                  Password
                </Typography>

                <Controller
                  name="password"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <TextField
                      fullWidth
                      value={value || ""}
                      onChange={onChange}
                      error={error?.message}
                      helperText={error?.message}
                      placeholder="enter password"
                      inputProps={{
                        type: visible ? "text" : "password"
                      }}
                      InputProps={{
                        endAdornment:
                          <InputAdornment position="end" >
                            <IconButton onClick={handlePasswordVisible} >
                              {
                                visible ? <VisibilityOffIcon style={{ color: "#fff" }} /> : <VisibilityIcon style={{ color: "#fff" }} />
                              }
                            </IconButton>
                          </InputAdornment>
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item md={12} xs={12} sm={12} >
                <Typography className="formLabel">
                  Phone
                </Typography>

                <Controller
                  name="phone"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <TextField
                      fullWidth
                      value={value || ""}
                      onChange={onChange}
                      error={error?.message}
                      helperText={error?.message}
                      placeholder="enter phone"
                    />
                  )}
                />
              </Grid>

              {
                getValues("isVerificationStarted") &&
                <Grid item md={12} xs={12} sm={12} >
                  <Typography className="formLabel">
                    OTP
                  </Typography>

                  <Controller
                    name="otp"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error }
                    }) => (
                      <TextField
                        fullWidth
                        value={value || ""}
                        onChange={onChange}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                        placeholder="enter otp"
                      />
                    )}
                  />
                </Grid>
              }

              <Grid item md={12} xs={12} sm={12} >
                {
                  !otpSent ?
                    <Button className="loginButton" type="submit" fullWidth endIcon={loading && <CircularProgress size={20} className="loginRegisterProgressColor" />} disabled={loading} >
                      Get OTP
                    </Button>
                    :
                    <Button className="loginButton" type="submit" fullWidth endIcon={loading && <CircularProgress size={20} className="loginRegisterProgressColor" />} disabled={loading} >
                      Login
                    </Button>
                }
              </Grid>

              <Box display="flex" justifyContent="space-between" mt={3} width={1} >
                <Link to="/forgot-password" className="registerText" >
                  Forgot Password
                </Link>

                {
                  timeStarted ?
                    null
                    :
                    <Link to="/register" className="registerText" >
                      Register
                    </Link>
                }
              </Box>
            </Grid>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Login;