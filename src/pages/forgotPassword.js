import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AUTH_SERVICE } from "../services/auth.service";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from "@mui/material/InputAdornment";

const ValidationSchema = yup.object().shape({
  email: yup.string().email("Please enter valid email").required("Please enter email"),
  password: yup.string().min(8, "Password length too short").max(16, "Password too long").required("Please enter the password")
});

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(ValidationSchema)
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handlePasswordVisible = () => setVisible(!visible);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      const responseData = await AUTH_SERVICE.updatePassword(data);
      if(responseData.success) {
        toast.success("Password updated");
        navigate("/login");
      }else {
        toast.error(responseData.message);
      }
    }catch(error) {
      console.log("error in forgot password formsubmit ", error);
    }
    setLoading(false);
  }

  return (
    <Layout>
      <div className="bootstrapContainer" >
        <div className="loginFormContainerDiv" >
          <p className="loginFormTitle" >Online Voting System</p>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <p className="loginFormTitle" >Forgot Password</p>
            <Grid container >
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
                              visible ? <VisibilityOffIcon style={{color: "#fff"}} /> : <VisibilityIcon style={{color: "#fff"}} />
                            }
                          </IconButton>
                        </InputAdornment>
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item md={12} xs={12} sm={12} >
                <Button className="loginButton" type="submit" fullWidth endIcon={loading && <CircularProgress size={20} className="loginRegisterProgressColor" />} disabled={loading} >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default ForgotPassword;