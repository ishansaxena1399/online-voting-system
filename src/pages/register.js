import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AUTH_SERVICE } from "../services/auth.service";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { toast } from "react-toastify";
import useGlobalState from "../store";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from "@mui/material/InputAdornment";

const ValidationSchema = yup.object().shape({
  name: yup.string().required("Please enter your name"),
  phone: yup.string().length(10, "Please enter valid phone number").required("Please enter phone number"),
  email: yup.string().email("Please enter valid email").required("Please enter email"),
  password: yup.string().min(8, "Password length too short").max(16, "Password too long").required("Please enter the password"),
  isRegistrationStarted: yup.bool(),
  otp: yup.string()
    .when("isRegistrationStarted", {
      is: true,
      then: yup.string().max(6, "Please enter correct OTP").required("Please enter OTP sent to your mobile")
    }),
});

const Register = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues
  } = useForm({
    resolver: yupResolver(ValidationSchema)
  });

  const navigate = useNavigate();

  const {
    state: {
      timeStarted
    }
  } = useGlobalState();

  const [loading, setLoading] = useState(false);
  const [registerFormData, setRegisterFormData] = useState(null);
  const [confirmationPhoneResult, setConfirmationPhoneResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [visible, setVisible] = useState(false);

  const handlePasswordVisible = () => setVisible(!visible);

  const handleFormSubmit = async (data) => {
    try {
      setValue("isRegistrationStarted", true);
      setLoading(true);
      setRegisterFormData(data);

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
            setValue("isRegistrationStarted", false);
            toast.error("Too many attempts. Please try after sometime");
          });
      } else {
        confirmationPhoneResult.confirm(data.otp).then(async (result) => {
          const payload = { ...registerFormData };
          payload["role"] = "user";
          delete payload.otp;
          delete payload.isRegistrationStarted;

          try {
            const responseData = await AUTH_SERVICE.register(payload);

            if (responseData.success) {
              navigate("/login");
            } else {
              toast.error(responseData.message);
              setOtpSent(false);
              setValue("isRegistrationStarted", false);
            }
          } catch (error) {
            console.log("error while calling register user ", error);
            setOtpSent(false);
            setValue("isRegistrationStarted", false);
          }

        }).catch((error) => {
          console.log("error while verifying otp ", error);
        });
      }
    } catch (error) {
      console.log("error in Login handleFormSubmit -> ", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if(timeStarted) {
      toast.warning("Election going on. Please wait to register");
    }
  }, []);

  return (
    <Layout>
      <div className="bootstrapContainer" >
        <div className="loginFormContainerDiv" >
          <p className="loginFormTitle" >Online Voting System</p>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <p className="loginFormTitle" >Register</p>
            <Grid container >
              <Grid item md={12} xs={12} sm={12} >
                <Typography className="formLabel" >
                  Name
                </Typography>

                <Controller
                  name="name"
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
                      placeholder="enter name"
                    />
                  )}
                />
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
                      error={Boolean(error?.message)}
                      helperText={error?.message}
                      placeholder="enter email"
                    />
                  )}
                />
              </Grid>
              <Grid item md={12} xs={12} sm={12} >
                <Typography className="formLabel" >
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
                      error={Boolean(error?.message)}
                      helperText={error?.message}
                      placeholder="enter phone number"
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
                      error={Boolean(error?.message)}
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
                              visible ? <VisibilityOffIcon style={{color: "#fff"}} /> : <VisibilityIcon style={{color: "#fff"}} />
                            }
                          </IconButton>
                        </InputAdornment>
                      }}
                    />
                  )}
                />
              </Grid>

              {
                getValues("isRegistrationStarted") &&
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
                      Register
                    </Button>
                }
              </Grid>

              <Box display="flex" justifyContent="flex-end" mt={3} width={1} >
                <Link to="/login" className="registerText" >
                  Already have an account ? Login
                </Link>
              </Box>
            </Grid>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Register;