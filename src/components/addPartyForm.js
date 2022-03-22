import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, Typography, TextField, Button, CircularProgress } from "@mui/material";
import useGlobalState from '../store';
import { setPartiesData } from "../store/actions";
import { ADMIN_SERVICE } from "../services/admin.services";
import { toast } from "react-toastify";

const ValidationSchema = yup.object().shape({
  name: yup.string().required("Please enter party name")
});

const AddPartyForm = ({
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
      parties
    },
    dispatch
  } = useGlobalState();

  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      // TODO:: change service depending on action type
      const resposneData =  actionType === "edit" ? await ADMIN_SERVICE.editParty({...data, "dataId": editData._id}) : await ADMIN_SERVICE.addParty(data);

      if(resposneData.success) {
        fetchData();
        dispatch(setPartiesData({
          parties: [...parties, data] 
        }));
        toast.success(`Party ${ actionType === "edit" ? "updated" : "added"}`);
      }else {
        console.log("error while adding partiy ", resposneData);
        toast.error(resposneData.message);
      }
      onClose();
    } catch (error) {
      console.log("error in add party form => ", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if(actionType === "edit") {
      reset(editData); 
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Grid conatiner >
        <Grid item md={12} xs={12} sm={12} >
          <Typography className="formLabel" >
            Party Name
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
                placeholder="enter party name"
              />
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

export default AddPartyForm;