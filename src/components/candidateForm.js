import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Typography, TextField, MenuItem, Button, CircularProgress } from "@mui/material";
import useGlobalState from '../store';
import { setCandidatesData } from "../store/actions";
import { ADMIN_SERVICE } from "../services/admin.services";
import ImageDropzone from "./imageDropzone";
import { toast } from "react-toastify";

const ValidationSchema = yup.object().shape({
  name: yup.string().required("Please enter name"),
  email: yup.string().email("Please enter valid email").required("Please enter email"),
  bio: yup.string().min(10, "Please enter at least 10 characters").required("Please enter bio"),
  position: yup.string().required("Please select position"),
  party: yup.string().required("Please select party")
});


const CandidateForm = ({
  onClose,
  actionType,
  editData,
  fetchData
}) => {

  const {
    control,
    handleSubmit,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(ValidationSchema)
  });

  const {
    state: {
      candidates,
      parties,
      positions
    },
    dispatch
  } = useGlobalState();

  const [loading, setLoading] = useState(false);

  const updateFile = (incomingFile) => setFile(incomingFile);
  const [previewImg, setPreviewImg] = useState(null);
  const [file, setFile] = useState(undefined);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("bio", data.bio);
      formData.append("position", data.position);
      formData.append("party", data.party);
      formData.append("role", "candidate");
      // TODO:: change service depending on action type
      if(actionType === "edit") {
        if(file) {
          formData.append("file", file);
        }else {
          formData.append("file", editData.img);
        }
        formData.append("dataId", editData._id);
      }else {
        formData.append("file", file);
      }

      const resposneData = actionType === "edit" ? await ADMIN_SERVICE.editCandidate(formData) : await ADMIN_SERVICE.addCandidate(formData);

      if (resposneData.success) {
        fetchData();
        dispatch(setCandidatesData({
          candidates: [...candidates, data]
        }));
        toast.success(`Candidate ${actionType === "edit" ? "updated" : "added"} successfully`);
      } else {
        console.log("error while adding candidate ", resposneData);
        toast.error(resposneData.message);
      }
      onClose();
    } catch (error) {
      console.log("error in candidate form => ", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (actionType === "edit") {
      reset(editData);
      setPreviewImg(editData.img)
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Grid conatiner >
        <Grid item md={12} xs={12} sm={12} >
          <Grid container justifyContent="center" >
            <Grid item md={6} xs={12} sm={12} >
              <ImageDropzone updateFile={updateFile} previewImg={previewImg} />
            </Grid>
          </Grid>
        </Grid>

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
                error={error?.message}
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
                error={error?.message}
                helperText={error?.message}
                placeholder="enter email"
              />
            )}
          />
        </Grid>

        <Grid item md={12} xs={12} sm={12} >
          <Typography className="formLabel" >
            Bio
          </Typography>

          <Controller
            name="bio"
            control={control}
            render={({
              field: { onChange, value },
              fieldState: { error }
            }) => (
              <TextField
                multiline
                rows={4}
                fullWidth
                value={value || ""}
                onChange={onChange}
                error={error?.message}
                helperText={error?.message}
                placeholder="enter bio"
              />
            )}
          />
        </Grid>

        <Grid item md={12} xs={12} sm={12} >
          <Typography className="formLabel" >
            Position
          </Typography>

          <Controller
            name="position"
            control={control}
            render={({
              field: { onChange, value },
              fieldState: { error }
            }) => (
              <TextField
                select
                fullWidth
                value={value || ""}
                onChange={(e) => setValue("position", e.target.value)}
                error={error?.message}
                helperText={error?.message}
                placeholder="Select Positon"
                label="Position"
              >
                {
                  positions.map((position) => (
                    <MenuItem key={position._id} value={position._id} >
                      {position.name}
                    </MenuItem>
                  ))
                }
              </TextField>
            )}
          />
        </Grid>

        <Grid item md={12} xs={12} sm={12} >
          <Typography className="formLabel" >
            Party
          </Typography>

          <Controller
            name="party"
            control={control}
            render={({
              field: { onChange, value },
              fieldState: { error }
            }) => (
              <TextField
                select
                fullWidth
                value={value || ""}
                onChange={(e) => setValue("party", e.target.value)}
                error={error?.message}
                helperText={error?.message}
                placeholder="Select Party"
                label="Party"
              >
                {
                  parties.map((party) => (
                    <MenuItem key={party._id} value={party._id}>
                      {party.name}
                    </MenuItem>
                  ))
                }
              </TextField>
            )}
          />
        </Grid>
      </Grid>
      <div className="modalActionsDiv" >
        <Button onClick={onClose} color="primary" disabled={loading} >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={loading}
          endIcon={loading && <CircularProgress />}
          className="addUserButton"
          variant="outlined"
        >
          Submit
        </Button>
      </div>
    </form >
  )
}

export default CandidateForm;