import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Grid } from "@mui/material";
import AdminMenu from "../components/adminMenu";
import useGlobalState from "../store";
import TableComponent from "../components/table";
import { COMMON_SERVICE } from "../services/common.services";
import { setVotersData } from "../store/actions";
import Loader from "../components/loader";

const voterHeader = ["S.no", "Name", "Email", "Phone", "Actions"];

const Voters = () => {
  const {
    state: {
      voters
    },
    dispatch
  } = useGlobalState();

  const [loading, setLoading] = useState(false);

  const getAllVoters = async () => {
    try {
      setLoading(true);
      const responseData = await COMMON_SERVICE.getVoters();

      if (responseData.success) {
        dispatch(setVotersData({
          voters: [...responseData.data]
        }));
      }
    } catch (error) {
      console.log("error in getAllVoters ", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    getAllVoters();
  }, []);

  return (
    <Layout>
      <Grid container className="containerGrid" spacing={2} >
        <Grid item md={2} className="adminMenuGrid" >
          <AdminMenu />
        </Grid>

        <Grid item md={10} xs={12} sm={12} >
          <div className="mainContentDiv" >
            <div className="upperContentDiv" >
              <p>
                Voters
              </p>
            </div>

            <div className="lowerContentDiv" >
              {
                loading ?
                <Loader />
                :
                <TableComponent
                  headerArray={voterHeader}
                  dataArray={voters}
                  modalTitle=""
                  fetchData={getAllVoters}
                  canEdit={false}
                  canDelete={true}
                />
              }
            </div>
          </div>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Voters;